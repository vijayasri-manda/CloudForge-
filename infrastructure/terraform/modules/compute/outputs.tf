output "k3s_public_ip" {
  value = oci_core_instance.k3s_master.public_ip
}

output "instance_id" {
  value = oci_core_instance.k3s_master.id
}
