# Deployment & Operations Guide

## Prerequisites

1. **Docker & Docker Compose** (for local sandbox testing)
2. **Terraform >= 1.5.0** (for cloud infrastructure provisioning)
3. **Ansible >= 2.15** (for configuration management)
4. **kubectl & Kustomize** (for Kubernetes management)

---

## 1. Local Development Stack Deployment

Execute the following command from the root directory to spin up the local production-simulated environment:

```bash
docker compose up --build -d
```

### Verification Endpoints

| Service | Port | Endpoint URL | Description |
| :--- | :--- | :--- | :--- |
| **Next.js Frontend UI** | `3000` | `http://localhost:3000` | Enterprise Dashboard & Telemetry View |
| **Node.js Backend API** | `5000` | `http://localhost:5000/healthz` | REST API & Health Probes |
| **Prometheus UI** | `9090` | `http://localhost:9090` | Metrics Query & Alert Rules |
| **Grafana Dashboard** | `3001` | `http://localhost:3001` | Pre-built Observability Dashboards |
| **Loki Log API** | `3100` | `http://localhost:3100` | Log Aggregation Engine |

---

## 2. Cloud Infrastructure Provisioning (OCI Terraform)

```bash
cd infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars
# Update tenancy_ocid, user_ocid, and ssh_public_key in terraform.tfvars

terraform init
terraform plan
terraform apply -auto-approve
```

---

## 3. Server Hardening & k3s Installation (Ansible)

```bash
cd ansible
# Update inventory/hosts.yml with the public IP from Terraform output

ansible-playbook -i inventory/hosts.yml playbooks/site.yml
```

---

## 4. GitOps ArgoCD Deployment Setup

Apply the ArgoCD application manifest:

```bash
kubectl apply -f kubernetes/argocd/application.yaml
```

Check ArgoCD deployment progress:

```bash
kubectl get application enterprise-devops-platform -n argocd -w
```
