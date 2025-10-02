import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export default registerAs('typeorm', (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: false, // ❌ Tắt synchronize trong môi trường thực
  migrationsRun: true, // ✅ chạy migration tự động khi app start
  migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
}));
