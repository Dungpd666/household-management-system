const { Client } = require('pg');

async function main() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'household',
  };

  const client = new Client(config);
  await client.connect();

  const res = await client.query(
    "select column_name,data_type,is_nullable,column_default from information_schema.columns where table_name='households' order by ordinal_position",
  );

  console.table(res.rows);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
