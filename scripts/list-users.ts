import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config as loadEnv } from 'dotenv';
import { User } from '../src/users/users.entity';
import typeormConfig from '../src/config/typeorm.config';

loadEnv();

async function listUsers() {
  const ormOptions = (typeormConfig as any)();

  const dataSource = new DataSource({
    ...ormOptions,
    entities: [User],
  });

  try {
    await dataSource.initialize();
    const userRepo = dataSource.getRepository(User);
    const users = await userRepo.find();

    console.log('Current users in DB:');
    if (!users.length) {
      console.log('  (no users)');
      return;
    }
    for (const u of users) {
      console.log(`  id=${u.id}, userName=${u.userName}, email=${u.email}, phone=${u.phone}, role=${u.role}, isActive=${u.isActive}, passWordHash=${u.passWordHash}`);
    }
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      // @ts-ignore
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
    })();
  }
}

listUsers();
