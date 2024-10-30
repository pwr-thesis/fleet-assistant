import time

import requests


def delete_vehicle_locations(vehicle_id):
    url = 'http://localhost:8080/api/v1/vehicle/{}/location'.format(vehicle_id)
    headers = {'Content-Type': 'application/json'}

    response = requests.delete(url, headers=headers)
    if response.status_code == 204:
        print('Locations deleted successfully for ID:', vehicle_id)
    else:
        print('Response:', response.text)
        raise Exception('Failed to delete locations for ID:', vehicle_id)


def send_vehicle_location(vehicle_id, latitude, longitude):
    url = 'http://localhost:8080/api/v1/vehicle/{}/location'.format(vehicle_id)
    headers = {'Content-Type': 'application/json'}

    location_data = {
        'latitude': latitude,
        'longitude': longitude
    }

    response = requests.post(url, headers=headers, json=location_data)
    if response.status_code == 200:
        print('Location sent successfully for ID:', vehicle_id)
    else:
        print('Response:', response.text)
        raise Exception('Failed to send location for ID:', vehicle_id)


vehicle_id = input("Enter ID: ")
delete_vehicle_locations(vehicle_id)
locations = [
    (51.104287, 17.085214),
    (51.104475, 17.081910),
    (51.104852, 17.079635),
    (51.105634, 17.077146),
    (51.106496, 17.074657),
    (51.107574, 17.072039),
    (51.108113, 17.069936),
    (51.108894, 17.069421),
    (51.109945, 17.069593),
    (51.111131, 17.069851),
    (51.112532, 17.070022),
    (51.113717, 17.071181),
    (51.114795, 17.072940),
    (51.116115, 17.079549),
    (51.117031, 17.082553),
    (51.117111, 17.085300),
    (51.117273, 17.087017),
    (51.117677, 17.089291),
    (51.116680, 17.090150),
    (51.115495, 17.090278),
    (51.114202, 17.090493),
    (51.111750, 17.090536),
    (51.109891, 17.090450),
    (51.105796, 17.090192),
    (51.104394, 17.089420),
    (51.104179, 17.087231),
    (51.104287, 17.085214),
]
for latitude, longitude in locations:
    send_vehicle_location(vehicle_id, latitude, longitude)
    time.sleep(5)