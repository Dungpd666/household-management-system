import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendHouseholdCredentials(
    email: string,
    householdCode: string,
    password: string,
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

    const mailOptions = {
      from: this.configService.get<string>('SMTP_FROM'),
      to: email,
      subject: 'Thông tin đăng nhập Hệ thống Quản lý Hộ Khẩu',
      html: `
        <!DOCTYPE html>
        <html lang="">
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .credential-item { margin: 15px 0; }
            .label { color: #6b7280; font-size: 14px; margin-bottom: 5px; }
            .value { font-size: 18px; font-weight: bold; color: #1f2937; font-family: 'Courier New', monospace; background: #f3f4f6; padding: 10px; border-radius: 5px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🏠 Hệ thống Quản lý Hộ Khẩu</h1>
              <p style="margin: 10px 0 0 0;">Thông tin đăng nhập của bạn</p>
            </div>
            <div class="content">
              <p>Xin chào,</p>
              <p>Tài khoản hộ khẩu của bạn đã được tạo thành công trong hệ thống. Dưới đây là thông tin đăng nhập:</p>

              <div class="credentials">
                <div class="credential-item">
                  <div class="label">Mã hộ khẩu:</div>
                  <div class="value">${householdCode}</div>
                </div>
                <div class="credential-item">
                  <div class="label">Mật khẩu:</div>
                  <div class="value">${password}</div>
                </div>
              </div>

              <div class="warning">
                <strong>⚠️ Lưu ý bảo mật:</strong><br>
                Vui lòng giữ bí mật thông tin đăng nhập này. Sau khi đăng nhập lần đầu, bạn nên đổi mật khẩu để đảm bảo an toàn.
              </div>

              <div style="text-align: center;">
                <a href="${frontendUrl}/household/login" class="button">
                  Đăng nhập ngay
                </a>
              </div>

              <p style="margin-top: 30px;">Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với ban quản lý.</p>

              <div class="footer">
                <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                <p>&copy; 2025 Hệ thống Quản lý Hộ Khẩu. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully to ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${email}:`, error);
      throw error;
    }
  }
}
