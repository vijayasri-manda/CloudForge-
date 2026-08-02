import { Pool } from 'pg';
import { config } from '../config';
import { logger } from '../logger';
import { dbQueryDurationMicroseconds } from '../metrics';

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected error on idle PostgreSQL client');
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = (Date.now() - start) / 1000;
    dbQueryDurationMicroseconds.observe({ operation: text.split(' ')[0] }, duration);
    return res;
  } catch (error) {
    logger.error({ error, query: text }, 'Database query failure');
    throw error;
  }
};

export const initDb = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    logger.info('Database schema initialized successfully');
  } catch (error) {
    logger.warn({ error }, 'Database initialization postponed - DB connection currently unavailable');
  }
};
