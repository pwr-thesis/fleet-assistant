provider "aws" {
  region = "eu-west-1"
}

locals {
  content_type_map = {
   "js" = "application/json"
   "html" = "text/html"
   "css"  = "text/css"
  }
}

resource "aws_s3_object" "object" {

  for_each = fileset("${path.module}/../../frontend/dist/fleet-assistant/browser/", "*")

  bucket = var.public_s3_name
  key    = "${each.value}"
  source = "${path.module}/../../frontend/dist/fleet-assistant/browser/${each.value}"
  etag   = filemd5("${path.module}/../../frontend/dist/fleet-assistant/browser/${each.value}")

  content_type = lookup(local.content_type_map, split(".", "${path.module}/../../frontend/dist/fleet-assistant/browser/${each.value}")[5], "text/html")
}