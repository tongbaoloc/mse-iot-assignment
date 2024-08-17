from flask import Flask, render_template, request
import RPi.GPIO as GPIO

app = Flask(__name__)

RELAY_PIN = 17
TEMPERATURE_LIGHT_PIN = 27

GPIO.setmode(GPIO.BCM)
GPIO.setup(RELAY_PIN, GPIO.OUT)
GPIO.setup(TEMPERATURE_LIGHT_PIN, GPIO.OUT)

@app.route("/")
def index():
    return render_template('index.html')


# define a route for the Fan control via relay at GPIO 17, method get
@app.route("/fan_control", methods=["GET"])
def fan_control():
    if request.args.get('action') == 'On':
        GPIO.output(RELAY_PIN, GPIO.HIGH)
    elif request.args.get('action') == 'Off':
        GPIO.output(RELAY_PIN, GPIO.LOW)
    return render_template('index.html')

# define a route for the Light control via relay at GPIO 27
@app.route("/light_control", methods=["GET"])
def light_control():
    if request.args.get('action') == 'On':
        GPIO.output(TEMPERATURE_LIGHT_PIN, GPIO.HIGH)
    elif request.args.get('action') == 'Off':
        GPIO.output(TEMPERATURE_LIGHT_PIN, GPIO.LOW)
    return render_template('index.html')

if __name__ == "__main__":

    try:
        app.run(host="0.0.0.0", port=5000)
    finally:
        GPIO.cleanup()