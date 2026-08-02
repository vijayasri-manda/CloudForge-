terraform {
  required_version = ">= 1.5.0"
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 5.0"
    }
  }

  # Remote State Storage Configuration
  # backend "s3" {
  #   bucket   = "enterprise-terraform-state"
  #   key      = "gitops-platform/production.tfstate"
  #   region   = "us-ashburn-1"
  # }
}

provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = var.private_key_path
  region           = var.region
}

module "network" {
  source           = "./modules/network"
  compartment_ocid = var.compartment_ocid
  environment      = var.environment
}

module "storage" {
  source           = "./modules/storage"
  compartment_ocid = var.compartment_ocid
  environment      = var.environment
}

module "compute" {
  source           = "./modules/compute"
  compartment_ocid = var.compartment_ocid
  subnet_id        = module.network.public_subnet_id
  ssh_public_key   = var.ssh_public_key
  environment      = var.environment
}
