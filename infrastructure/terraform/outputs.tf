output "k3s_cluster_public_ip" {
  value       = module.compute.k3s_public_ip
  description = "Public IP Address of k3s Kubernetes Instance"
}

output "vcn_id" {
  value       = module.network.vcn_id
  description = "OCI VCN Identifier"
}

output "subnet_id" {
  value       = module.network.public_subnet_id
  description = "OCI Public Subnet Identifier"
}
