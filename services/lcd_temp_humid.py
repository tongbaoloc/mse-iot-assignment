from RPLCD.i2c import CharLCD
import adafruit_dht
import board
import time


dht_pin = board.D22 # GPIO22
dht_sensor = adafruit_dht.DHT22(dht_pin) #DHT11(dht_pin)

# Initialize the LCD
lcd = CharLCD(i2c_expander='PCF8574', address=0x27, port=1, cols=20, rows=4, dotsize=8) #cols=16, rows=2

try:
    while True:
        
        temperature = dht_sensor.temperature
        humidity = dht_sensor.humidity
        
        
        if humidity is not None and temperature is not None:
            # Hiển thị nhiệt độ và độ ẩm lên màn hình LCD
            lcd.clear()
            lcd.write_string("Temperature: {0:0.1f} C".format(temperature))
            lcd.cursor_pos = (1, 0)
            lcd.write_string("Humidity: {0:0.1f} %".format(humidity))
        else:
            lcd.clear()
            lcd.write_string("Sensor error!")

        # Đợi 2 giây trước khi cập nhật lại dữ liệu
        time.sleep(2)

except KeyboardInterrupt:
    pass

finally:
    lcd.clear()