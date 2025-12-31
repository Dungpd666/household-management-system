import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export default registerAs(
  'typeorm',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,

    // 👇 THÊM ĐOẠN NÀY ĐỂ FIX LỖI NEON
    ssl: process.env.DB_SSL === 'true',
    extra:
      process.env.DB_SSL === 'true'
        ? {
            ssl: {
              rejectUnauthorized: false,
            },
          }
        : {},
    // 👆 HẾT PHẦN THÊM

    autoLoadEntities: true,

    // Mặc định KHÔNG auto-sync schema. Chỉ bật khi DEV và bạn hiểu rủi ro.
    synchronize: process.env.DB_SYNCHRONIZE === 'true',

    // Mặc định KHÔNG auto-run migrations khi khởi động.
    // Nếu DB đã có bảng sẵn, auto-run có thể làm app crash (vd: "relation \"users\" already exists").
    // Bật khi bạn muốn app tự chạy migrations.
    migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
    migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
  }),
);
