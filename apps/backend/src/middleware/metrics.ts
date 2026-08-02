import { Request, Response, NextFunction } from 'express';
import { httpRequestDurationMicroseconds, httpRequestsTotal } from '../metrics';

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    const labels = {
      method: req.method,
      route: route,
      code: res.statusCode.toString(),
    };
    httpRequestDurationMicroseconds.observe(labels, duration);
    httpRequestsTotal.inc(labels);
  });

  next();
};
