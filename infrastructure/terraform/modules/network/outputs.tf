output "vcn_id" {
  value = oci_core_vcn.enterprise_vcn.id
}

output "public_subnet_id" {
  value = oci_core_subnet.public_subnet.id
}
