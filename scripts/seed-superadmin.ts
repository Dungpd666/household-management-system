import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config as loadEnv } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { User } from '../src/users/users.entity';
import typeormConfig from '../src/config/typeorm.config';

loadEnv();

async function seedSuperAdmin() {
  // typeormConfig is a config factory registered with Nest; calling it
  // returns the TypeOrmModuleOptions object using current process.env
  const ormOptions = (typeormConfig as any)();

  const dataSource = new DataSource({
    ...ormOptions,
    entities: [User],
  });

  try {
    await dataSource.initialize();

    const userRepo = dataSource.getRepository(User);

    const existing = await userRepo.findOne({ where: { userName: 'superadmin' } });
    if (existing) {
      console.log('Superadmin already exists with username "superadmin"');
      console.log('Updating password to hashed version...');
      const hashedPassword = await bcrypt.hash('superadmin123', 10);
      existing.passWordHash = hashedPassword;
      await userRepo.save(existing);
      console.log('Password updated successfully!');
      await dataSource.destroy();
      return;
    }

    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    const admin = userRepo.create({
      fullName: 'Super Administrator',
      userName: 'superadmin',
      passWordHash: hashedPassword,
      email: 'superadmin@example.com',
      phone: '0900000000',
      role: 'superadmin',
      isActive: true,
    });

    await userRepo.save(admin);
    console.log('Seeded superadmin account:');
    console.log('  username: superadmin');
    console.log('  password: superadmin123');
  } catch (error) {
    console.error('Failed to seed superadmin:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

seedSuperAdmin();
