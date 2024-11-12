resource "aws_sqs_queue" "notification_queue" {
  name                        = "fleet-assistant-notification-queue"
  fifo_queue                  = false
  content_based_deduplication = false
}