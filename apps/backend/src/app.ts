import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { logger } from './logger';
import { metricsMiddleware } from './middleware/metrics';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';

export const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(metricsMiddleware);

// Request Logger
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url, ip: req.ip }, 'Incoming request');
  next();
});

// Routes
app.use('/', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Resource not found' });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({ err }, 'Unhandled application exception');
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});
