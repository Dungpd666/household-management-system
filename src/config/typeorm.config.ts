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

    // SSL config for cloud databases (e.g., Neon)
    ssl: process.env.DB_SSL === 'true',
    extra:
      process.env.DB_SSL === 'true'
        ? {
            ssl: {
              rejectUnauthorized: false,
            },
          }
        : {},

    autoLoadEntities: true,

    // Auto-sync schema - only enable in dev mode when you understand the risks
    synchronize: process.env.DB_SYNCHRONIZE === 'true',

    // Auto-run migrations on startup - can crash if tables already exist
    migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
    migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],

    // Query logging for debugging
    logging: ['query', 'error'],
  }),
);
