from flask import Flask, render_template, request, Response,redirect,url_for
import RPi.GPIO as GPIO
import cv2
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})
CORS(app)

FAN_PIN = 17
TEMPERATURE_LIGHT_PIN = 4
MOTOR_PIN = 27
DHT11_PIN = 22



GPIO.setmode(GPIO.BCM)
GPIO.setup(FAN_PIN, GPIO.OUT)
GPIO.setup(TEMPERATURE_LIGHT_PIN, GPIO.OUT)
GPIO.setup(MOTOR_PIN, GPIO.OUT)

# Initialize camera
camera = cv2.VideoCapture(0)
cap = None

#load templates/camera.html
@app.route('/index')
def index():
    return render_template('camera.html')

# define a route to check status of all devices and the DHT11 sensor connected to the Raspberry Pi
@app.route("/status", methods=["GET"])
def status():
    status = {
        "fan": GPIO.input(FAN_PIN),
        "temperature_light": GPIO.input(TEMPERATURE_LIGHT_PIN),
        "motor": GPIO.input(MOTOR_PIN)
    }
    return status

# define a route to turn on all devices
@app.route("/all_on", methods=["GET"])
def all_on():
    GPIO.output(FAN_PIN, GPIO.HIGH)
    GPIO.output(TEMPERATURE_LIGHT_PIN, GPIO.HIGH)
    GPIO.output(MOTOR_PIN, GPIO.HIGH)
    
    response = app.response_class(
            response="{'status': 'success'}",
            status=200,
            mimetype='application/json'
    )
    return response

#define a route to turn off all devices
@app.route("/all_off", methods=["GET"])
def all_off():
    GPIO.output(FAN_PIN, GPIO.LOW)
    GPIO.output(TEMPERATURE_LIGHT_PIN, GPIO.LOW)
    GPIO.output(MOTOR_PIN, GPIO.LOW)
    
    response = app.response_class(
            response="{'status': 'success'}",
            status=200,
            mimetype='application/json'
    )
    return response


# define a route for the Motor control via relay at MOTOR_PIN
@app.route("/motor_control", methods=["GET"])
def motor_control():
    if request.args.get('action') == 'On':
        GPIO.output(MOTOR_PIN, GPIO.HIGH)
    elif request.args.get('action') == 'Off':
        GPIO.output(MOTOR_PIN, GPIO.LOW)
        
    response = app.response_class(
            response="{'status': 'success'}",
            status=200,
            mimetype='application/json'
    )
    return response 


# define a route for the Fan control via relay at FAN_PIN
@app.route("/fan_control", methods=["GET"])
def fan_control():
    if request.args.get('action') == 'On':
        GPIO.output(FAN_PIN, GPIO.HIGH)
    elif request.args.get('action') == 'Off':
        GPIO.output(FAN_PIN, GPIO.LOW)
        
    response = app.response_class(
            response="{'status': 'success'}",
            status=200,
            mimetype='application/json'
    )
    
    return response 

# define a route for the Light control via relay at TEMPERATURE_LIGHT_PIN
@app.route("/light_control", methods=["GET"])
def light_control():
    if request.args.get('action') == 'On':
        GPIO.output(TEMPERATURE_LIGHT_PIN, GPIO.HIGH)
    elif request.args.get('action') == 'Off':
        GPIO.output(TEMPERATURE_LIGHT_PIN, GPIO.LOW)
        
    response = app.response_class(
            response="{'status': 'success'}",
            status=200,
            mimetype='application/json'
    )
    return response 

# Video streaming route
@app.route('/start_camera')
def start_camera():
    global cap
    cap = cv2.VideoCapture(0)
    return redirect(url_for('index'))

@app.route('/stop_camera')
def stop_camera():
    global cap
    if cap is not None:
        cap.release()
        cap = None
    return redirect(url_for('index'))

def generate_frames():
    while True:
        success, frame = camera.read()  # Capture frame-by-frame
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == "__main__":

    try:
        app.run(host="0.0.0.0", port=5000)
    finally:
        GPIO.cleanup()