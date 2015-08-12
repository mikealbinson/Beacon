var RFID_NFC_BOARD = require('./RFID.js');
// Setup variables:
var serNum0 = 0x00;
var serNum1 = 0x00;
var serNum2 = 0x00;
var serNum3 = 0x00;
var serNum4 = 0x00;

RFID_NFC_BOARD.init();

while(true)
{
    if (RFID_NFC_BOARD.isCard()) {
        if (RFID_NFC_BOARD.readCardSerial()) {
            if (RFID_NFC_BOARD.serNum[0] != serNum0
                && RFID_NFC_BOARD.serNum[1] != serNum1
                && RFID_NFC_BOARD.serNum[2] != serNum2
                && RFID_NFC_BOARD.serNum[3] != serNum3
                && RFID_NFC_BOARD.serNum[4] != serNum4
            ) {
                /* With a new cardnumber, show it. */
                console.log("Card found");
                serNum0 = RFID_NFC_BOARD.serNum[0];
                serNum1 = RFID_NFC_BOARD.serNum[1];
                serNum2 = RFID_NFC_BOARD.serNum[2];
                serNum3 = RFID_NFC_BOARD.serNum[3];
                serNum4 = RFID_NFC_BOARD.serNum[4];
               
                //console.log(" ");
                console.log("Cardnumber:");
                console.log("Dec: ");
		        console.log(RFID_NFC_BOARD.serNum[0]);
		        console.log(RFID_NFC_BOARD.serNum[1]);
		        console.log(RFID_NFC_BOARD.serNum[2]);
		        console.log(RFID_NFC_BOARD.serNum[3]);
		        console.log(RFID_NFC_BOARD.serNum[4]);
                        
                console.log("Hex: ");
		        console.log(RFID_NFC_BOARD.serNum[0].toString(16));
		        console.log(RFID_NFC_BOARD.serNum[1].toString(16));
		        console.log(RFID_NFC_BOARD.serNum[2].toString(16));
		        console.log(RFID_NFC_BOARD.serNum[3].toString(16));
		        console.log(RFID_NFC_BOARD.serNum[4].toString(16));
             } else {
               /* If we have the same ID, just write a dot. */
               console.log(".");
             }
          }
    }
    
    RFID_NFC_BOARD.halt();
}