# Enterprise Secure GitOps CI/CD Platform with Full Observability

[![DevSecOps Pipeline](https://github.com/enterprise/secure-gitops-platform/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/enterprise/secure-gitops-platform/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-k3s-blue.svg)](https://k3s.io)
[![ArgoCD](https://img.shields.io/badge/GitOps-ArgoCD-orange.svg)](https://argoproj.github.io/cd/)

Production-grade Cloud-Native DevOps Platform delivering automated Infrastructure provisioning (Terraform), Configuration Management (Ansible), Multi-Stage Security-hardened Container builds, DevSecOps Pipeline (Trivy, Syft SBOM, Cosign signing), GitOps Continuous Delivery (ArgoCD), and Full Observability (Prometheus, Loki, Promtail, Grafana, Alertmanager).

---

## Repository Architecture

```text
e:\DevOps Assignment Project\
├── apps/
│   ├── backend/               # Node.js Express REST API + TypeScript + PostgreSQL + Health/Metrics
│   └── frontend/              # Next.js 14 Glassmorphism Enterprise Control Dashboard
├── infrastructure/
│   └── terraform/             # OCI Terraform IaC (Networking, Compute k3s, Firewall, Storage)
├── ansible/                   # Ansible Playbooks & Roles (Hardening, Docker, k3s, Security)
├── kubernetes/                # Kubernetes Manifests (Kustomize Base & Production Overlays + ArgoCD)
├── .github/
│   └── workflows/             # GitHub Actions Pipeline (DevSecOps + Build + Syft + Cosign + GitOps)
├── monitoring/                # Observability Stack (Prometheus, Loki, Promtail, Grafana, Alertmanager)
├── scripts/                   # Platform Automation Scripts (Setup, Verification, Health Check)
├── docs/                      # Enterprise Documentation (Architecture, Security, Operations, DR)
├── tests/                     # Integration Test Suite
└── docker-compose.yml         # Local Production-Simulated Stack
```

---

## Quick Start (Local Sandbox Environment)

Run the automated platform setup script or start via Docker Compose:

```bash
# Option 1: Automated Script
./scripts/bootstrap.sh

# Option 2: Docker Compose Direct
docker compose up --build -d
```

### Access Platform Dashboard & Tools

- **Next.js Control Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Node.js REST API & Health**: [http://localhost:5000/healthz](http://localhost:5000/healthz)
- **Prometheus Telemetry**: [http://localhost:9090](http://localhost:9090)
- **Grafana Dashboards**: [http://localhost:3001](http://localhost:3001) (`admin` / `admin`)

---

## Enterprise Platform Highlights

- **Shift-Left DevSecOps**: Automatic build termination on `CRITICAL`/`HIGH` CVEs (Trivy) and SAST code quality gates (SonarCloud).
- **Supply Chain Security**: SPDX JSON SBOM generation (Syft) and keyless cryptographic signing (Cosign).
- **Zero-Downtime GitOps**: ArgoCD automated sync, self-healing, rolling updates, HPA, and PodDisruptionBudgets.
- **Production Kubernetes Hardening**: `readOnlyRootFilesystem`, non-root user execution, network isolation policies.
- **Complete Documentation**: Detailed operational runbooks in [`docs/`](docs/).
