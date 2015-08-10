//LedsAndBuzzer.js

var mraa = require('mraa');

/******************************************************************************
 * Buzzer Definition
 ******************************************************************************/
var buzzPin = new mraa.Pwm(5);

function buzzAdmitNote1(){
    buzzPin.period (1000);
    buzzPin.write(.3);
}

function buzzAdmitNote2(){
  buzzPin.period_us(500);
    buzzPin.write(.3);
}

function buzzNoAdmitNote1(){
  buzzPin.period_us(1500);
    buzzPin.write (0.5); 
}

function stopBuzz(){
  buzzPin.write(0);
}

function endBuzz(){
  buzzPin.enable(false);
}

exports.buzzAdmit = function(){
    buzzPin.enable(true);
    buzzAdmitNote1();
    setTimeout(stopBuzz, 500);
    setTimeout(buzzAdmitNote2, 501);
    setTimeout(stopBuzz, 1000);
    setTimeout(endBuzz, 1010);
}

exports.buzzNoAdmit = function(){
    buzzPin.enable(true);
    buzzNoAdmitNote1();
    setTimeout(stopBuzz, 1000);
    setTimeout(endBuzz, 1010);
}

/******************************************************************************
 * LED Definitions
 ******************************************************************************/

var redLed = new mraa.Gpio(7);
var greenLed = new mraa.Gpio(6);
redLed.dir(mraa.DIR_OUT);
greenLed.dir(mraa.DIR_OUT);
redLed.write(0);
greenLed.write(0);

exports.ledFlashAdmit = function(){
  greenLed.write(1);
  setTimeout(ledIndicatorsOff, 1000);
}

exports.ledFlashNoAdmit = function(){
  redLed.write(1);
  setTimeout(ledIndicatorsOff, 1000);
}

function ledIndicatorsOff(){
  redLed.write(0);
  greenLed.write(0);
}

/******************************************************************************
 * Special Case Function--kill no admit indicators
 ******************************************************************************/

exports.killNoAdmitIndicators = function(){
  redLed.write(0);
  stopBuzz();
  endBuzz();
}