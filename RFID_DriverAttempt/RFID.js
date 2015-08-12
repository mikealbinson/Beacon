/******************************************************************************************
*        An attempt at translating RFID.h/.cpp by Dr Leong and Miguel Balboa
*
*  NOTES{ -Check PASSING BY REFERENCE (& notation) (* notation)
*         -TWO LEFT, MFRCToCard, MFRC522Request
*         -Check to see if mraa SPI actually supports this
******************************************************************************************/

var mraa = require('mraa')

var MAX_LEN = 16 // Largo máximo de la matriz

//MF522 commands
var PCD_IDLE = 0x00 // No action, cancel command
var PCD_AUTHENT = 0x0E // autenticación de clave
var PCD_RECEIVE = 0x08 // recepción de datos
var PCD_TRANSMIT = 0x04 // Enviar datos
var PCD_TRANSCEIVE = 0x0C // Enviar y recibir datos
var PCD_RESETPHASE = 0x0F // reajustar
var PCD_CALCCRC = 0x03 // CRC calcular

//Mifare_One Tarjeta Mifare_One comando palabra
var PICC_REQIDL = 0x26 // Área de la antena no está tratando de entrar en el estado de reposo
var PICC_REQALL = 0x52 // Todas las cartas para encontrar el área de la antena
var PICC_ANTICOLL = 0x93 // anti-colisión
var PICC_SElECTTAG = 0x93 // elección de tarjeta
var PICC_AUTHENT1A = 0x60 // verification key A
var PICC_AUTHENT1B = 0x61 // verification Key B
var PICC_READ = 0x30 // Read block
var PICC_WRITE = 0xA0 // Write a block
var PICC_DECREMENT = 0xC0 // cargo
var PICC_INCREMENT = 0xC1 // recargar
var PICC_RESTORE = 0xC2 // Transferencia de datos de bloque de buffer
var PICC_TRANSFER = 0xB0 // Guardar los datos en el búfer
var PICC_HALT = 0x50 // Inactive

//MF522 Código de error de comunicación cuando regresó
var MI_OK = 0
var MI_NOTAGERR = 1
var MI_ERR = 2
 
 //------------------ MFRC522 registers---------------
 //Page 0{Command and Status
 var Reserved00 = 0x00
 var CommandReg = 0x01
 var CommIEnReg = 0x02
 var DivlEnReg = 0x03
 var CommIrqReg = 0x04
 var DivIrqReg = 0x05
 var ErrorReg = 0x06
 var Status1Reg = 0x07
 var Status2Reg = 0x08
 var FIFODataReg = 0x09
 var FIFOLevelReg = 0x0A
 var WaterLevelReg = 0x0B
 var ControlReg = 0x0C
 var BitFramingReg = 0x0D
 var CollReg = 0x0E
 var Reserved01 = 0x0F
 
 //Page 1{Command
 var Reserved10 = 0x10
 var ModeReg = 0x11
 var TxModeReg = 0x12
 var RxModeReg = 0x13
 var TxControlReg = 0x14
 var TxAutoReg = 0x15
 var TxSelReg = 0x16
 var RxSelReg = 0x17
 var RxThresholdReg = 0x18
 var DemodReg = 0x19
 var Reserved11 = 0x1A
 var Reserved12 = 0x1B
 var MifareReg = 0x1C
 var Reserved13 = 0x1D
 var Reserved14 = 0x1E
 var SerialSpeedReg = 0x1F
 
 //Page 2{CFG
 var Reserved20 = 0x20
 var CRCResultRegM= 0x21
 var CRCResultRegL = 0x22
 var Reserved21 = 0x23
 var ModWidthReg = 0x24
 var Reserved22 = 0x25
 var RFCfgReg = 0x26
 var GsNReg = 0x27
 var CWGsPReg    = 0x28
 var ModGsPReg = 0x29
 var TModeReg = 0x2A
 var TPrescalerReg= 0x2B
 var TReloadRegH = 0x2C
 var TReloadRegL = 0x2D
 var TCounterValueRegH= 0x2E
 var TCounterValueRegL = 0x2F
 
 //Page 3{TestRegister
 var Reserved30 = 0x30
 var TestSel1Reg = 0x31
 var TestSel2Reg = 0x32
 var TestPinEnReg = 0x33
 var TestPinValueReg= 0x34
 var TestBusReg = 0x35
 var AutoTestReg = 0x36
 var VersionReg = 0x37
 var AnalogTestReg = 0x38
 var TestDAC1Reg = 0x39 
 var TestDAC2Reg = 0x3A 
 var TestADCReg = 0x3B 
 var Reserved31 = 0x3C 
 var Reserved32 = 0x3D 
 var Reserved33 = 0x3E 
 var Reserved34 = 0x3F

