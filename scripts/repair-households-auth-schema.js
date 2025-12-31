const { Client } = require('pg');

function getEnv(name, fallback) {
  const value = process.env[name];
  return value === undefined || value === '' ? fallback : value;
}

async function columnExists(client, columnName) {
  const res = await client.query(
    "select 1 from information_schema.columns where table_name='households' and column_name=$1",
    [columnName],
  );
  return res.rowCount > 0;
}

async function migrationAlreadyRecorded(client, name) {
  // typeorm default table name is 'migrations'
  const res = await client.query(
    "select 1 from information_schema.tables where table_name='migrations'",
  );
  if (res.rowCount === 0) return false;

  const hit = await client.query('select 1 from "migrations" where name=$1', [
    name,
  ]);
  return hit.rowCount > 0;
}

async function recordMigration(client, timestamp, name) {
  const tableExists = await client.query(
    "select 1 from information_schema.tables where table_name='migrations'",
  );
  if (tableExists.rowCount === 0) {
    console.warn(
      'No migrations table found; skipping recording migration (TypeORM will still think it is pending).',
    );
    return;
  }

  await client.query('insert into "migrations"(timestamp, name) values ($1, $2)', [
    timestamp,
    name,
  ]);
}

async function main() {
  const config = {
    host: getEnv('DB_HOST', 'localhost'),
    port: Number(getEnv('DB_PORT', '5432')),
    user: getEnv('DB_USER', 'postgres'),
    password: String(getEnv('DB_PASS', '')),
    database: getEnv('DB_NAME', 'household'),
  };

  const client = new Client(config);
  await client.connect();

  console.log('Connected. Checking households columns...');

  // 1) Drop username if exists
  await client.query('ALTER TABLE households DROP COLUMN IF EXISTS username');

  // 2) Rename password_hash -> password if password_hash exists and password does not
  const hasPasswordHash = await columnExists(client, 'password_hash');
  const hasPassword = await columnExists(client, 'password');

  if (hasPasswordHash && !hasPassword) {
    console.log('Renaming households.password_hash -> households.password');
    await client.query('ALTER TABLE households RENAME COLUMN password_hash TO password');
  }

  // 3) Add password if missing
  if (!(await columnExists(client, 'password'))) {
    console.log('Adding households.password (varchar, nullable)');
    await client.query('ALTER TABLE households ADD COLUMN password varchar');
  }

  // 4) Add is_active if missing
  if (!(await columnExists(client, 'is_active'))) {
    console.log('Adding households.is_active (boolean, default true, not null)');
    await client.query(
      'ALTER TABLE households ADD COLUMN is_active boolean NOT NULL DEFAULT true',
    );
  }

  // 5) Record the migration as applied so future `migration:run` won’t try to run it.
  const migrationName = 'UpdateHouseholdAuth1734023000000';
  const migrationTimestamp = 1734023000000;
  if (await migrationAlreadyRecorded(client, migrationName)) {
    console.log(`Migration already recorded: ${migrationName}`);
  } else {
    console.log(`Recording migration as applied: ${migrationName}`);
    await recordMigration(client, migrationTimestamp, migrationName);
  }

  const cols = await client.query(
    "select column_name,data_type,is_nullable,column_default from information_schema.columns where table_name='households' order by ordinal_position",
  );
  console.table(cols.rows);

  await client.end();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
