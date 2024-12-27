data "archive_file" "automatic_notification_lambda_source_code" {
  type        = "zip"
  source_file = "./lambda_src/notification_logging.py"
  output_path = "./lambda_src/notification_logging.zip"
}

resource "aws_lambda_function" "automatic_notification_lambda" {
  function_name = "automatic-notification-func"
  role          = aws_iam_role.notification_rds_logging_lambda_role.arn
  handler       = "send_email.lambda_handler"
  runtime       = "python3.9"
  timeout       = 10

  layers = [
    "arn:aws:lambda:eu-west-1:770693421928:layer:Klayers-p39-psycopg2-binary:1"
  ]

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

  filename = data.archive_file.automatic_notification_lambda_source_code.output_path
  source_code_hash = filemd5(data.archive_file.automatic_notification_lambda_source_code.output_path)
}

resource "aws_iam_role" "automatic_notification_lambda_role" {
  name = "automatic-notification-lambda-role"

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

resource "aws_iam_policy" "automatic_notification_lambda_sqs_policy" {
  name        = "lambda-sqs-policy"
  description = "Policy to allow Lambda to send messages to SQS"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow"
        Action   = "sqs:SendMessage"
        Resource = aws_sqs_queue.notification_queue.arn
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "automatic_notification_lambda_sqs_attachment" {
  name       = "automatic-notification-lambda-sqs-attachment"
  roles      = [aws_iam_role.automatic_notification_lambda_role.name]
  policy_arn = aws_iam_policy.automatic_notification_lambda_sqs_policy.arn
}