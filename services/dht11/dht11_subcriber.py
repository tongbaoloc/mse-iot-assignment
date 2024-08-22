from awscrt import io, mqtt, auth, http
from awsiot import mqtt_connection_builder
import time
import json
import RPi.GPIO as GPIO
import adafruit_dht
import board
import sys


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

#cau hinh
config_json = """
{
    "actiondate": {
        "begindate": "21/08/2024"
    },
    "incubator_setting": [
        {"day": 1, "temp": 37.8, "humid": 60, "to_humid": 61},
        {"day": 2, "temp": 37.2, "humid": 60, "to_humid": 61},
        {"day": 3, "temp": 37.8, "humid": 60, "to_humid": 61},
        {"day": 4, "temp": 37.8, "humid": 60, "to_humid": 61},
        {"day": 5, "temp": 37.8, "humid": 60, "to_humid": 61},
        {"day": 6, "temp": 37.8, "humid": 55, "to_humid": 57},
        {"day": 7, "temp": 37.8, "humid": 55, "to_humid": 57},
        {"day": 8, "temp": 37.6, "humid": 55, "to_humid": 57},
        {"day": 9, "temp": 37.6, "humid": 55, "to_humid": 57},
        {"day": 10, "temp": 37.6, "humid": 55, "to_humid": 57},
        {"day": 11, "temp": 37.6, "humid": 55, "to_humid": 57},
        {"day": 12, "temp": 37.6, "humid": 50, "to_humid": 53},
        {"day": 13, "temp": 37.6, "humid": 50, "to_humid": 53},
        {"day": 14, "temp": 37.6, "humid": 50, "to_humid": 53},
        {"day": 15, "temp": 37.6, "humid": 50, "to_humid": 53},
        {"day": 16, "temp": 37.6, "humid": 50, "to_humid": 53},
        {"day": 17, "temp": 37.6, "humid": 50, "to_humid": 53},
        {"day": 18, "temp": 37.6, "humid": 50, "to_humid": 53},
        {"day": 19, "temp": 37.2, "humid": 60, "to_humid": 60},
        {"day": 20, "temp": 37.2, "humid": 70, "to_humid": 75},
        {"day": 21, "temp": 37.2, "humid": 70, "to_humid": 75}
    ]
}
"""

# Parse the JSON string to a Python dictionary
config_data = json.loads(config_json)

begindate_str = config_data['actiondate']['begindate']
begindate = datetime.strptime(begindate_str, '%d/%m/%Y')


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

        # Calculate days since begindate
        day_diff = (current_date - begindate).days + 1  
        
        print(f"Day difference: {day_diff}") 

        # Fetch the settings for the current day from the JSON config
        settings_data = next((item for item in config_data['incubator_setting'] if item['day'] == day_diff), None)
        
        print(f"Settings for day {day_diff}: {settings_data}")

        if settings_data:
            
            config_temp = settings_data['temp']
            config_humid = settings_data['humid']
            config_to_humid = settings_data['to_humid']
 
            # Compare real-time data with configured settings
            print(f"Configured Temp: {config_temp}, Configured Humidity: {config_humid} - To Humidity: {config_to_humid}")
            print(f"Real-time Temp: {temperature}, Real-time Humidity: {humidity}")
             
            if temperature > config_temp:
                
                print("Temperature exceeds the limit, turning off LED.")
                # Turn off Light
                GPIO.output(TEMPERATURE_LIGHT_PIN, GPIO.LOW)
                # Turn on Fan
                GPIO.output(FAN_PIN, GPIO.HIGH)
            else:
                
                print("Temperature is within the limit, keeping LED on.")
                
                GPIO.output(TEMPERATURE_LIGHT_PIN, GPIO.HIGH)

            if humidity < config_humid or humidity > config_humid :
                # Turn on Fan
                GPIO.output(FAN_PIN, GPIO.HIGH)
                print("Humidity does not match the configuration.")
            else:
                #GPIO.output(FAN_PIN, GPIO.LOW)
                print("Humidity is within the configured range.")

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
