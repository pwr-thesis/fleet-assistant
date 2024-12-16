resource "aws_sns_topic" "example_topic" {
  name = "notifications-topic"
}

resource "aws_lambda_permission" "allow_sns_invoke" {
  statement_id  = "AllowSNSInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notification_rds_logging_lambda.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.example_topic.arn
}

resource "aws_lambda_permission" "allow_sns_invoke" {
  statement_id  = "AllowSNSInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notification_rds_logging_lambda.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.example_topic.arn
}

resource "aws_sns_topic_subscription" "email_lambda_subscription" {
  topic_arn = aws_sns_topic.example_topic.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.notification_email_lambda.arn
}

resource "aws_sns_topic_subscription" "rds_logging_lambda_subscription" {
  topic_arn = aws_sns_topic.example_topic.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.notification_rds_logging_lambda.arn
}