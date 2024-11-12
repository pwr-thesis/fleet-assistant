resource "aws_instance" "ec2_backend" {
  ami           = "ami-03ca36368dbc9cfa1"
  instance_type = "t2.micro"

  vpc_security_group_ids = [var.rds_connection_sg_id]
  iam_instance_profile = aws_iam_instance_profile.ec2_instance_profile.name

  depends_on = [ aws_s3_object.backend_source_code ]

  lifecycle {
    create_before_destroy = true
  }

  user_data = <<-EOF
    #!/bin/bash
    export SQL_USERNAME="${var.rds_instance_username}"
    export SQL_PASSWORD="${var.rds_instance_password}"
    export SQL_URI="${var.rds_instance_endpoint}"

    sudo yum install -y unzip aws-cli java-21

    aws s3 cp s3://${var.private_s3_name}/backend/source_code.zip /tmp/source_code.zip

    unzip /tmp/source_code.zip

    java -jar backend-0.1.jar
  EOF
}

resource "aws_s3_object" "backend_source_code" {
  bucket = var.private_s3_name
  key    = "/backend/source_code.zip"
  source = "../../backend/build/libs/backend.zip"

  source_hash = filemd5("../../backend/build/libs/backend.zip")
}

resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = "ec2_backend_instance_profile"
  role = var.ec2_backend_role_name
}

resource "aws_eip" "ec2_eip" {
  instance = aws_instance.ec2_backend.id
}
