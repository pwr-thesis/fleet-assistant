data "archive_file" "rds_logging_lambda_source_code" {
  type        = "zip"
  source_file = "./lambda_src/notification_logging.py"
  output_path = "./lambda_src/notification_logging.zip"
}

resource "aws_lambda_function" "notification_rds_logging_lambda" {
  function_name = "notification-rds-record-logging"
  role          = aws_iam_role.notification_rds_logging_lambda_role.arn
  handler       = "send_email.lambda_handler"
  runtime       = "python3.9"
  timeout       = 10

  environment {
    variables = {
      DB_HOST = aws_db_instance.postgres.address
      DB_NAME = aws_db_instance.postgres.db_name
      DB_USER = aws_db_instance.postgres.username
      DB_PASS = aws_db_instance.postgres.password
    }
  }

  vpc_config {
    security_group_ids = [aws_security_group.rds_connection.id]
  }

  filename = data.archive_file.rds_logging_lambda_source_code.output_path
  source_code_hash = filemd5(data.archive_file.rds_logging_lambda_source_code.output_path)
}

resource "aws_iam_role" "notification_rds_logging_lambda_role" {
  name = "notification-rds-logging-lambda-sqs-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Effect = "Allow"
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "lambda_access" {
  name       = "logging-lambda-rds-access"
  roles      = [aws_iam_role.notification_rds_logging_lambda_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}
