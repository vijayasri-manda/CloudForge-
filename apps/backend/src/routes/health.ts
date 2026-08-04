import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { metricsRegistry } from '../metrics';

const router = Router();

// Root endpoint - Service Overview
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    service: 'CloudForge Backend API',
    status: 'online',
    version: process.env.APP_VERSION || '1.0.0',
    endpoints: {
      health: '/healthz',
      liveness: '/livez',
      readiness: '/readyz',
      metrics: '/metrics',
      auth: '/api/v1/auth',
      api: '/api/v1'
    },
    timestamp: new Date().toISOString()
  });
});

// Liveness probe - checks if the web server process is alive
router.get('/livez', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Readiness probe - checks if external dependencies (PostgreSQL DB) are ready
router.get('/readyz', async (req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      database: 'disconnected',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
});

// Full health overview
router.get('/healthz', async (req: Request, res: Response) => {
  let dbStatus = 'ok';
  try {
    await pool.query('SELECT 1');
  } catch (e) {
    dbStatus = 'error';
  }

  const isHealthy = dbStatus === 'ok';
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'UP' : 'DEGRADED',
    checks: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: dbStatus,
    },
    version: process.env.APP_VERSION || '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Prometheus metrics endpoint
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    res.set('Content-Type', metricsRegistry.contentType);
    res.end(await metricsRegistry.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

export default router;
