var LaB = require('./LedsAndBuzzer.js')
var oled = require('./oled/OledDisplay.js')

oled.beginOled();

exports.defaultTicketflyLogo = function (){
	oled.displayTicketflyLogo();
}

exports.AdmitVIP = function (){
	LaB.ledFlashAdmit();
    LaB.buzzAdmit();
    oled.displayAdmitVIP();
}

exports.AdmitGeneral = function () {
	LaB.ledFlashAdmit();
    LaB.buzzAdmit();
    oled.displayAdmit();
}

exports.NoAdmit = function (){
	LaB.ledFlashNoAdmit();
    LaB.buzzNoAdmit();
    oled.displayNoAdmit();
}

exports.NoAdmitVoid = function (){
	LaB.ledFlashNoAdmit();
    LaB.buzzNoAdmit();
    oled.displayNoAdmitVoid();
}

exports.killAllNoAdmitIndicators = function(){
    oled.clearOLEDScreen();
    LaB.killNoAdmitIndicators();
}