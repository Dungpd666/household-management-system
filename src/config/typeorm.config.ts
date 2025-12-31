import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

const toBool = (v: string | undefined, fallback = false) => {
  if (v === undefined) return fallback;
  return ['true', '1', 'yes', 'on'].includes(v.toLowerCase());
};

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
    ssl: toBool(process.env.DB_SSL, false),
    extra: toBool(process.env.DB_SSL, false)
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},

    autoLoadEntities: true,

    // Auto-sync schema - only enable in dev mode when you understand the risks
    synchronize: toBool(process.env.DB_SYNCHRONIZE, false),

    // Auto-run migrations on startup - can crash if tables already exist
    migrationsRun: toBool(process.env.DB_MIGRATIONS_RUN, false),
    migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],

    // Query logging for debugging
    logging: ['error'],
  }),
);
