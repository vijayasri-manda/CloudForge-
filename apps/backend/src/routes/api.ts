import { Router, Response } from 'express';
import { authenticateJwt, AuthRequest } from '../middleware/auth';
import { query } from '../db';
import os from 'os';

const router = Router();

// Protected API - Get Current User Profile
router.get('/me', authenticateJwt, (req: AuthRequest, res: Response) => {
  res.json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

// System Platform Information
router.get('/system-info', (req: AuthRequest, res: Response) => {
  res.json({
    status: 'success',
    data: {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      uptime: os.uptime(),
      totalmem: os.totalmem(),
      freemem: os.freemem(),
      nodeVersion: process.version,
    },
  });
});

// Platform Deployment Metrics overview
router.get('/deployment-status', async (req: AuthRequest, res: Response) => {
  res.json({
    status: 'success',
    data: {
      environment: process.env.NODE_ENV || 'production',
      cluster: 'k3s-enterprise-01',
      gitCommit: process.env.GIT_COMMIT || 'sha-prod-latest',
      gitopsSyncStatus: 'Synced',
      lastDeployed: new Date().toISOString(),
      activeReplicas: 3,
      healthScore: 99.98,
    },
  });
});

export default router;
