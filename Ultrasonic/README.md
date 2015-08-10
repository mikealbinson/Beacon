#Ultrasonic

##UltrasonicSensor.js
Controls and sets up reading the ultrasonic. 

| Function Name          | Description                                                                                                                                                                                                                                                         | Arguments | Returns | Note |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|---------|------|
| initUltrasonic()       | Initiate the voltage reading pin to read from the ultrasonic (US).                                                                                                                                                                                                  | N/A       | N/A     | N/A  |
| takeUSReading()        | Calibrates the US on startup. Then takes readings from the US and heavily filters the data to avoid large deviations in US readings. Displays a no admit if a consistent deviation less than the calibrated value of the sensor is detected and set a flag to true. | N/A       | N/A     |      |
| __resetIndicatorFlag() | Reset the indicator flag to true in order to display no admit again if another deviation is detected.                                                                                                                                                               | N/A       | N/A     | N/A  |
