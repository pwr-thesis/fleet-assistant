resource "aws_s3_bucket" "public_s3" {
  bucket = var.public_s3_name
}

resource "aws_s3_bucket" "private_s3" {
  bucket = var.private_s3_name
}