data "archive_file" "lambda_source_code" {
  type        = "zip"
  source_file = "./lambda_src/send_email.py"
  output_path = "./lambda_src/send_email.zip"
}

resource "aws_lambda_function" "notification_lambda" {
  function_name = "notification-email-lambda"
  role          = aws_iam_role.notification_lambda_role.arn
  handler       = "send_email.lambda_handler"
  runtime       = "python3.9"
  timeout       = 10

  environment {
    variables = {
      EMAIL_ID = var.email_identity
    }
  }

  filename = data.archive_file.lambda_source_code.output_path
  source_code_hash = filemd5(data.archive_file.lambda_source_code.output_path)
}

resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  event_source_arn = aws_sqs_queue.notification_queue.arn
  function_name    = aws_lambda_function.notification_lambda.arn
  batch_size       = 10
  enabled          = true
}

resource "aws_iam_role" "notification_lambda_role" {
  name = "notification-lambda-sqs-role"

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

resource "aws_iam_policy" "notification_lambda_sqs_policy" {
  name = "LambdaSQSPolicy"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ],
        Effect   = "Allow",
        Resource = aws_sqs_queue.notification_queue.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "notification_lambda_sqs_attachment" {
  role       = aws_iam_role.notification_lambda_role.name
  policy_arn = aws_iam_policy.notification_lambda_sqs_policy.arn
}