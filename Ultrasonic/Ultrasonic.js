/******************************************************************************
 * High level Ultrasonic Tasks
 * ~~~Included here because reading the ultrasonic needs to be stopped
 *    temporarily in order for the person to walk through without getting
 *    flagged as "No Admit"
 ******************************************************************************/
var Ultrasonic = require('./UltrasonicSensor.js');

var timeoutFlag = false;
Ultrasonic.initUltrasonic();

exports.startUsingUltrasonic = function(){
  Ultrasonic.takeUSReading();
  setTimeout(__startUsingUltrasonic, 5);
  exports.indicatorFlag = Ultrasonic.indicatorFlag;
}

function __startUsingUltrasonic(){
  Ultrasonic.takeUSReading();
  setTimeout(__startUsingUltrasonic, 5);
  exports.indicatorFlag = Ultrasonic.indicatorFlag;
}
