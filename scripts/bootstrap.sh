#!/usr/bin/env bash
# ==============================================================================
# Enterprise DevOps Platform Bootstrap Script
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo " Starting Local Full-Stack Platform Bootstrap"
echo "=========================================================="

# Check Prerequisite Tools
command -v docker >/dev/null 2>&1 || { echo "Error: docker is required."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || command -v docker compose >/dev/null 2>&1 || { echo "Error: docker compose is required."; exit 1; }

echo "[+] Building and launching container services..."
docker compose up --build -d

echo "[+] Waiting for services to become healthy..."
sleep 10

echo "[+] Verifying backend liveness probe (/livez)..."
curl -s http://localhost:5000/livez | grep "healthy" && echo " Backend Live OK" || echo " Backend pending"

echo "[+] Verifying Prometheus metrics UI..."
curl -s http://localhost:9090/-/healthy | grep "Healthy" && echo " Prometheus OK" || echo " Prometheus pending"

echo "=========================================================="
echo " Bootstrap Complete! Platform endpoints:"
echo " - Next.js Frontend UI: http://localhost:3000"
echo " - Node.js Backend API: http://localhost:5000"
echo " - Grafana Dashboard:   http://localhost:3001 (admin/admin)"
echo " - Prometheus UI:      http://localhost:9090"
echo " - Loki Endpoint:       http://localhost:3100"
echo "=========================================================="
