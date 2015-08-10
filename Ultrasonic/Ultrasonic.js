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
  //if (timeoutFlag == false) {
    Ultrasonic.takeUSReading();
  //}
  //else {
  	//setTimeout(__resetTimeoutFlag, 1500);
  //}
  setTimeout(__startUsingUltrasonic, 5);
  exports.indicatorFlag = Ultrasonic.indicatorFlag;
}

function __startUsingUltrasonic(){
   //if (timeoutFlag == false) {
    Ultrasonic.takeUSReading();
  //}
  //else {
    //setTimeout(__resetTimeoutFlag, 1500);
  //}
  setTimeout(__startUsingUltrasonic, 5);
  exports.indicatorFlag = Ultrasonic.indicatorFlag;
}

/*
function __resetTimeoutFlag (){
  console.log("US armed")
  timeoutFlag = false;
}
*/