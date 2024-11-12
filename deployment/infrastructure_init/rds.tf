resource "aws_db_instance" "postgres" {
  identifier        = var.rds_instance_name
  allocated_storage = 20
  storage_type      = "gp2"
  engine            = "postgres"
  engine_version    = "16.3"
  multi_az          = false

  db_name = "fleet_assistant"

  instance_class = "db.t3.micro"

  username = var.rds_instance_username
  password = var.rds_instance_password

  vpc_security_group_ids  = [aws_security_group.rds_sg.id]
  skip_final_snapshot     = true
  publicly_accessible     = false
  backup_retention_period = 0
}

resource "aws_security_group" "rds_sg" {
  name                   = var.rds_secutiry_group_name
  revoke_rules_on_delete = true

  ingress {
    security_groups = [aws_security_group.rds_connection.id]
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
  }

  egress {
    security_groups = [aws_security_group.rds_connection.id]
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
  }
}

resource "aws_security_group" "rds_connection" {
  name                   = var.rds_connection_secutiry_group_name
  revoke_rules_on_delete = true

  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }

  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }
}