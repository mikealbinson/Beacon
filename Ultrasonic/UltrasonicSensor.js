//UltrasonicSensor.js
var mraa = require('mraa');

var __filteredData = 0;
var __readMEEE = [];
var __counter = 0;
var __counterFlag = false;
var __indicatorFlag = true;
var __voltageReaderPin;
var __calibrationFlag = false;
var __defaultCalibration = 150;

exports.indicatorFlag = false;

exports.initUltrasonic = function(){
	__voltageReaderPin = new mraa.Aio(0);
}

exports.takeUSReading = function(){ //takes several measurements from the ultrasonic and filters them
	__readMEEE[0] = __voltageReaderPin.read();
	__readMEEE[1] = __voltageReaderPin.read();
	__readMEEE[2] = __voltageReaderPin.read();

	if (__readMEEE[0] == __readMEEE[1] && __readMEEE[1] == __readMEEE[2]) {
		__filteredData = __readMEEE[0];
		//console.log(__filteredData) //for debugging purposes
		if (__filteredData < __defaultCalibration && __calibrationFlag == true) {
			if (__counterFlag == true){
				__counter++;
			}
			__counterFlag = true;
		}
		else {
			__counterFlag = false;
			__counter = 0;
			exports.indicatorFlag = false;
		}

		if (__calibrationFlag == false) {
			__defaultCalibration = __filteredData - 30;
			console.log("Ultrasonic calibrated to " + __filteredData);
			console.log ("generally a calibration of approximately 100 correates to about a meter");
			__calibrationFlag = true;
		}

		if (__counter > 10 && __calibrationFlag == true){
			if (__indicatorFlag == true){
        		__indicatorFlag = false;
				setTimeout (__resetIndicatorFlag, 10);
				exports.indicatorFlag = true;
			}
	        else {
	        	exports.indicatorFlag = false;
	        }
			__counter = 0;
		}
		else {
			exports.indicatorFlag = false;
		}
	}
}

function __resetIndicatorFlag(){
	__indicatorFlag = true;
}