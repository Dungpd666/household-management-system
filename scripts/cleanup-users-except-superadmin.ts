import 'reflect-metadata';
import { DataSource, Not } from 'typeorm';
import { config as loadEnv } from 'dotenv';
import { User } from '../src/users/users.entity';
import typeormConfig from '../src/config/typeorm.config';

loadEnv();

async function cleanupUsersExceptSuperadmin() {
  const ormOptions = (typeormConfig as any)();

  const dataSource = new DataSource({
    ...ormOptions,
    entities: [User],
  });

  try {
    await dataSource.initialize();

    const userRepo = dataSource.getRepository(User);

    // Đảm bảo vẫn còn tài khoản superadmin hiện tại
    const superAdmin = await userRepo.findOne({ where: { userName: 'superadmin' } });
    if (!superAdmin) {
      console.error('Không tìm thấy tài khoản superadmin (username = "superadmin"). Dừng thao tác để tránh mất quyền quản trị.');
      return;
    }

    const deleteResult = await userRepo.delete({ userName: Not('superadmin') });

    console.log(`Đã xóa ${deleteResult.affected ?? 0} tài khoản, chỉ chừa lại superadmin.`);
  } catch (error) {
    console.error('Lỗi khi dọn dẹp người dùng:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

cleanupUsersExceptSuperadmin();
