data "archive_file" "email_lambda_source_code" {
  type        = "zip"
  source_file = "./lambda_src/send_email.py"
  output_path = "./lambda_src/send_email.zip"
}

resource "aws_lambda_function" "notification_email_lambda" {
  function_name = "notification-email-lambda"
  role          = aws_iam_role.notification_email_lambda_role.arn
  handler       = "send_email.lambda_handler"
  runtime       = "python3.9"
  timeout       = 10

  environment {
    variables = {
      EMAIL_ID = var.email_identity
    }
  }

  filename = data.archive_file.email_lambda_source_code.output_path
  source_code_hash = filemd5(data.archive_file.email_lambda_source_code.output_path)
}

resource "aws_iam_role" "notification_email_lambda_role" {
  name = "notification-email-lambda-role"

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

resource "aws_iam_policy" "ses_send_email_policy" {
  name        = "LambdaSESPolicy"
  description = "Policy to allow Lambda to send emails via SES"
  
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = "ses:SendEmail",
        Resource = "arn:aws:ses:::identity/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_ses_policy_to_lambda" {
  role       = aws_iam_role.notification_email_lambda_role.name
  policy_arn = aws_iam_policy.ses_send_email_policy.arn
}