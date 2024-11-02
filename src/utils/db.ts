import mysql, { PoolConnection } from 'mysql2/promise';


let globalPool: PoolConnection | undefined = undefined;

export default async function connectToDatabase() {
  if (globalPool !== undefined)
    return globalPool;

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    idleTimeout: 30000,
  });
  
  console.log("Created new connection");
  globalPool = await pool.getConnection();

  return globalPool;
};


export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  idleTimeout: 30000,
});