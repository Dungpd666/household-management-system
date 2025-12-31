import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PopulationEvent } from './population-event.entity';
import { CreatePopulationEventDto } from './dto/create-population-event.dto';
import { UpdatePopulationEventDto } from './dto/update-population-event.dto';
import { Person } from '../person/person.entity';
import { Household } from '../household/household.entity';
import { PopulationEventType } from './dto/create-population-event.dto';
import { User } from '../users/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PopulationEventService {
  constructor(
    @InjectRepository(PopulationEvent)
    private populationEventRepo: Repository<PopulationEvent>,
    @InjectRepository(Person)
    private personRepo: Repository<Person>,
    @InjectRepository(Household)
    private householdRepo: Repository<Household>,
    private dataSource: DataSource, // Sử dụng Transaction để đảm bảo toàn vẹn dữ liệu
    private usersService: UsersService,
  ) {}

  async create(dto: CreatePopulationEventDto, user?: User) {
    const { personId, targetHouseholdId, ...rest } = dto;

    // Bắt đầu Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lấy thông tin Person liên quan
      const person = await queryRunner.manager.findOne(Person, {
        where: { id: personId },
        relations: ['household'],
      });

      if (!person) {
        throw new NotFoundException(`Person with ID ${personId} not found`);
      }

      // Xử lý theo loại sự kiện
      switch (dto.type) {
        // Khai sinh, bao gồm cả nhập khẩu
        case PopulationEventType.BIRTH: {
          if (!targetHouseholdId) {
            throw new BadRequestException(
              'targetHouseholdId is required for CHANGE_HOUSEHOLD event',
            );
          }

          const targetHousehold = await queryRunner.manager.findOne(Household, {
            where: { id: targetHouseholdId },
          });
          if (!targetHousehold) {
            throw new NotFoundException(
              `Target Household with ID ${targetHouseholdId} not found`,
            );
          }

          person.household = targetHousehold;
          person.relationshipWithHead =
            dto.targetRelationshipWithHead ||
            person.relationshipWithHead ||
            'Con cái';
          break;
        }

        case PopulationEventType.DEATH:
          person.isDeceased = true;
          break;

        case PopulationEventType.CHANGE_HOUSEHOLD: {
          if (!targetHouseholdId) {
            throw new BadRequestException(
              'targetHouseholdId is required for CHANGE_HOUSEHOLD event',
            );
          }

          const targetHousehold = await queryRunner.manager.findOne(Household, {
            where: { id: targetHouseholdId },
          });
          if (!targetHousehold) {
            throw new NotFoundException(
              `Target Household with ID ${targetHouseholdId} not found`,
            );
          }

          person.household = targetHousehold;
          person.relationshipWithHead =
            dto.targetRelationshipWithHead ||
            person.relationshipWithHead ||
            'Thành viên khác';
          break;
        }

        case PopulationEventType.ABSENCE:
          person.migrationStatus = 'Tạm vắng';
          break;

        case PopulationEventType.RETURN:
          person.migrationStatus = 'Thường trú';
          break;
      }

      // 3. Lưu thông tin Person đã cập nhật
      await queryRunner.manager.save(person);

      // Lấy user xử lý sự kiện trên
      const handleUser = user
        ? await this.usersService.findUserById(user.id)
        : null;

      // 4. Tạo và lưu sự kiện
      const eventData: any = { ...rest, person };
      if (handleUser) {
        eventData.handledBy = handleUser;
      }
      const populationEvent = queryRunner.manager.create(
        PopulationEvent,
        eventData,
      );
      const savedEvent = await queryRunner.manager.save(populationEvent);

      // Kết thúc Transaction, commit mọi thay đổi
      await queryRunner.commitTransaction();

      return savedEvent;
    } catch (err) {
      // Nếu có lỗi, rollback lại mọi thay đổi
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Ngắt kết nối queryRunner
      await queryRunner.release();
    }
  }

  // Lấy danh sách tất cả sự kiện,
  async findAll() {
    return this.populationEventRepo.find({
      relations: ['person', 'handledBy'],
      order: { eventDate: 'DESC' },
    });
  }

  // Lấy chi tiết một sự kiện theo ID
  async findOne(id: number) {
    const populationEvent = await this.populationEventRepo.findOne({
      where: { id },
      relations: ['person', 'handledBy'],
    });

    if (!populationEvent) {
      throw new NotFoundException(`Sự kiện ID ${id} không tìm thấy`);
    }

    return populationEvent;
  }

  // Update: Không cho phép cập nhật loại sự kiện
  async update(id: number, dto: UpdatePopulationEventDto) {
    const populationEvent = await this.findOne(id);
    const data = await this.populationEventRepo.save(populationEvent);

    Object.assign(populationEvent, dto);
    return data;
  }

  async remove(id: number) {
    const populationEvent = await this.findOne(id);
    await this.populationEventRepo.remove(populationEvent);
    return { message: 'Population event removed successfully', deleted: true };
  }
}

