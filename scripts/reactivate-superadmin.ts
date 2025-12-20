import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config as loadEnv } from 'dotenv';
import { User } from '../src/users/users.entity';
import typeormConfig from '../src/config/typeorm.config';

loadEnv();

async function reactivateSuperadmin() {
  const ormOptions = (typeormConfig as any)();

  const dataSource = new DataSource({
    ...ormOptions,
    entities: [User],
  });

  try {
    await dataSource.initialize();
    const userRepo = dataSource.getRepository(User);

    const superadmin = await userRepo.findOne({ where: { userName: 'superadmin' } });

    if (!superadmin) {
      console.log('No user with username "superadmin" found');
      return;
    }

    superadmin.isActive = true;
    await userRepo.save(superadmin);

    console.log('Reactivated superadmin account:');
    console.log(`  id=${superadmin.id}, userName=${superadmin.userName}, isActive=${superadmin.isActive}`);
  } catch (error) {
    console.error('Failed to reactivate superadmin:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

reactivateSuperadmin();
