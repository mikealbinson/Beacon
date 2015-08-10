var child = require('child_process');

startFlag = true;


exports.clearBluetoothCache = function () {
  child.exec('killall bluetoothd', function (error, stdout, stderr){
    console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      console.log("killall bluetoothd complete")
      setTimeout(nextCommand, 10);
  });
}


function nextCommand() {
child.exec('hciconfig hci0 up', function (error, stdout, stderr){
  console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    console.log("hci0 up complete")
  });
}