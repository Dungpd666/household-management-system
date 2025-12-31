import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

// Simple DataSource using env vars consistent with Nest config
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false, // do not alter schema here
  entities: [], // not needed for raw queries
});

async function reset() {
  try {
    await dataSource.initialize();
    const queryRunner = dataSource.createQueryRunner();
    // Use CASCADE to satisfy foreign keys; RESTART IDENTITY resets sequences.
    // Adjust table names if they differ (case-insensitive).
    const tables = ['contributions', 'persons', 'households', 'users'];
    const sql = `TRUNCATE TABLE ${tables.join(', ')} RESTART IDENTITY CASCADE;`;
    console.log('Executing:', sql);
    await queryRunner.query(sql);
    console.log('All data truncated. Schema preserved.');
    await queryRunner.release();
  } catch (err) {
    console.error('Reset failed:', err);
    process.exitCode = 1;
  } finally {
    await dataSource.destroy();
  }
}

reset();