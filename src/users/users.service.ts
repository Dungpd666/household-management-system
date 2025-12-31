import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(data: Partial<User>, role: string) {
    try {
      const user = this.usersRepository.create(data);
      user.role = role;
      return await this.usersRepository.save(user);
    } catch (error) {
      if ((error as any)?.code === '23505') {
        const detail: string = (error as any).detail || '';

        if (detail.includes('(username)')) {
          throw new BadRequestException('Tên đăng nhập đã tồn tại. Vui lòng chọn tên đăng nhập khác.');
        }
        if (detail.includes('(email)')) {
          throw new BadRequestException('Email này đã được sử dụng. Vui lòng dùng một địa chỉ email khác.');
        }
        if (detail.includes('(phone)')) {
          throw new BadRequestException('Số điện thoại này đã được sử dụng. Vui lòng dùng một số điện thoại khác.');
        }

        throw new BadRequestException('Thông tin người dùng bị trùng. Vui lòng kiểm tra lại tên đăng nhập, email và số điện thoại.');
      }

      throw new BadRequestException('Không thể tạo người dùng mới. Vui lòng thử lại sau hoặc liên hệ quản trị viên.');    }
  }

  async findAllUsers() {
    try {
      const users = await this.usersRepository.find({
        select: [
          'id',
          'fullName',
          'userName',
          'email',
          'phone',
          'role',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
      });
      if (!users.length) {
        throw new NotFoundException('No users found');
      }
      return users;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findUserById(id: number) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        select: [
          'id',
          'fullName',
          'userName',
          'email',
          'phone',
          'role',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user by ID');
    }
  }

  async findUserByUserName(userName: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { userName },
        select: [
          'id',
          'fullName',
          'userName',
          'email',
          'phone',
          'role',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
      });
      if (!user) {
        throw new NotFoundException(`User with username ${userName} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user by username');
    }
  }

  async findUserWithPasswordByUserName(userName: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { userName },
        select: [
          'id',
          'fullName',
          'userName',
          'passWordHash',
          'email',
          'phone',
          'role',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
      });
      if (!user) {
        throw new NotFoundException(`User with username ${userName} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user by username (service)');
    }
  }

  async updateUser(id: number, data: Partial<User>) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.usersRepository.update(id, data);
      return await this.usersRepository.findOne({
        where: { id },
        select: [
          'id',
          'fullName',
          'userName',
          'email',
          'phone',
          'role',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
      });
    } catch (error) {
      if ((error as any)?.code === '23505') {
        const detail: string = (error as any).detail || '';

        if (detail.includes('(username)')) {
          throw new BadRequestException('Tên đăng nhập đã tồn tại. Vui lòng chọn tên đăng nhập khác.');
        }
        if (detail.includes('(email)')) {
          throw new BadRequestException('Email này đã được sử dụng. Vui lòng dùng một địa chỉ email khác.');
        }
        if (detail.includes('(phone)')) {
          throw new BadRequestException('Số điện thoại này đã được sử dụng. Vui lòng dùng một số điện thoại khác.');
        }

        throw new BadRequestException('Thông tin người dùng bị trùng. Vui lòng kiểm tra lại tên đăng nhập, email và số điện thoại.');
      }

      throw new BadRequestException('Không thể cập nhật người dùng. Vui lòng thử lại sau hoặc liên hệ quản trị viên.');    }
  }

  async removeUser(id: number) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id, isActive: true },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return { deleted: true, id };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