/**********************************************************************
* Begin actual implementation
**********************************************************************/

function RFID_NFC_BOARD (){
    this.Spi_Bus = mraa.Spi()    
    this.chip_select = mraa.Gpio(4)////Chip select pin
    this.reset_pin = mraa.Gpio(3)////Select Reset pin
}

RFID_NFC_BOARD.prototype.init = function(){
    chip_select.dir(mraa.DIR_OUT)
    chip_select.write(0)
    reset_pin.dir(mraa.DIR_IN)
    reset_pin.write(1)
}

 RFID_NFC_BOARD.prototype.isCard = function(){
    var str = [MAX_LEN]
    var status = MFRC522Request(PICC_REQIDL, str)
    if (status == MI_OK){
        return true
    }
    else {
        return false
    }
}

 RFID_NFC_BOARD.prototype.readCardSerial = function(){
    var str = [MAX_LEN]
    var status = anticoll(str)
    memcpy(serNum,str, 5) ////see if this function exists somewhere
    if (status == MI_OK){
        return true
    }
    else{
        return false
    }
}

RFID_NFC_BOARD.prototype.reset = function(){
    writeMFRC552(CommandReg, PCD_RESETPHASE)
}

 RFID_NFC_BOARD.prototype.writeMFRC552 = function(addr, val){
    chip_select.write(0)
    Spi_Bus.transfer((addr<<1)&0x7E) ////check and see if this exists
    Spi_Bus.transfer(val)
}

 RFID_NFC_BOARD.prototype.antennaOn = function(){
    var temp = readMFRC522(TxControlReg)
    if (!(temp & 0x03)){
        setBitMask(TxControlReg, 0x03)
    }
}

 RFID_NFC_BOARD.prototype.readMFRC522 = function(addr){
    chip_select.write(0)
    Spi_Bus.transfer(((addr<<1)&0x73) | 0x80)
    var val = Spi_Bus.transfer(0x00)
    chip_select.write(1)
    return val
}

 RFID_NFC_BOARD.prototype.setBitMask = function(reg, mask){
    var tmp = readMFRC522(reg)
    writeMFRC552(reg, temp | (~mask))
}


 RFID_NFC_BOARD.prototype.clearBitMask = function(reg, mask){
    var tmp = readMFRC522(reg)
    writeMFRC552(reg, temp & (~mask))
}

 RFID_NFC_BOARD.prototype.calculateCRC = function(pInData, len, pOutData){
    var i = 0
    var n = 0
    clearBitMask(DivIrqReg, 0x04)
    setBitMask(FIFOLevelReg, 0x80)
    for (i=0; i<len; i++){
        writeMFRC552(FIFODataReg, (pInData+i))
    }
        
    writeMFRC552(CommandReg, PCD_CALCCRC)
    i = 0xFF
    do { 
        n = readMFRC522(DivIrqReg)
        i = i-1
    }
    while ((i!=0) && !(n&0x04))

    pOutData[0] = readMFRC522(CRCResultRegL)
    pOutData[1] = readMFRC522(CRCResultRegM)
}

 RFID_NFC_BOARD.prototype.MFRC522Request = function(reqMode, TagType){
    var status;  
    var backBits;          //   Recibió bits de datos

    writeMFRC522(BitFramingReg, 0x07);      //TxLastBists = BitFramingReg[2..0] ???
    
    TagType[0] = reqMode;
    status = MFRC522ToCard(PCD_TRANSCEIVE, TagType, 1, TagType, backBits);

    if ((status != MI_OK) || (backBits != 0x10))
    {    
        status = MI_ERR;
    }
   
    return status;
}



 RFID_NFC_BOARD.prototype.MFRC522ToCard= function(command, sendData, sendLen, backData, backLen){
    var status = MI_ERR
    var irqEn = 0x00
    var waitIRq = 0x00
    var lastBits = 0;
    var n = 0;
    var i = 0;
     
    if (command == PCD_AUTHENT) {      //Tarjetas de certificación cerca
        irqEn = 0x12
        waitIRq = 0x10
    }
    
    else if (commmand == PCD_TRANSCEIVED) {    //La transmisión de datos FIFO
        irqEn = 0x77
        waitIRq = 0x30
    }

    writeMFRC552(CommIEnReg, irqEn|0x80)
    clearBitMask(CommIrqReg, 0x80)
    setBitMask(FIFOLevelReg, 0x80)
    writeMFRC552(CommandReg, PCD_IDLE)

    for (i=0;i<sendLen;i++){
        writeMFRC552(FIFODataReg, sendData[i])
        writeMFRC552(CommandReg, PCD_IDLE)
    }

    if (command == PCD_TRANSCEIVE){
        setBitMask(BitFramingReg, 0x80)
    }
    i = 2000
    do {
        n = readMFRC522(CommIrqReg)
        i = i-1
    }
    while ((i!=0) && !(n&0x01) &&!(n&waitIRq))
        
    clearBitMask(BitFramingReg, 0x80)
        
    if (i != 0) {
        if (!readMFRC522(ErrorReg) & 0x1B){
            status = MI_OK
            if (n & irqEn & 0x01){
                status = MI_NOTAGERR;
            }
            if (command == PCD_TRANSCEIVE)
            {
                n = readMFRC522(FIFOLevelReg);
                lastBits = readMFRC522(ControlReg) & 0x07;
                if (lastBits)
                {   
                    backLen = (n-1)*8 + lastBits;   
                }

                else
                {   
                    backLen = n*8;   
                }

                if (n == 0)
                {   
                    n = 1;    
                }

                if (n > MAX_LEN)
                {   
                    n = MAX_LEN;   
                }

                for (i=0; i<n; i++)
                {   
                    backData[i] = readMFRC522(FIFODataReg);    
                }
            }
        }
        else
        {   
            status = MI_ERR;  
        }  
    }
    return status;
}

 RFID_NFC_BOARD.prototype.anticoll= function(serNum){
    writeMFRC522(BitFramingReg, 0x00)
    var serNum = []
    serNum[0] = PICC_ANTICOLL
    serNum[1] = 0x20
    var status = MFRC522ToCard(PCD_TRANSCEIVE, serNum, 2, serNum, unLen)
        
    if (status == MI_OK){
        for (i=0; i<4; i++){
            sernumCheck ^= sernum[i]
        }
        if (sernumCheck != serNum[i]){
            status = MI_ERR
        }
    }
    return status
}

 RFID_NFC_BOARD.prototype.auth =function (authMode, BlockAddr, SectorKey, serNum){
    var buff = []
    buff[0] = authMode
    buff[1] = BlockAddr
    for (i=0; i<6; i++){
        buff[i+2] = (SectorKey+1) //used to be *(SectorKey+1)
    }
    for (i=0; i<4; i++){
        buff[i+8] = (serNum+1)//used to be *(SerNum+1)
    }
    var status = MFRC522ToCard(PCD_AUTHENT, buff, 12, buff, recvBits)

    if (status != MI_OK || !(readMFRC522(Status2Reg) & 0x08)){
        status = MI_ERR
    }
        
    return status
}


 RFID_NFC_BOARD.prototype.read= function(BlockAddr, recvData){
    var recvData = []
    recvData[0] = PICC_READ
    recvData[1] = blockAddr
    calculateCRC(recvData, 2, recvData[2])
    var status = MFRC522ToCard(PCD_TRANSCEIVE, recvData, 4, buff, unLen)

    if (status != MI_OK || unLen != 0x90){
        status = MI_ERR
    }

    return status
}

 RFID_NFC_BOARD.prototype.write = function(blockAddr, writeData){
    var buff = [18]
    buff[0] = PICC_WRITE
    buff[1] = blockAddr
    calculateCRC(buff, 2, buff[2])
    var status = MFRC522ToCard(PCD_TRANSCEIVE, buff, 4, buff, recvBits)

    if (status != MI_OK || recvBits != 4 || (buff[0] & 0x0F) != 0x0A){
        status = MI_ERR
    }
        
    if (status == MI_OK){
        for (i=0; i<16; i++) 
        {    
            buff[i] = (writeData+i);   
        }
        calculateCRC(buff, 16, buff[16]);
        status = MFRC522ToCard(PCD_TRANSCEIVE, buff, 18, buff, recvBits);
        
        if ((status != MI_OK) || (recvBits != 4) || ((buff[0] & 0x0F) != 0x0A))
        {   
            status = MI_ERR;   
        }
    }
    
    return status;
}


RFID_NFC_BOARD.prototype.halt = function(){
    var buff = []
    buff[0] = PICC_HALT
    buff[1] = 0
    calculateCRC(buff, 2, buff[2])
    var status = MFRC522ToCard(PCD_TRANSCEIVE, buff, 4, buff, unLen)
};


module.export = RFID_NFC_BOARD;
                      





