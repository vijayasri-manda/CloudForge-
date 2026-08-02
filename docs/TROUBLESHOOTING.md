# Platform Troubleshooting & Operations Runbook

## Frequently Encountered Scenarios

### 1. Pods Stuck in `CrashLoopBackOff`
- **Cause**: Database connection failure or unhandled exception during initialization.
- **Diagnostic Command**:
  ```bash
  kubectl logs -n enterprise-devops -l app=backend --tail=100
  ```
- **Remediation**: Check PostgreSQL service health and secrets matching `POSTGRES_PASSWORD`.

### 2. ArgoCD Application Out of Sync
- **Cause**: Manual edits in cluster or Git commit mismatch.
- **Diagnostic Command**:
  ```bash
  argocd app get enterprise-devops-platform
  ```
- **Remediation**: Trigger manual hard sync:
  ```bash
  argocd app sync enterprise-devops-platform --force
  ```

### 3. High Memory Consumption in Node.js Microservice
- **Diagnostic Command**: Inspect Grafana metrics dashboard or query Prometheus:
  ```promql
  container_memory_usage_bytes{container="backend"}
  ```
- **Remediation**: Adjust resource limits in `kubernetes/base/backend-deployment.yaml`.
