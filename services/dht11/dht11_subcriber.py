from awscrt import io, mqtt, auth, http
from awsiot import mqtt_connection_builder
import time
import json
import RPi.GPIO as GPIO
import adafruit_dht
import board
import sys

from pymongo import MongoClient
from datetime import datetime 

# Configuration Parameters
ENDPOINT = "a1kfygo2s7d0ba-ats.iot.ap-southeast-1.amazonaws.com"
CLIENT_ID = "things/sub/dht11_01"
PATH_TO_CERT = "certificate.pem.crt"
PATH_TO_KEY = "private.pem.key"
PATH_TO_ROOT = "AmazonRootCA1.pem"
TOPIC = "things/dht11_01"

FAN_PIN = 17
TEMPERATURE_LIGHT_PIN = 4
MOTOR_PIN = 27
DHT11_PIN = 18


GPIO.setmode(GPIO.BCM)
GPIO.setup(FAN_PIN, GPIO.OUT)
GPIO.setup(TEMPERATURE_LIGHT_PIN, GPIO.OUT)



# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["database_name"]

#actiondate (id,begindate)
#example: actiondate(0,'2024-08-10')
actiondate = db["actiondate"]

#incubator_setting(if,day, temp, humid)
#example: 
# incubator_setting(0, 1, 37, 60)
# incubator_setting(0, 2, 37, 60)
# incubator_setting(0, 3, 37, 60)
# .....................
# incubator_setting(9, 10, 37.5, 65)
# .....................
# incubator_setting(20 , 21, 37.8, 65)

incubator_setting = db["incubator_setting"]

# subscribe a message topic on AWS IoT Core
def on_message_received(topic, payload, **kwargs):
    print(f"Received message from topic '{topic}'")
    try:

        payload_dict = json.loads(payload)
        print("Payload:", payload_dict)

        # Extract real-time data from JSON payload
        temperature = payload_dict.get("Temperature")
        humidity = payload_dict.get("Humidity")

        # Get current date
        current_date = datetime.now()

        # Fetch begindate from table1
        config_data = actiondate.find_one() #{"ID": 0}
        begindate = datetime.strptime(config_data['begindate'], '%d/%m/%Y')
        
        # Calculate days since begindate
        day_diff = (current_date - begindate).days + 1   

        # Fetch the settings for the current day from table2
        settings_data = incubator_setting.find_one({"day": day_diff})
        if settings_data:
            config_temp = settings_data['temp']
            config_humid = settings_data['humid']
 
            # Compare real-time data with configured settings
            print(f"Configured Temp: {config_temp}, Configured Humidity: {config_humid}")
            print(f"Real-time Temp: {temperature}, Real-time Humidity: {humidity}")
             
            if temperature > config_temp:
                print("Temperature exceeds the limit, turning off LED.")
                #off Light
                GPIO.output(TEMPERATURE_LIGHT_PIN, GPIO.LOW)
                #turn on Fan
                GPIO.output(FAN_PIN, GPIO.HIGH)
                # Code to turn off LED
            else:
                print("Temperature is within the limit, keeping LED on.")
                GPIO.output(TEMPERATURE_LIGHT_PIN, GPIO.HIGH)
                # Code to keep LED on

            if humidity != config_humid:
                print("Humidity does not match the configuration.")
                # Code xư ly gi do
            
        else:
            print(f"No settings found for day {day_diff}") 

    except json.JSONDecodeError as e:
        print("Failed to decode JSON payload:", e)

# MQTT Setup
event_loop_group = io.EventLoopGroup(1)
host_resolver = io.DefaultHostResolver(event_loop_group)
client_bootstrap = io.ClientBootstrap(event_loop_group, host_resolver)
mqtt_connection = mqtt_connection_builder.mtls_from_path(
        endpoint=ENDPOINT,
        cert_filepath=PATH_TO_CERT,
        pri_key_filepath=PATH_TO_KEY,
        client_bootstrap=client_bootstrap,
        ca_filepath=PATH_TO_ROOT,
        client_id=CLIENT_ID,
        clean_session=True,
        keep_alive_secs=30
)

# Attempt to connect to MQTT broker
try:
    print(f"Connecting to {ENDPOINT} with client ID '{CLIENT_ID}'...")
    connect_future = mqtt_connection.connect()
    connect_future.result()  # Wait for the connection to complete
    print('Connection successful!')
except Exception as e:
    print(f"Connect error: {e}")
    sys.exit(1)

print('Begin Subscribe')

try:
    subscribe_future, packet_id = mqtt_connection.subscribe(
        topic=TOPIC,
        qos=mqtt.QoS.AT_LEAST_ONCE,
        callback=on_message_received
    )
    subscribe_result = subscribe_future.result()
    print(f"Subscribed with {str(subscribe_result['qos'])}")
except Exception as e:
    print(f"Subscribe error: {e}")
    sys.exit(1)

while True:
    time.sleep(1)

# # Disconnect
# print("Disconnecting...")
# disconnect_future = mqtt_connection.disconnect()
# disconnect_future.result()
# print("Disconnected!")
