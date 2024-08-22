from awscrt import io, mqtt, auth, http
from awsiot import mqtt_connection_builder
import time
import json
import adafruit_dht
import board
import sys

# Configuration Parameters
ENDPOINT = "a1kfygo2s7d0ba-ats.iot.ap-southeast-1.amazonaws.com"
CLIENT_ID = "things/pub/dht11_01"
PATH_TO_CERT = "certificate.pem.crt"
PATH_TO_KEY = "private.pem.key"
PATH_TO_ROOT = "AmazonRootCA1.pem"
TOPIC = "things/dht11_01"

# Sensor Setup
dht_pin = board.D22 # GPIO22
dht_sensor = adafruit_dht.DHT11(dht_pin)

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
            clean_session=False,
            keep_alive_secs=6
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

print('Begin Publish')
try:
    while True:
        try:
            t = dht_sensor.temperature
            h = dht_sensor.humidity
            if t is not None and h is not None:
                message = {"id": CLIENT_ID, "Temperature": t, "Humidity": h, "timestamp": time.time()}
                mqtt_connection.publish(topic=TOPIC, payload=json.dumps(message), qos=mqtt.QoS.AT_LEAST_ONCE)
                print(f"Published: '{json.dumps(message)}' to the topic: {TOPIC}")
            else:
                print("Sensor failure. Retrying...")
            
        except RuntimeError as error:
            print(f"Failed to read sensor: {error}")
        time.sleep(3)

except KeyboardInterrupt:
    print('Publish End. Disconnecting...')
finally:
    disconnect_future = mqtt_connection.disconnect()
    disconnect_future.result()
    print('Disconnected!')