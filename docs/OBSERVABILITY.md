# Observability & Monitoring Specifications

## Metrics & Alerting Architecture

1. **Prometheus Data Collection**:
   - Scrapes `/metrics` endpoint on the Node.js backend.
   - Monitors Node Exporter infrastructure metrics.
   - Evaluates alert rules defined in `monitoring/prometheus/alert.rules.yml`.

2. **Alertmanager Integration**:
   - Triggers critical alerts for backend down, elevated 5xx HTTP error rates (>5%), and high P95 request latency (>1.5s).

3. **Loki & Promtail Logging**:
   - Promtail tails container logs and pushes structured JSON to Loki.
   - Enables unified querying across microservices in Grafana.

4. **Grafana Visualizations**:
   - Pre-configured dashboards for Cluster Infrastructure, Application RED metrics, and Deployment status.
