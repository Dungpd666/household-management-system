import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
        throw new BadRequestException('Failed to create user: ' + error.message);
        }
    }

    async findAllUsers() {
        try {
            const users = await this.usersRepository.find();
            if (!users.length) {
                throw new NotFoundException('No users found');
            }
            return users;
        } 
        catch (error) {
        throw new InternalServerErrorException('Failed to fetch users');
        }
    }

    async findUserById(id: number) {
        try {
            const user = await this.usersRepository.findOne({ where: { id } });
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            return user;
        } catch (error) {
        throw new InternalServerErrorException('Error fetching user by ID');
        }
    }

    async findUserByUserName(userName: string ){
        try {
            const user = await this.usersRepository.findOne({ where: { userName } });
            if (!user) {
                throw new NotFoundException(`User with username ${userName} not found`);
            }
            return user;
        } catch (error) {
        throw new InternalServerErrorException('Error fetching user by username');
        }
    }

    async updateUser(id: number, data: Partial<User>) {
        try {
            const user = await this.usersRepository.findOne({ where: { id }});
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            await this.usersRepository.update(id, data);
            return await this.usersRepository.findOne({ where: { id } });
        } catch (error) {
        throw new BadRequestException('Failed to update user: ' + error.message);
        }
    }

    async removeUser(id: number) {
        try {
            const user = await this.usersRepository.findOne({ where: { id, isActive: true } });
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            await this.usersRepository
            .createQueryBuilder('user')
            .update(User)
            .set({ isActive: false })
            .execute();
            return { deleted: true };
        } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('Failed to delete user');
        }
    }
}
