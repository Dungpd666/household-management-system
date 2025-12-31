import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './person.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PaginationDto } from './dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from './utils/constants';
import { Household } from '../household/household.entity';
import { HouseholdService } from '../household/household.service';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepo: Repository<Person>,
    @Inject(forwardRef(() => HouseholdService))
    private householdService: HouseholdService,
  ) {}

  async create(dto: CreatePersonDto) {
    const { householdId, ...rest } = dto;

    const person = this.personRepo.create({
      ...rest,
      household: householdId ? { id: householdId } : undefined,
    });

    const savedPerson = await this.personRepo.save(person);

    // Nếu là chủ hộ và có email, generate password và gửi email
    if (
      savedPerson.relationshipWithHead === 'Chủ hộ' &&
      savedPerson.email &&
      householdId
    ) {
      try {
        const generatedPassword =
          await this.householdService.generatePasswordAndNotify(
            householdId,
            savedPerson.email,
          );
        console.log(
          `✅ Generated password and sent email to ${savedPerson.email}`,
        );
        console.log(`   Password: ${generatedPassword}`);
      } catch (error) {
        console.error('❌ Failed to generate password and send email:', error);
        // Không throw error để không block việc tạo person
      }
    }

    return savedPerson;
  }

  async findAll(paginationDto: PaginationDto) {
    return this.personRepo.find({
      relations: ['household'],
      skip: paginationDto.skip,
      take: paginationDto.limit ?? DEFAULT_PAGE_SIZE,
    });
  }

  async findOne(id: number) {
    const person = await this.personRepo.findOne({
      where: { id },
      relations: ['household'], // khi lấy thì lấy thêm cả household kh thì nos sẽ là undefined
    });

    if (!person) {
      throw new NotFoundException('Person with ID =  ' + id + ' not found ');
    }

    return person;
  }

  async update(id: number, dto: UpdatePersonDto) {
    const { householdId, ...rest } = dto;

    const updatePayload: any = { ...rest };

    if (householdId) {
      updatePayload.household = { id: householdId };
    }

    await this.personRepo.update(id, updatePayload);

    return this.findOne(id);
  }

  async remove(id: number) {
    const person = await this.findOne(id);
    await this.personRepo.remove(person);
    return { deleted: true };
  }

  async findOneByIdentificationNumber(identificationNumber: string) {
    const person = await this.personRepo.findOne({
      where: { identificationNumber: identificationNumber },
      relations: ['household'],
    });

    if (!person) {
      throw new NotFoundException(
        `Person with identification number ${identificationNumber} not found`,
      );
    }

    return person;
  }

  async ageGroup() {
    const Population = await this.personRepo.find({
      select: ['dateOfBirth'],
      relations: ['household'],
    });
    const groups = {
      '0-17': 0,
      '18-35': 0,
      '36-60': 0,
      '60+': 0,
    };
    Population.forEach((element) => {
      const today = new Date();
      const age = today.getFullYear() - element.dateOfBirth.getFullYear();
      if (age < 18) groups['0-17']++;
      else if (age <= 35) groups['18-35']++;
      else if (age <= 60) groups['36-60']++;
      else groups['60+']++;
    });
    return groups;
  }

  async jobGroup() {
    const Jobs = await this.personRepo.find({
      select: ['occupation'],
      relations: ['household'],
    });
    const group = {};
    Jobs.forEach((job) => {
      const job_name = job.occupation || '';
      if (group[job_name] == null) {
        group[job_name] = 1;
      } else {
        group[job_name] += 1;
      }
    });
    return group;
  }

  async genderGroup() {
    const Gender = await this.personRepo.find({
      select: ['gender'],
      relations: ['household'],
    });
    const group = {
      male: 0,
      female: 0,
    };
    Gender.forEach((sex) => {
      if (sex.gender === 'male') {
        group['male'] += 1;
      } else {
        group['female'] += 1;
      }
    });
    return group;
  }
  async importFromCsv(buffer: Buffer) {
    const csvText = buffer.toString('utf8');
    // Tách dòng, xử lý cả xuống dòng Windows (\r\n) và Linux (\n)
    const lines = csvText.split(/\r\n|\n/);

    const personsToSave: Person[] = [];

    // Bỏ qua dòng tiêu đề (i = 1)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line.split(',');
      const getValue = (index: number): string | null => {
        const val = columns[index];
        if (!val || val.trim() === '') return null;
        return val.trim();
      };

      // Kiểm tra tối thiểu: Phải có tên (Cột 0)
      const fullName = getValue(0);
      if (!fullName) continue; // Không có tên thì bỏ qua dòng này

      const person = new Person();
      person.fullName = fullName;

      const dobStr = getValue(1);
      if (dobStr) {
        const date = new Date(dobStr);
        if (!isNaN(date.getTime())) {
          person.dateOfBirth = date;
        }
      }

      person.gender = getValue(2) || '';
      person.identificationNumber = getValue(3) || '';
      person.relationshipWithHead = getValue(4) || ' ';
      person.occupation = getValue(5) || ' ';
      person.educationLevel = getValue(6) || ' ';
      person.migrationStatus = getValue(7) || ' ';

      const deadStr = getValue(8)?.toLowerCase();
      person.isDeceased = deadStr === 'true' || deadStr === '1';

      const householdIdStr = getValue(9);
      if (householdIdStr) {
        const hhId = parseInt(householdIdStr);
        if (!isNaN(hhId)) {
          person.household = { id: hhId } as Household;
        }
      }
      personsToSave.push(person);
    }

    try {
      await this.personRepo.save(personsToSave);
      return {
        message: `Import thành công ${personsToSave.length} người (bao gồm các trường NULL)!`,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Lỗi lưu DB: Kiểm tra lại Unique CCCD hoặc ID Hộ.',
      );
    }
  }

  async exportToCsv(): Promise<string> {
    const persons = await this.personRepo.find({ relations: ['household'] });
    const header =
      'ID,Full Name,Date of Birth,Gender,Identification Number,Relationship with Head,Occupation,Education Level,Migration Status,Is Deceased,Household ID,Household Address\n';

    const rows = persons
      .map((person) => {
        const householdId = person.household ? person.household.id : '';
        const householdAddress = person.household
          ? person.household.address
          : '';
        // Dùng JSON.stringify để bao quanh các giá trị có thể chứa dấu phẩy bằng dấu ngoặc kép
        return [
          person.id,
          person.fullName,
          person.dateOfBirth.toISOString().split('T')[0], // Format YYYY-MM-DD
          person.gender,
          `\t${person.identificationNumber}`, // Thêm \t để Excel hiểu là Text
          person.relationshipWithHead,
          person.occupation,
          person.educationLevel,
          person.migrationStatus,
          person.isDeceased,
          householdId,
          householdAddress,
        ]
          .map((value) => {
            const strValue = String(value ?? ''); // Chuyển null/undefined thành chuỗi rỗng
            if (strValue.includes(',')) {
              return `"${strValue}"`; // Bao quanh bằng dấu ngoặc kép nếu có dấu phẩy
            }
            return strValue;
          })
          .join(',');
      })
      .join('\n');

    // Thêm BOM (\uFEFF) vào đầu chuỗi để Excel nhận diện UTF-8
    return '\uFEFF' + header + rows;
  }
}
