variable "tenancy_ocid" {
  type        = string
  description = "Oracle Cloud Infrastructure Tenancy OCID"
}

variable "user_ocid" {
  type        = string
  description = "User OCID with IAM permissions"
}

variable "fingerprint" {
  type        = string
  description = "API Key Fingerprint"
}

variable "private_key_path" {
  type        = string
  description = "Path to OCI API Private Key"
}

variable "region" {
  type        = string
  default     = "us-ashburn-1"
  description = "OCI Cloud Region"
}

variable "compartment_ocid" {
  type        = string
  description = "Target Compartment OCID"
}

variable "ssh_public_key" {
  type        = string
  description = "Public SSH Key for VM Access"
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Deployment Environment"
}
