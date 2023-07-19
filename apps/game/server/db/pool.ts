import mysql from 'mysql2/promise';
import { parseSemiColonFormat } from './db_utils';
import { mainLogger } from '../sv_logger';

// Read the MySQL connection string from server.cfg
const mysqlString = GetConvar('mysql_npwm', 'none');
if (mysqlString === 'none') {
  const error = new Error("Can't find a 'mysql_npwm' string");
  mainLogger.error(error.message);
  throw error;
}

/**
 * Parse the MySQL string and generate a connection pool
 * @returns MySQL connection pool
 */
export function generateConnectionPool() {
  try {
    const config = parseSemiColonFormat(mysqlString);

    const user = config.user;
    const password = config.pass;
    const [ip, port] = config.ip.split(':');
    const database = config.db;

    return mysql.createPool({
      connectTimeout: 60000,
      user,
      password,
      host: ip,
      port: parseInt(port, 10),
      database,
    });
  } catch(e) {
    mainLogger.error(`MySQL connection pool error: ${e.message}`, {
      connection: mysqlString,
    });
  }
}

export const pool = generateConnectionPool();

export async function withTransaction(queries: Promise<any>[]): Promise<any[]> {
  const connection = await pool.getConnection();
  connection.beginTransaction();

  try {
    const results = await Promise.all(queries);
    await connection.commit();
    await connection.release();
    return results;
  } catch(err) {
    mainLogger.warn(`Error when submitting queries in transaction: ${err.message}`)
    await connection.rollback();
    await connection.release();
    return Promise.reject(err);
  }
}