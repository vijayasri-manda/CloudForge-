# Disaster Recovery & Resilience Guide

## High Availability Principles
1. **Multi-Replica Pod Deployment**: All application tiers run minimum 3 active replicas.
2. **Pod Disruption Budgets (PDB)**: Guarantees at least 2 instances remain operational during cluster node upgrades.
3. **Horizontal Pod Autoscaling (HPA)**: Dynamically scales workloads up to 10 replicas under heavy traffic spikes.
4. **GitOps Single Source of Truth**: Full cluster state is declaratively stored in Git. Cluster recovery requires a single `kubectl apply -f kubernetes/argocd/application.yaml`.

## Recovery Runbooks

### Scenario A: PostgreSQL Storage Corruption / Failure
1. Re-provision persistent block volume via Terraform (`infrastructure/terraform`).
2. Restore database from latest automated snapshot.
3. Restart StatefulSet: `kubectl rollout restart statefulset/postgres-statefulset -n enterprise-devops`.

### Scenario B: Complete Node Outage
1. Re-apply Terraform: `terraform apply -auto-approve`.
2. Re-run Ansible playbook: `ansible-playbook -i inventory/hosts.yml playbooks/site.yml`.
3. ArgoCD will automatically re-deploy all workloads and restore target state.
