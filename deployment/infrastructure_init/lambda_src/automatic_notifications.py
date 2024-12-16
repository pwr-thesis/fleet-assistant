import psycopg2
import json
import os


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

    inspection_notifications = get_inspection_notifications(conn)
    insurance_notifications = get_insurance_notifications(conn)

    conn.close()

    messages = []

    for ntf in inspection_notifications:
        messages.append(build_email(ntf[0], ntf[1], ntf[2], ntf[5], ntf[3], "inspection"))
        messages.append(build_email(ntf[0], ntf[1], ntf[2], ntf[5], ntf[4], "inspection"))

    for ntf in insurance_notifications:
        messages.append(build_email(ntf[0], ntf[1], ntf[2], ntf[5], ntf[3], "insurance"))
        messages.append(build_email(ntf[0], ntf[1], ntf[2], ntf[5], ntf[4], "insurance"))

    return messages


def build_email(v_name, v_plate, v_vin, v_date, u_email, email_type):
    return {
        "title": "Warning! Vehicle inspection coming up.",
        "message": ("Dear User,\n"
                    f"the deadline for {email_type} of your vehicle is coming soon!\n"
                    "Vechicle details:\n"
                    f"Name: {v_name}\n"
                    f"Plate number: {v_plate}\n"
                    f"VIN code: {v_vin}\n"
                    f"Inspection date: {v_date}\n\n"
                    "Sincerely yours,\nFleet assistant"),
        "email": u_email
    }


def get_inspection_notifications(conn):
    try:
        cursor = conn.cursor()

        cursor.execute('''
        SELECT v.name, v.plate_number, v.vin, c_driver.email, c_manager.email, v.next_inspection_date::text
        FROM vehicle v
        JOIN credentials c_driver on v.driver_id = c_driver.id
        JOIN credentials c_manager on v.manager_id = c_manager.id
        WHERE next_inspection_date <= CURRENT_DATE + INTERVAL '7 days'
          AND next_inspection_date >= CURRENT_DATE;
        ''')

        rows = cursor.fetchall()

        cursor.close()

        return rows

    except Exception as e:
        print(f"error: {str(e)}")
        raise


def get_insurance_notifications(conn):
    try:
        cursor = conn.cursor()

        cursor.execute('''
        SELECT v.name, v.plate_number, v.vin, c_driver.email, c_manager.email, v.insurance_date::text
        FROM vehicle v
        JOIN credentials c_driver on v.driver_id = c_driver.id
        JOIN credentials c_manager on v.manager_id = c_manager.id
        WHERE insurance_date <= CURRENT_DATE + INTERVAL '7 days'
          AND insurance_date >= CURRENT_DATE;
        ''')

        rows = cursor.fetchall()

        cursor.close()

        return rows

    except Exception as e:
        print(f"error: {str(e)}")
        raise
