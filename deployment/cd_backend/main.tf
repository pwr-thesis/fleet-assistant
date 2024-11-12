provider "aws" {
  region = "eu-west-1"
}

terraform {
  backend "s3" {
    bucket = "fleet-assistant-backend-bucket"
    key    = "terraform/cd_backend_state"
    region = "eu-west-1"
  }
}

output "instance_public_ip" {
  value = aws_eip.ec2_eip.public_ip
}