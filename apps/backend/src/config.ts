import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-enterprise-key-change-in-prod',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  databaseUrl: process.env.DATABASE_URL,
  db: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'enterprise_db',
  },
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
