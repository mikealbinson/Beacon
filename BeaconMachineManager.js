//BeaconMachineManager.js

var StateMachine = require('javascript-state-machine');

var ticketStringHolder = "";
var ticketTypeHolder = "";
var transitionFlag = false;
var transitionFunction;
var checkerStateFunction = "none";
var toSearchDatabaseSwitchFlag = false;
var __endNoAdmitFlag = false;
var __noAdmitToCheckingFlag = false;

/****************
* Import Modules
****************/
var async = require('async');
var commands = require('./executiveShellCommands.js')
var indicators = require('./Indicators/Indicators.js');
var ultrasonic = require('./Ultrasonic/Ultrasonic.js');
var SDSearcher = require('./SDModule/SdSearch.js');
var bleAndIbeacon = require('./BLEandBeacon.js');


//Immediately execute the shell commands
commands.clearBluetoothCache();


var BeaconManager = StateMachine.create({

	/*******************************************************************
    * event and state definitions
    * ---All states are stipulated in the 'from' and 'to' properties
    * ---All events are the 'name' properties
    *******************************************************************/
  events: [
    { name: 'start', from: 'none', to: 'init'},
    { name: 'beginDefault', from: 'init', to: 'default'},
    //To checkDatabase
    { name: 'toCheckDatabase', from: 'default', to: 'checkingDatabase'},
    //To generalAdmit
    { name: 'toAdmitGeneral', from: 'checkingDatabase', to: 'admitGEN'},
    { name: 'returnToDefault', from: 'admitGEN',    to: 'default'},
    //To admitVIP
    { name: 'toAdmitVIP', from: 'checkingDatabase', to: 'admitVIP'},
    { name: 'returnToDefault', from: 'admitVIP', to: 'default'},
    //To noAdmitVOI
    { name: 'toNoAdmitVOI', from: 'checkingDatabase', to: 'noAdmitVOI'},
    { name: 'returnToDefault', from: 'noAdmitVOI', to: 'default'},
    //To noAdmit
    { name: 'noAdmitNormal', from: 'checkingDatabase', to: 'noAdmit'},
    { name: 'returnToDefault', from: 'noAdmit', to: 'default'},
    //US trigger to Noadmit
    { name: 'cutToNoAdmit', from: 'default', to: 'noAdmit'},
    //trig from noadmit to admit--allowed
    { name: 'cutToCheckDatabase', from: 'noAdmit', to: 'checkingDatabase'},
  ],

  //initialstate: "none",

  callbacks: {
    onbeforeinit: function(event, from, to) { 
      console.log("starting machine"); 
    },

    oninit: function(event, from, to) { 
      console.log("And so it begins");
	  indicators.defaultTicketflyLogo();
	  ultrasonic.startUsingUltrasonic();
	  bleAndIbeacon.beginBroadcasting();
	  checkerStateFunction = "none";
	  BeaconManager.beginDefault();
    },

    /*******************************************************************
    * onbeforeEvent callbacks
    *******************************************************************/
    onbeforereturnToDefault:  function(event, from, to) { 
      console.log("START DEFAULT: ToDefault!"); 
    },
    onbeforetoAdmitGeneral: function(event, from, to) { 
      console.log("START EVENT: AdmitGEN!");  
    },
    onbeforetoAdmitVIP: function(event, from, to) { 
      console.log("START EVENT: AdmitVIP!");  
    },
    onbeforetoNoAdmitVOI: function(event, from, to) { 
      console.log("START EVENT: NoAdmitVOI!");  
    },
    onbeforetoNoAdmitNormal: function(event, from, to) { 
      console.log("START EVENT: NoAdmitGen!");  
    },
    onbeforecutToNoAdmitVOI: function(event, from, to) { 
      console.log("START EVENT: US Trig to No Admit!");  
    },
    onbeforecutToAdmit: function(event, from, to) { 
      console.log("START EVENT: cut to admitGEN!");  
    },
    onbeforecutToAdmitVIP: function(event, from, to) { 
      console.log("START EVENT: cut to admitVIP!");  
    },
    onbeforebeginDefault: function (event, from, to) { 
      console.log("START EVENT: beginDefault!");  
    },
    /*******************************************************************
    * onafterEvent callbacks
    *******************************************************************/
    onreturnToDefault:  function(event, from, to) { 
      console.log("END EVENT: ToDefault!");  
    },
    ontoAdmitGeneral: function(event, from, to) { 
      console.log("END EVENT: AdmitGEN!");  
    },
    ontoAdmitVIP: function(event, from, to) { 
      console.log("END EVENT: AdmitVIP!");  
    },
    ontoNoAdmitVOI: function(event, from, to) { 
      console.log("END EVENT: NoAdmitVOI!");  
    },
    ontoNoAdmitNormal: function(event, from, to) { 
      console.log("END EVENT: NoAdmitGen!");  
    },
    oncutToNoAdmitVOI: function(event, from, to) { 
      console.log("END EVENT: US Trig to No Admit!");  
    },
    oncutToAdmit: function(event, from, to) { 
      console.log("END EVENT: cut to admitGEN!");  
    },
    oncutToAdmitVIP: function(event, from, to) { 
      console.log("END EVENT: cut to admitVIP!");  
    },
    onbeginDefault: function (event, from, to) { 
      console.log("END EVENT: beginDefault!");  
    },
    /*******************************************************************
    * onLeaveState callbacks
    *******************************************************************/
    onleavedefault: function(event, from, to) { 
      console.log("LEAVE STATE: default");
    },
    onleavecheckingDatabase: function(event, from, to) { 
      console.log("LEAVE STATE: checkingState");
    },
    onleaveadmitGEN: function(event, from, to) { 
     console.log("LEAVE STATE: admitGEN");
     indicators.defaultTicketflyLogo();
    },
    onleaveadmitVIP: function(event, from, to) { 
     console.log("LEAVE STATE: admitVIP");
     indicators.defaultTicketflyLogo();
    },
    onleavenoAdmitVOI: function(event, from, to) { 
     console.log("LEAVE STATE: noAdmitVOI");
     indicators.defaultTicketflyLogo();
    },
    onleavenoAdmit: function(event, from, to) { 
     console.log("LEAVE STATE: noAdmit");
     indicators.defaultTicketflyLogo();
    },
    /*******************************************************************
    * onEnterState callbacks
    *******************************************************************/
    ondefault: function(event, from, to) { 
      console.log("ENTER STATE: default");  
      			async.whilst(function (){
					if (bleAndIbeacon.dataString != "" && ticketStringHolder != bleAndIbeacon.dataString){
						console.log("leave default");
						ticketStringHolder = bleAndIbeacon.dataString;
						checkerStateFunction = "checkingDatabase";
						return false;
					}
					if (ticketStringHolder == bleAndIbeacon.dataString && bleAndIbeacon.dataString != ""){
						//console.log("repeat ticketstring--don't read again");
					}
					if (ultrasonic.indicatorFlag == true){
						checkerStateFunction = "noAdmit";
						return false;
					}
					else{
						return true;
					}
				},

				function (callback) {
					setTimeout(callback, 3);
				},

				function (err){
					if (checkerStateFunction == "noAdmit"){
						console.log("switched to noAdmit");
						BeaconManager.cutToNoAdmit();
						checkerStateFunction = "none";
					}
					else if (checkerStateFunction == "checkingDatabase"){
						console.log("switched to checkingDatabase");
						BeaconManager.toCheckDatabase();
						checkerStateFunction = "none";
					}
					else {
						console.log("err, checkerStateFunction reads as: " + checkerStateFunction);
					}
				});
    },
    oncheckingDatabase: function(event, from, to) { 
      console.log("ENTER STATE: checkingState");
      SDSearcher.searchForTicketString(ticketStringHolder, 1);
				async.whilst (function (){return SDSearcher.foundType == "none"}, //basically your conditional to eval to true
					function(callback){
						console.log("nope"); //what happens if it is true
						setTimeout(callback, 3);
					},
					function (err){ //what happens when the condition fails
						ticketTypeHolder = SDSearcher.foundType;
						console.log("type: "+ticketTypeHolder);
						switch (ticketTypeHolder){
							case "VIP":
								ticketTypeHolder = "";
								BeaconManager.toAdmitVIP();
								break;

							case "GEN":
								ticketTypeHolder = "";
								BeaconManager.toAdmitGeneral();
								break;

							case "VOI":
								ticketTypeHolder = "";
								BeaconManager.toNoAdmitVOI();
								break;

							case "noTicket": 
								ticketTypeHolder = "";
								BeaconManager.noAdmitNormal();
								break;

							default: 
								ticketTypeHolder = "";
								BeaconManager.noAdmitNormal();
								break;
						}
					}
				);
    },
    onadmitGEN: function(event, from, to) { 
     console.log("ENTER STATE: admitGEN");
     indicators.killAllNoAdmitIndicators();
     indicators.AdmitGeneral();
     setTimeouT(function () {BeaconManager.returnToDefault()}, 5000);
    },
    onadmitVIP: function(event, from, to) { 
     console.log("ENTER STATE: admitVIP");
     indicators.killAllNoAdmitIndicators();
     indicators.AdmitVIP();
     setTimeout(function () {BeaconManager.returnToDefault()}, 5000);
    },
    onnoAdmitVOI: function(event, from, to) { 
     console.log("ENTER STATE: noAdmitVOI");
     indicators.NoAdmitVoid();
     setTimeout(function () {BeaconManager.returnToDefault()}, 1500);
    },
    onnoAdmit: function(event, from, to) { 
    	console.log("ENTER STATE: noAdmit");
     	indicators.NoAdmit();
     	setTimeout(__endFlagMarker, 1500);
     	async.whilst( 
     		function(){
     			if (__endNoAdmitFlag == true && bleAndIbeacon.dataString == ""){
     				return false;
     			}
     			else if (__endNoAdmitFlag == false && bleAndIbeacon.dataString != ""){
     				__noAdmitToCheckingFlag = true;
     				return false;
     			}
     			else {
     				return true;
     			}
     		},

     		function(callback){
     			setTimeout(callback, 3);
     		},

     		function(err){
     			if (__noAdmitToCheckingFlag == true){
     				setTimeout(function (){BeaconManager.cutToCheckDatabase()}, 3);
     				__endNoAdmitFlag = false;
     				__noAdmitToCheckingFlag = false;
     				console.log("everything reset, bounced to check database");
     			}
     			else {
					setTimeout(function (){BeaconManager.returnToDefault()}, 3);
					__endNoAdmitFlag = false;
     				__noAdmitToCheckingFlag = false;
     				console.log("everything reset, bounced to default");
     			}
     		}
     	);
    },

    /*******************************************************************
    * onChangeState callbacks
    *******************************************************************/
    onchangestate: function(event, from, to) { 
      console.log("CHANGED STATE: " + from + " to " + to); 
    }
  }
});

BeaconManager.start(); //init the machine

function __endFlagMarker(){
	__endNoAdmitFlag = true;
}