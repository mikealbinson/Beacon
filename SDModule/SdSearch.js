//SdSearch.js

/******************************************************************************
 * SD Search Definition
 ******************************************************************************/
console.log('SDSearch up');
var lineReader = require('line-reader');
var fs = require('fs');

var __filePathToUse = "";
var __sdFilepath = "/media/sdcard/"
var __defaultFile = "/media/sdcard/UUID_Strings.txt";
__setFileName();

var foundType = "none"; 
exports.foundType = foundType;

//main search function
exports.searchForTicketString = function (stringToFind, typeToSearch){
	var foundFlag = false;
  lineReader.eachLine(__filePathToUse, function(line, last) {
    var lengthString = line.length
    var commaIndex1 = line.indexOf(',');
    var commaIndex2 = line.indexOf(',', commaIndex1+1);
    if (foundFlag == false){
      if (typeToSearch == 1){
        __searchByTicketUUID(line, commaIndex1, commaIndex2, stringToFind);
      }
      else if (typeToSearch == 2){
        __searchByTicketName(line, commaIndex1, commaIndex2, stringToFind);
      }
      /*  --really no need for this implementation (search by type)... doesn't really serve a purpose
      //  but I'll leave it in case someone wants the base logic. See __searchByTicketType() if you want.
      else if (typeToSearch == 3){
        __searchByTicketType(line, commaIndex2, lengthString, stringToFind)
      }
      */
      else{
        console.log('unacceptable search type');
      }
      if(last){
        if (foundFlag == false){
          console.log('no match found');
          exports.foundType = "noTicket"
          setTimeout(__resetFoundType, 500);
        }
        else {
          foundFlag = false;
        }
      }
    }
  });
}


//a brief check to the ticket type to give the correct kind of response
function __TypeLogic (TicketTypeRetrieve){
  console.log(TicketTypeRetrieve);
  if (TicketTypeRetrieve == "VIP"){
    exports.foundType = "VIP";
    setTimeout(__resetFoundType, 500);
  }
  else if (TicketTypeRetrieve == "General"){
     exports.foundType = "GEN";
     setTimeout(__resetFoundType, 500);
  }
  else if (TicketTypeRetrieve == "Void") {
    exports.foundType = "VOI";
    setTimeout(__resetFoundType, 500);
  }
  else {
    console.log ("unacceptable ticket type")
    exports.foundType = "noTicket";
    setTimeout(__resetFoundType, 500);
  }
}

function __setFileName(){
  var arguments = process.argv;
  var actualArguments = arguments.slice(2);
  if (actualArguments[0] != undefined){
    __filePathToUse = __sdFilepath+actualArguments[0];
    console.log(__filePathToUse);
  }
  else {
    console.log("no extra arguments supplied--filename set to default")
    __filePathToUse = __defaultFile;
    console.log(__filePathToUse);
  }
}

function __resetFoundType (){
  exports.foundType = "none"
}

function __searchByTicketUUID(line, commaIndex1, commaIndex2, stringToFind){
  var TicketNumberRetrieve = line.substring (0, commaIndex1);
  console.log(TicketNumberRetrieve);
  if (stringToFind == TicketNumberRetrieve){
    foundFlag = true;
    var TicketTypeRetrieve = line.substring (commaIndex2+1, lengthString-1);
    __TypeLogic(TicketTypeRetrieve)
  }
}

function __searchByTicketName(line, commaIndex1, commaIndex2, stringToFind){
  var TicketNameRetrieve = line.substring (commaIndex1+1, commaIndex2);
  console.log(TicketNameRetrieve);
  if (stringToFind == TicketNameRetrieve){
    foundFlag = true;
    if (stringToFind == TicketNumberRetrieve){
      var TicketTypeRetrieve = line.substring (commaIndex2+1, lengthString-1);
      __TypeLogic(TicketTypeRetrieve)
    }
  }
}
/*
function __searchByTicketType(line, commaIndex2, lengthString, stringToFind){
  var TicketTypeRetrieve = line.substring (commaIndex2+1, lengthString);
        console.log(TicketTypeRetrieve);
        if (stringToFind == TicketTypeRetrieve){
          foundFlag = true;
          __TypeLogic(TicketTypeRetrieve);
        }
}
*/ //depreciated method