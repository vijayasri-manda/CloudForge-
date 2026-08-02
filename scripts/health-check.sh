#!/usr/bin/env bash
# ==============================================================================
# Enterprise Platform Automated Health Probe & Diagnostic Verification
# ==============================================================================

set -eo pipefail

echo "[+] Auditing Backend Liveness (/livez)..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/livez || echo "000")
if [ "$STATUS" -eq 200 ]; then
  echo "  --> Backend Liveness: PASS (HTTP 200)"
else
  echo "  --> Backend Liveness: FAIL (HTTP $STATUS)"
fi

echo "[+] Auditing Backend Readiness (/readyz)..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/readyz || echo "000")
if [ "$STATUS" -eq 200 ]; then
  echo "  --> Backend Readiness: PASS (HTTP 200)"
else
  echo "  --> Backend Readiness: WARN/FAIL (HTTP $STATUS - DB may be initializing)"
fi

echo "[+] Auditing Prometheus Metrics Endpoint (/metrics)..."
METRICS=$(curl -s http://localhost:5000/metrics | grep "http_requests_total" | head -n 1 || echo "")
if [ -n "$METRICS" ]; then
  echo "  --> Prometheus Telemetry Export: PASS"
else
  echo "  --> Prometheus Telemetry Export: FAIL"
fi
