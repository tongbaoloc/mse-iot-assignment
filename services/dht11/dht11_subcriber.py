from awscrt import io, mqtt, auth, http
from awsiot import mqtt_connection_builder
import time
import json
import adafruit_dht
import board
import sys

# Configuration Parameters
ENDPOINT = "a1kfygo2s7d0ba-ats.iot.ap-southeast-1.amazonaws.com"
CLIENT_ID = "things/sub/dht11_01"
PATH_TO_CERT = "certificate.pem.crt"
PATH_TO_KEY = "private.pem.key"
PATH_TO_ROOT = "AmazonRootCA1.pem"
TOPIC = "things/dht11_01"

# subscribe a message topic on AWS IoT Core
def on_message_received(topic, payload, **kwargs):
    print(f"Received message from topic '{topic}'")
    try:
        payload_dict = json.loads(payload)
        print("Payload:", payload_dict)
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
