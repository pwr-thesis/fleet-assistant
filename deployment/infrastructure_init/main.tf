provider "aws" {
  region = "eu-west-1"
}

terraform {
  backend "s3" {
    bucket = "fleet-assistant-backend-bucket"
    key    = "terraform/init_state"
    region = "eu-west-1"
  }
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "rds_connection_sg" {
  value = aws_security_group.rds_connection.id
}