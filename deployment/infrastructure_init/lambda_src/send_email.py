import json
import boto3
import os
from botocore.exceptions import ClientError


ses = boto3.client('ses')

subject = "Fleet Assistant notificationRequest!"
sender_email = os.environ.get('EMAIL_ID')


def lambda_handler(event, context):
    for record in event['Records']:
        email_body = json.loads(record["body"])
        recipient_email = email_body["recipient"]
        message = email_body["message"]
        send_email(sender_email, recipient_email, subject, message)


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
    except ClientError as e:
        print(f"Error sending email: {e.response['Error']['Message']}")