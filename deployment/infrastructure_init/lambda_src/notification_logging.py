import psycopg2
import boto3
import json
import logging


logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    host = os.environ['DB_HOST']
    database = os.environ['DB_NAME']
    user = os.environ['DB_USER']
    password = os.environ['DB_PASS']

    # Connect to the database
    conn = psycopg2.connect(
        host=host,
        database=database,
        user=user,
        password=password
        port='5432'
    )

    logger.info(event)

    messages = []

    # Iterate through each SQS message in the event
    for record in event.get("Records", []):
        try:
            sns_body =  record["Sns"]
            # The message body is a JSON string, so parse it
            message_body = sns_body.get("Message", "{}")
            logger.info(f"--------- {message_body}")
            # If the message body is JSON, load it
            email_body = json.loads(message_body)
            logger.info(f"--------- {email_body}")

            # Extract the required information
            recipient_email = email_body.get("email")
            message = email_body.get("message")
            title = email_body.get("title")

            # Ensure all required fields are present
            if not recipient_email or not message or not title:
                logger.warning(f"Missing required fields in message: {email_body}")
                continue

            # Example sender email (replace with your actual sender email)
            sender_email = "267193@student.pwr.edu.pl"

            messages.append({
                "title": title,
                "message": message,
                "email": recipient_email
            })
        except Exception as e:
            logger.error(f"Error processing message: {record}. Error: {str(e)}")
            continue

    values = []

    logger.info(messages)

    for message in messages:
        values.append(f'(\'{message["title"]}\', \'{message["message"]}\', NOW(), {get_id_for_user_email(conn, message["email"])})')

    formatted_messages = ",".join(values)
    logger.info(formatted_messages)

    cursor = conn.cursor()
    response = cursor.execute(f'INSERT INTO notification (title, message, created_on, user_id) VALUES {formatted_messages};')

    conn.commit()
    cursor.close()
    conn.close()

    return response


def get_id_for_user_email(conn, email):
    cursor = conn.cursor()

    cursor.execute(f"""
    SELECT u.id
    FROM credentials c
    JOIN fauser u ON u.credentials_id = c.id
    WHERE c.email = '{email}'
    """)

    u_email = cursor.fetchall()

    return u_email[0][0]
