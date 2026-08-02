terraform {
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 5.0"
    }
  }
}

data "oci_identity_availability_domains" "ad" {
  compartment_id = var.compartment_ocid
}

resource "oci_core_volume" "k3s_pv_volume" {
  availability_domain = data.oci_identity_availability_domains.ad.availability_domains[0].name
  compartment_id      = var.compartment_ocid
  display_name        = "k3s-pv-volume-${var.environment}"
  size_in_gbs         = var.size_in_gbs
}
