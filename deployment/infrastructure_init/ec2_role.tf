resource "aws_iam_role" "ec2_role" {
  name = var.ec2_backend_role_name
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "s3_access" {
  name = "s3_access_policy"
  role = aws_iam_role.ec2_role.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action   = ["s3:GetObject"],
      Effect   = "Allow",
      Resource = "arn:aws:s3:::${var.private_s3_name}/backend/source_code.zip"
    }]
  })
}