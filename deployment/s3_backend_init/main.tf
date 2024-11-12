provider "aws" {
  region = "eu-west-1"
}

resource "aws_s3_bucket" "private_s3" {
  bucket = var.private_s3_name
}