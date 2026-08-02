# DevSecOps & Security Hardening Specifications

## 1. Shift-Left Security in CI/CD

Our GitHub Actions pipeline enforces automated security verification prior to any deployment artifact generation:

1. **Static Application Security Testing (SAST)**:
   - Integrates SonarCloud to analyze JavaScript/TypeScript source code for bugs, code smells, and security vulnerabilities.
2. **Vulnerability & Secrets Scanning**:
   - Aquasecurity Trivy audits repository dependencies and Docker container layers for CVEs and hardcoded credentials.
   - Pipelines automatically **terminate (exit code 1)** if `CRITICAL` vulnerabilities are detected.

---

## 2. Supply Chain Security & Attestation

- **Software Bill of Materials (SBOM)**: Generated via Anchore Syft in SPDX JSON format, documenting every package and dependency inside built container images.
- **Cosign Image Signing**: Container images pushed to GHCR are signed using keyless OIDC signatures powered by Sigstore Cosign.

---

## 3. Kubernetes Runtime Security Hardening

Every workload deployed into the cluster follows strict Pod Security Standards (`restricted` profile):

- **Non-Root Execution**: `runAsNonRoot: true`, running as explicit user `10001`/`10002`.
- **Read-Only Root Filesystem**: Container filesystems are immutable (`readOnlyRootFilesystem: true`).
- **Capability Drop**: Linux kernel capabilities are explicitly dropped (`drop: ["ALL"]`).
- **Network Segmentation**: Default-deny NetworkPolicies enforce microservice isolation. Only authorized ingress paths are permitted.
