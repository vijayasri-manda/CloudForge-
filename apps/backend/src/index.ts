import { app } from './app';
import { config } from './config';
import { logger } from './logger';
import { initDb } from './db';

const startServer = async () => {
  await initDb();

  const server = app.listen(config.port, () => {
    logger.info({ port: config.port, env: config.env }, 'Enterprise backend microservice started successfully');
  });

  const gracefulShutdown = (signal: string) => {
    logger.info({ signal }, 'Received termination signal, initiating graceful shutdown');
    server.close(() => {
      logger.info('HTTP server closed, exiting process');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

startServer();
