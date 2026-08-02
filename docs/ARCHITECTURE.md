# Platform Architecture & System Design Document

## System Overview
The **Secure GitOps CI/CD Platform with Full Observability** is designed to deliver automated, production-grade cloud-native application deployments adhering to Fortune 500 engineering standards.

```
                      +-------------------------------------------------------------+
                      |                    Developer Git Push                       |
                      +------------------------------+------------------------------+
                                                     |
                                                     v
                      +-------------------------------------------------------------+
                      |                GitHub Actions CI/CD Pipeline                |
                      |  [Lint -> Test -> Sonar -> Trivy -> Build -> SBOM -> Cosign] |
                      +------------------------------+------------------------------+
                                                     |
                                                     v
                       +-----------------------------------------------------------+
                       |    GHCR (Container Registry) & GitOps Manifest Update     |
                       +-----------------------------+-----------------------------+
                                                     |
                                                     v
                       +-----------------------------------------------------------+
                       |                 ArgoCD GitOps Operator                    |
                       |       [Auto-Sync / Self-Healing / Rolling Deploy]         |
                       +-----------------------------+-----------------------------+
                                                     |
                                                     v
 +---------------------------------------------------------------------------------------------------+
 |                                   k3s / Kubernetes Cluster                                        |
 |                                                                                                   |
 |  +--------------------------+    +--------------------------+    +-----------------------------+  |
 |  |    Next.js Frontend      |    |     Node.js Backend      |    |     PostgreSQL Database     |  |
 |  | (HPA / PDB / SecContext) |    | (HPA / PDB / SecContext) |    | (PV / PVC / Stateful/Secret)|  |
 |  +-------------+------------+    +-------------+------------+    +--------------+--------------+  |
 |                |                               |                                |                 |
 +----------------|-------------------------------+--------------------------------|-----------------+
                  |                               |                                |
                  v                               v                                v
 +---------------------------------------------------------------------------------------------------+
 |                                    Observability Suite                                            |
 |   +------------------------+      +------------------------+      +--------------------------+   |
 |   | Prometheus (Metrics)   |      |   Loki/Promtail (Logs)  |      | Alertmanager & Grafana   |   |
 |   +------------------------+      +------------------------+      +--------------------------+   |
 +---------------------------------------------------------------------------------------------------+
```

## Architectural Pillars

### 1. Zero-Trust DevSecOps & Supply Chain Attestation
- **Vulnerability Scanning**: Every commit and container image undergoes automated security evaluation via Aquasecurity Trivy. Builds fail on `CRITICAL` or `HIGH` vulnerabilities.
- **Static Code Analysis (SAST)**: SonarCloud analysis enforces strict security gates.
- **Cryptographic Image Signing**: Container images pushed to GHCR are signed keylessly via Sigstore Cosign utilizing OIDC authentication.
- **Software Bill of Materials (SBOM)**: SPDX-compliant SBOMs are generated for every build using Anchore Syft.

### 2. Infrastructure as Code & Automated Provisioning
- **Terraform (OCI Provider)**: Provisions virtual cloud networks (VCNs), security lists, internet gateways, storage block volumes, and Compute VM instances on Oracle Cloud Infrastructure.
- **Ansible Automation**: Playbooks execute kernel sysctl hardening, Docker CE setup, and automated k3s single-node/multi-node cluster bootstrapping.

### 3. GitOps Continuous Delivery (ArgoCD)
- **Declarative Synchronization**: ArgoCD monitors the target repository state (`kubernetes/overlays/production`).
- **Self-Healing & Pruning**: Out-of-sync cluster resources are automatically converged to match Git state.
- **Zero-Downtime Deployments**: Kubernetes Deployments utilize `RollingUpdate` with `maxSurge: 1`, `maxUnavailable: 0`, guarded by `PodDisruptionBudgets` and `HorizontalPodAutoscalers`.

### 4. Enterprise Observability Stack
- **Prometheus**: Collects application RED metrics (Rate, Errors, Duration) and Node Exporter metrics.
- **Grafana**: Pre-configured dashboards provide visibility across cluster resources, application performance, and pipeline health.
- **Loki & Promtail**: Collects, indexes, and queries structured JSON container logs.
- **Alertmanager**: Dispatches actionable alerts when latency or error thresholds are breached.
