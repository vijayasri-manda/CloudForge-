import client from 'prom-client';

// Collect default Node.js process & OS metrics
client.collectDefaultMetrics({ prefix: 'enterprise_backend_' });

// Custom metrics
export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
});

export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code']
});

export const dbQueryDurationMicroseconds = new client.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of Database queries in seconds',
  labelNames: ['operation'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1]
});

export const activeUsersGauge = new client.Gauge({
  name: 'active_users_total',
  help: 'Total number of active logged-in users'
});

export const metricsRegistry = client.register;
