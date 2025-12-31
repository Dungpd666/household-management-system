import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config as loadEnv } from 'dotenv';
import { User } from '../src/users/users.entity';
import typeormConfig from '../src/config/typeorm.config';
import * as bcrypt from 'bcrypt';

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

    const username = 'superadmin';
    const plainPassword = 'superadmin123';
    const saltRounds = 10;

    const existing = await userRepo.findOne({ where: { userName: username } });
    if (existing) {
      const looksBcrypt = typeof existing.passWordHash === 'string' && existing.passWordHash.startsWith('$2');
      if (!looksBcrypt) {
        existing.passWordHash = await bcrypt.hash(plainPassword, saltRounds);
        existing.isActive = true;
        await userRepo.save(existing);
        console.log('Repaired superadmin password_hash to bcrypt and reactivated account.');
      } else {
        console.log('Superadmin already exists with username "superadmin"');
      }
      console.log('  username: superadmin');
      console.log('  password: superadmin123');
      return;
    }

    const admin = userRepo.create({
      fullName: 'Super Administrator',
      userName: username,
      passWordHash: await bcrypt.hash(plainPassword, saltRounds),
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
