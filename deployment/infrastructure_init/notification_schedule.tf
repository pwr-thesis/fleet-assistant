resource "aws_cloudwatch_event_rule" "lambda_cron_rule" {
  name        = "auto-notifications-lambda-cron-rule"
  description = "Triggers Lambda every day at midnight"
  schedule_expression = "cron(0 0 ? * * *)"  # Runs daily at midnight UTC
}

resource "aws_cloudwatch_event_target" "lambda_target" {
  rule      = aws_cloudwatch_event_rule.lambda_cron_rule.name
  arn       = aws_lambda_function.automatic_notification_lambda.arn
}

resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowEventBridgeInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.automatic_notification_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.lambda_cron_rule.arn
}
