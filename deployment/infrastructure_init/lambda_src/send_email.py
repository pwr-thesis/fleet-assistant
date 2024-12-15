import json
import boto3
import os
from botocore.exceptions import ClientError
import logging


logger = logging.getLogger()
logger.setLevel(logging.INFO)

ses = boto3.client('ses')

subject = "Fleet Assistant notification!"
sender_email = os.environ.get('EMAIL_ID')


def lambda_handler(event, context):
    logger.info("Received event: %s", event)

    messages = []

    # Iterate through each SQS message in the event
    for record in event.get("Records", []):
        try:
            sns_body =  record["Sns"]
            # The message body is a JSON string, so parse it
            message_body = sns_body.get("Message", "{}")

            # If the message body is JSON, load it
            email_body = json.loads(message_body)

            # Extract the required information
            recipient_email = email_body.get("email")
            message = email_body.get("message")
            title = email_body.get("title")

            # Ensure all required fields are present
            if not recipient_email or not message or not title:
                logger.warning(f"Missing required fields in message: {email_body}")
                continue

            # Send the email
            response = send_email(sender_email, recipient_email, title, message)
            messages.append({
                "title": title,
                "message": message,
                "email": recipient_email
            })
            logger.info(response)

        except Exception as e:
            logger.error(f"Error processing message: {record}. Error: {str(e)}")
            continue

    return json.dumps(messages)


def send_email(sender_email, recipient_email, subject, body):
    try:
        response = ses.send_email(
            Source=sender_email,
            Destination={
                'ToAddresses': [recipient_email]
            },
            Message={
                'Subject': {
                    'Data': subject
                },
                'Body': {
                    'Text': {
                        'Data': body
                    }
                }
            }
        )
        print(f"Email sent! Message ID: {response['MessageId']}")

        return response
    except ClientError as e:
        print(f"Error sending email: {e.response['Error']['Message']}")