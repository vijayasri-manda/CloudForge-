variable "compartment_ocid" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "ssh_public_key" {
  type = string
}

variable "environment" {
  type = string
}

variable "instance_shape" {
  type    = string
  default = "VM.Standard.A1.Flex" # OCI Ampere Always Free 4 OCPU / 24GB RAM shape
}

variable "ocpus" {
  type    = number
  default = 4
}

variable "memory_in_gbs" {
  type    = number
  default = 24
}
