

/******************************************************************************
 * Init bleno
 ******************************************************************************/

var bleno = require('/home/root/Ticketfly_Beacon/node_modules/bleno/index'); //DUE TO CHANGE
var util = require('util');


var BlenoPrimaryService = bleno.PrimaryService;
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;
var dataString = "";
exports.dataString = dataString;

/******************************************************************************
 * Write only characteristic definition
 ******************************************************************************/
var WriteOnlyCharacteristic = function() {
  WriteOnlyCharacteristic.super_.call(this, {
    uuid: '2340503E-0DE1-4B6E-ACB4-209EB49580F8',
    properties: ['write', 'writeWithoutResponse']
  });
};

util.inherits(WriteOnlyCharacteristic, BlenoCharacteristic);

WriteOnlyCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  dataString = data.toString('utf8');
  console.log(dataString);
  exports.dataString = dataString;
  setTimeout(resetDataString, 100);
  callback(this.RESULT_SUCCESS);
};

/******************************************************************************
 * Service Definition
 ******************************************************************************/
function SampleService() {
  SampleService.super_.call(this, {
    uuid: '7562438A-2284-4D03-AC70-B15509F87B94',
    characteristics: [
      new WriteOnlyCharacteristic(),
    ]
  });
}
util.inherits(SampleService, BlenoPrimaryService);
//////////////////////////////////////

/******************************************************************************
 * Ibeacon and BLE implementation
 ******************************************************************************/
function __startAdvertisingIbeacon(){
  console.log('ibeacon on');
  bleno.startAdvertisingIBeacon('e2c56db5dffb48d2b060d0f5a71096e0', 0, 0, -59);
  stopIbeacon = setTimeout(__stopAdvertisingIbeacon, 100);
  startBLE = setTimeout(__startAdvertisingBle, 100);
}

function __stopAdvertisingIbeacon(){
  bleno.stopAdvertising();
  console.log('ibeacon off');
}

function __startAdvertisingBle(){
  console.log('BLE on');
  bleno.startAdvertising('Edison_Ticketfly', ['7562438A-2284-4D03-AC70-B15509F87B94']);

  stopBLE = setTimeout(__stopAdvertisingBle, 1000);
  startIbeacon = setTimeout(__startAdvertisingIbeacon, 1000);
}

function __stopAdvertisingBle (){
  bleno.stopAdvertising();
  console.log('BLE off');
}

exports.beginBroadcasting = function(){
  if (startFlag == true) {
      console.log('app started')
      __startAdvertisingIbeacon();
      startFlag = false;
    }
}

// Linux only event definitions /////////////////
bleno.on('accept', function(clientAddress) {
  console.log('on -> accept, client: ' + clientAddress);
  bleno.updateRssi();
  clearTimeout(startIbeacon);
  clearTimeout(stopBLE);
  console.log("done connecting");
});

bleno.on('disconnect', function(clientAddress) {
  console.log('on -> disconnect, client: ' + clientAddress);
  console.log("reinit iBeacon");
  setTimeout(__stopAdvertisingBle, 100);
  setTimeout(__startAdvertisingIbeacon, 100);
});

bleno.on('rssiUpdate', function(rssi) {
  console.log('on -> rssiUpdate: ' + rssi);
});
//////////////////////////////////////

// Standard event definitions /////////////////
bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
    if (!error) {
      bleno.setServices([
      new SampleService()
    ]);
  }
});

bleno.on('mtuChange', function(mtu) {
  console.log('on -> mtuChange: ' + mtu);
});

bleno.on('advertisingStop', function() {
  console.log('off -> advertisingStop');
});

bleno.on('servicesSet', function(error) {
  console.log('on -> servicesSet: ' + (error ? 'error ' + error : 'success'));
});


function resetDataString(){
  dataString = "";
  exports.dataString = dataString;
}
