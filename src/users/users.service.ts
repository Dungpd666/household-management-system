import { Injectable } from '@nestjs/common';
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
        const user = this.usersRepository.create(data);
        user.role = role;
        return this.usersRepository.save(user);
    }
    async findAllUsers() {
        return this.usersRepository.find({ relations: ['Users'] });
    }
    async findUserById(id: number) {
        return this.usersRepository.findOne({
            where: { id },
            relations: ['Users'],
        });
    }
    async updateUser(id: number, data: Partial<User>) {
        await this.usersRepository.update(id, data);
        return this.usersRepository.findOne({ where: { id } });
    }
    async removeUser(id: number) {
        await this.usersRepository.delete(id);
        return { deleted: true };
    }
}
