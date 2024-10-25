import { Pool } from "pg";

const pgPool = new Pool({
  user: "admin",
  host: "sqldb",
  database: "portfolio_db",
  password: "my_password",
  port: 5432,
  connectionTimeoutMillis: 1000,
});

if (pgPool) {
  console.log(
    `Connected to ${pgPool.options.database} database. Current connections: ${pgPool.totalCount}. Idle connection: ${pgPool.idleCount}`
  );
}

pgPool.on("connect", (client) => {
  console.log(`A new client has been connected. ${JSON.stringify(client)}`);
});

pgPool.on("error", (err) => {
  console.error(`Unexpected error on idle client`, err);
});

export default pgPool;
