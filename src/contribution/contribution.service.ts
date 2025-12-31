import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { Contribution } from './contribution.entity';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { MarkPaidDto } from './dto/mark-paid.dto';
import { HouseholdService } from 'src/household/household.service';

import * as qs from 'qs';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContributionService {
  private readonly logger = new Logger(ContributionService.name);

  constructor(
    @InjectRepository(Contribution)
    private readonly repo: Repository<Contribution>,
    private readonly householdService: HouseholdService,
    private readonly configService: ConfigService,
  ) {}

  // Tạo đóng góp
  async create(createDto: CreateContributionDto) {
    const contributions: Contribution[] = [];
    for (const householdId of createDto.householdIds) {
      await this.householdService.findOne(householdId);
      const c = this.repo.create({
        ...createDto,
        dueDate: createDto.dueDate ? new Date(createDto.dueDate) : null,
        paid: false,
        paidAt: null,
        householdId: householdId,
      });
      await this.repo.save(c);
      contributions.push(c);
    }
    return contributions;
  }

  // Lấy danh sách đóng góp với bộ lọc theo hộ gia đình
  async findAll(householdId: number | undefined) {
    const qb = this.repo.createQueryBuilder('c');
    if (householdId) {
      qb.andWhere('c.household_id = :householdId', { householdId });
    }
    const items = await qb.orderBy('c.due_date', 'ASC').getMany();
    return items;
  }

  // Lấy đóng góp theo ID
  async findById(id: number) {
    const c = await this.repo
      .createQueryBuilder('c')
      .where('c.id = :id', { id })
      .getOne();
    if (!c) {
      throw new NotFoundException('Contribution not found');
    }
    return c;
  }

  // Cập nhật đóng góp
  async update(id: number, updateDto: UpdateContributionDto) {
    const c = await this.findById(id);
    if (!c) throw new NotFoundException('Contribution not found');
    Object.assign(c, updateDto);
    // Tự cập nhật ngày thanh toán
    c.paidAt = updateDto.paid
      ? updateDto.paidAt
        ? new Date(updateDto.paidAt)
        : new Date()
      : null;
    return await this.repo.save(c);
  }

  // Cập nhật là đã thanh toán
  async markPaid(id: number, dto: MarkPaidDto) {
    const c = await this.findById(id);
    if (!c) throw new NotFoundException('Contribution not found');

    c.paid = true;
    c.paidAt = dto.paidAt ? new Date(dto.paidAt) : new Date();
    const saved = await this.repo.save(c);
    // Gửi thông báo, ghi vào log
    return saved;
  }

  // Xóa đóng góp
  async remove(id: number) {
    const c = await this.findById(id);
    if (!c) throw new NotFoundException('Contribution not found');
    await this.repo.remove(c);
    return { deleted: true };
  }

  // Lấy thông tin để phân tích
  async getStatistics() {
    const total = await this.repo.count();
    const paid = await this.repo.count({ where: { paid: true } });
    const unpaid = await this.repo.count({ where: { paid: false } });
    const totalAmountRaw = await this.repo
      .createQueryBuilder('c')
      .select('SUM(c.amount)', 'sum')
      .getRawOne<{ sum: string | null }>();
    return {
      total,
      paid,
      unpaid,
      totalAmount: Number(totalAmountRaw?.sum ?? 0),
    };
  }

  // Định dạng ngày theo chuẩn VNPAY
  private formatDate(date: Date) {
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const HH = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
  }

  // Sắp xếp các tham số theo thứ tự tăng dần của khóa
  private sortObject(obj: Record<string, any>) {
    const sorted: Record<string, any> = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = obj[key];
    });

    // Mã hóa url, thay dấu cách bằng dấu cộng
    for (const key in sorted) {
      if (typeof sorted[key] === 'string') {
        sorted[key] = encodeURIComponent(sorted[key]).replace(/%20/g, '+');
      }
    }
    return sorted;
  }

  // Tạo URL thanh toán VNPAY
  async createVnpayUrl(contributionId: number, clientIp: string) {
    // Kiểm tra đóng góp tồn tại
    const contribution = await this.findById(contributionId);
    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }
    if (contribution.paid) {
      throw new BadRequestException('Contribution already paid');
    }

    // Lấy các tham số VNPAY
    const tmnCode = this.configService.get<string>('vnpay.vnp_TmnCode');
    const hashSecret =
      this.configService.get<string>('vnpay.vnp_HashSecret') || '';
    const vnpUrl = this.configService.get<string>('vnpay.vnp_Url');
    const returnUrl = this.configService.get<string>('vnpay.vnp_ReturnUrl');
    const timeLimit = this.configService.get<number>('vnpay.timeLimit') || 15;
    const createDate = this.formatDate(new Date());
    const expireDate = this.formatDate(
      new Date(Date.now() + timeLimit * 60 * 1000),
    );
    const orderId = `${contribution.id}-${Date.now()}`;
    const amount = contribution.amount * 100; // Tính theo VND * 100

    const params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Amount: amount,
      vnp_BankCode: 'NCB',
      vnp_CreateDate: createDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: clientIp,
      vnp_Locale: 'vn',
      vnp_OrderInfo: `Thanh toan dong gop ID ${contribution.id}`,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: returnUrl,
      vnp_ExpireDate: expireDate,
      vnp_TxnRef: orderId,
    };

    // Sắp xếp các tham số theo đúng thứ tự
    const sorted = this.sortObject(params);

    // Tạo chuỗi được băm
    const signData = qs.stringify(sorted, { encode: false });
    const hmac = crypto.createHmac('sha512', hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    sorted['vnp_SecureHash'] = signed;

    // Ghép lại thành URL hoàn chỉnh
    const paymentUrl = `${vnpUrl}?${qs.stringify(sorted, { encode: false })}`;
    return { contribution, paymentUrl };
  }

  // Tạo URL VNPay cho nhiều đóng góp
  async createVnpayUrlMultiple(contributionIds: number[], clientIp: string) {
    // Kiểm tra tất cả contributions tồn tại và chưa thanh toán
    const contributions = await Promise.all(
      contributionIds.map((id) => this.findById(id)),
    );

    for (const contribution of contributions) {
      if (!contribution) {
        throw new NotFoundException('One or more contributions not found');
      }
      if (contribution.paid) {
        throw new BadRequestException(
          `Contribution ${contribution.id} already paid`,
        );
      }
    }

    // Tính tổng số tiền
    const totalAmount = contributions.reduce(
      (sum, c) => sum + (c.amount || 0),
      0,
    );

    // Lấy các tham số VNPAY
    const tmnCode = this.configService.get<string>('vnpay.vnp_TmnCode');
    const hashSecret =
      this.configService.get<string>('vnpay.vnp_HashSecret') || '';
    const vnpUrl = this.configService.get<string>('vnpay.vnp_Url');
    const returnUrl = this.configService.get<string>('vnpay.vnp_ReturnUrl');
    const timeLimit = this.configService.get<number>('vnpay.timeLimit') || 15;

    this.logger.debug('VNPay config:', { tmnCode, vnpUrl, returnUrl, timeLimit });
    const createDate = this.formatDate(new Date());
    const expireDate = this.formatDate(
      new Date(Date.now() + timeLimit * 60 * 1000),
    );

    // Tạo order ID từ các contribution IDs
    const orderId = `${contributionIds.join('-')}-${Date.now()}`;
    const amount = totalAmount * 100; // Tính theo VND * 100

    const params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Amount: amount,
      vnp_BankCode: 'NCB',
      vnp_CreateDate: createDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: clientIp,
      vnp_Locale: 'vn',
      vnp_OrderInfo: `Thanh toan ${contributionIds.length} khoan dong gop`,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: returnUrl,
      vnp_ExpireDate: expireDate,
      vnp_TxnRef: orderId,
    };

    // Sắp xếp các tham số theo đúng thứ tự
    const sorted = this.sortObject(params);

    // Tạo chuỗi được băm
    const signData = qs.stringify(sorted, { encode: false });
    const hmac = crypto.createHmac('sha512', hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    sorted['vnp_SecureHash'] = signed;

    // Ghép lại thành URL hoàn chỉnh
    const paymentUrl = `${vnpUrl}?${qs.stringify(sorted, { encode: false })}`;
    return {
      contributions,
      totalAmount,
      paymentUrl,
    };
  }

  // Xử lý phản hồi từ VNPAY
  async handleVnpayReturn(query: any) {
    const secretKey =
      this.configService.get<string>('vnpay.vnp_HashSecret') || '';
    const vnp_SecureHash = query['vnp_SecureHash'];
    // Loại bỏ tham số không cần thiết
    delete query['vnp_SecureHash'];
    delete query['vnp_SecureHashType'];

    // Tạo chuỗi băm từ các tham số nhận được
    const sortedQuery = this.sortObject(query);
    const signData = qs.stringify(sortedQuery, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Kiểm tra chữ ký - nếu không khớp thì từ chối
    if (signed !== vnp_SecureHash) {
      throw new ForbiddenException('Invalid signature');
    }

    // Lấy các tham số cần thiết
    const responseCode = query['vnp_ResponseCode'];
    const txnRef = query['vnp_TxnRef'] as string;

    // Lấy contributionIds từ txnRef
    // Format: {id1}-{id2}-...-{timestamp}
    const parts = txnRef.split('-');
    const timestamp = parts[parts.length - 1]; // Phần cuối là timestamp
    const contributionIds: number[] = [];

    // Parse các IDs (tất cả parts trừ timestamp cuối)
    for (let i = 0; i < parts.length - 1; i++) {
      const id = Number(parts[i]);
      if (!Number.isNaN(id)) {
        contributionIds.push(id);
      }
    }

    if (contributionIds.length === 0) {
      throw new BadRequestException('Invalid order reference');
    }

    // Kiểm tra contributions có tồn tại không
    const contributions = await Promise.all(
      contributionIds.map((id) => this.findById(id)),
    );

    for (const contribution of contributions) {
      if (!contribution) {
        throw new NotFoundException('One or more contributions not found');
      }
    }

    // Xử lý theo mã phản hồi từ VNPAY
    if (responseCode === '00') {
      // Thanh toán thành công - Cập nhật tất cả contributions
      for (const contribution of contributions) {
        contribution.paid = true;
        contribution.paidAt = new Date();
        await this.repo.save(contribution);
      }

      return {
        success: true,
        message: 'Payment successful',
        contributionIds: contributionIds,
        transactionRef: txnRef,
      };
    }

    // Thanh toán thất bại hoặc bị hủy
    return {
      success: false,
      message: 'Payment failed or cancelled',
      responseCode,
      contributionIds: contributionIds,
      transactionRef: txnRef,
    };
  }

  // Xử lý IPN (Instant Payment Notification) từ VNPAY
  async handleVnpayIpn(query: any) {
    this.logger.log(
      `VNPAY IPN for transactionId ${query['vnp_TxnRef']} received`,
    );

    try {
      const secretKey =
        this.configService.get<string>('vnpay.vnp_HashSecret') || '';
      const vnp_SecureHash = query['vnp_SecureHash'];
      const rspCode = query['vnp_ResponseCode'];
      const txnRef = query['vnp_TxnRef'] as string;

      // Tạo bản sao query để kiểm tra chữ ký
      const queryToVerify = { ...query };
      delete queryToVerify['vnp_SecureHash'];
      delete queryToVerify['vnp_SecureHashType'];

      // Tạo chuỗi băm từ các tham số nhận được
      const sortedQuery = this.sortObject(queryToVerify);
      const signData = qs.stringify(sortedQuery, { encode: false });
      const hmac = crypto.createHmac('sha512', secretKey);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      // Kiểm tra chữ ký
      if (signed !== vnp_SecureHash) {
        this.logger.error('Invalid IPN signature');
        return { RspCode: '97', Message: 'Invalid signature' };
      }

      // Lấy contributionId từ txnRef
      const contributionId = Number(txnRef.split('-')[0]);
      if (Number.isNaN(contributionId)) {
        this.logger.error('Invalid order reference in IPN');
        return { RspCode: '01', Message: 'Invalid order reference' };
      }

      // Kiểm tra contribution có tồn tại không
      const contribution = await this.findById(contributionId).catch(
        () => null,
      );
      if (!contribution) {
        this.logger.error(`Contribution ${contributionId} not found in IPN`);
        return { RspCode: '01', Message: 'Order not found' };
      }

      // Kiểm tra xem đã thanh toán chưa (tránh xử lý trùng)
      if (contribution.paid) {
        this.logger.warn(
          `Contribution ${contributionId} already paid, skipping IPN`,
        );
        return { RspCode: '02', Message: 'Order already confirmed' };
      }

      // Kiểm tra số tiền
      const vnpAmount = Number(query['vnp_Amount']);
      const expectedAmount = contribution.amount * 100; // VND * 100
      if (vnpAmount !== expectedAmount) {
        this.logger.error(
          `Amount mismatch for contribution ${contributionId}: expected ${expectedAmount}, got ${vnpAmount}`,
        );
        return { RspCode: '04', Message: 'Invalid amount' };
      }

      // Xử lý theo mã phản hồi từ VNPAY
      if (rspCode === '00') {
        // Thanh toán thành công - cập nhật trạng thái
        await this.markPaid(contributionId, {
          paidAt: new Date().toISOString(),
        });
        this.logger.log(
          `Contribution ${contributionId} marked as paid via IPN`,
        );
        return { RspCode: '00', Message: 'Confirm Success' };
      } else {
        // Thanh toán thất bại
        this.logger.warn(
          `Payment failed for contribution ${contributionId}, responseCode: ${rspCode}`,
        );
        return { RspCode: '00', Message: 'Confirm Success' }; // Vẫn trả về success để VNPAY không gọi lại
      }
    } catch (error) {
      this.logger.error('Error processing IPN', error);
      return { RspCode: '99', Message: 'Unknown error' };
    }
  }
}

