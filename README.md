# Beacon
###An implementation of iBeacon technology to take ticket information, verify that the information exists in a database and display the result--Updated from Tfly_Beacon

I'll break this down by file. If there are any questions/issues, feel free to drop me a line. See specific folders for their individual documentations.

##BeaconMachineManager
The highest up in the file heirarchy of the program. This is where the magic happens. It initiates, manages and listens to all of the different processes (indicators, bluetooth, ultrasonic, etc.) depending on the state of the machine. A more thorough documentation is below.

#### A brief rundown of the states, events and functions (anonymous and not) of BeaconMachineManager
For the sake of berevity I have only written about the event and state changes where I have implemented something--There are *many* more event/state changes that can be utilized within the state machine module. I have coded most of them in, but they remain empty at this point because I had no need for them

#####States
The different states that the machine can be in

|State Name     |Description   | Note    |
|---------------|--------------|---------|
|none  |Initial state of the machine before being initialized |Cannot be returned to after starting the machine  |
|init  |The beacon initializes itself and all of its peripherals | Cannot be returned to after starting the machine  |
|default  |The manager monitors the bluetooth for a received ticket-string, it also monitors the ultrasonic for a deviation  |N/A  | 
|checkingDatabase  |Checks the SD card database for a ticket-string found in the default state  |N/A  | 
|admitVIP  |Displays the VIP admit indicators and returns to default  |N/A   | 
|admitGEN  |Displays the admit indicators and returns to default  |N/A   |  
|noAdmitVOI  |Displays the no admit-Void indicators and returns to default  |N/A   | 
|noAdmit  |Displays the no admit indicators and returns to default  |N/A   | 


##### Events
The events that cause state changes in the machine. An event can be triggered by calling `BeaconManager.EVENT()` anywhere in the program.

|Event Name     |Description   | Note    |
|---------------|--------------|---------|
|start  |moves the machine from the `none` state to the `init` state  |N/A  |  
|beginDefault  |moves the machine from the `init` state to the `default` state  |N/A  | 
|toCheckDatabase  |moves the machine from the `default` state to the `checkingDatabase` state  |N/A  | 
|toAdmitGeneral  |moves the machine from the `checkingDatabase ` state to the `admitGEN` state  |N/A  | 
|returnToDefault  |moves the machine from any of the `admit`/`noAdmit` states to `default`   |N/A  |  
|toAdmitVIP  |moves the machine from the `checkingDatabase ` state to the `admitVIP` state  |N/A  |  
|toNoAdmitVOI  |moves the machine from the `checkingDatabase ` state to the `noAdmitVOI` state  |N/A  |  
|noAdmitNormal  |moves the machine from the `checkingDatabase ` state to the `noAdmit` state  |N/A  |  
|cutToNoAdmit  |moves the machine from the `default` state to the `noAdmit` state  |N/A  |  
|cutToCheckDatabase  |moves the machine from the `noAdmit` state to the `checkingDatabase` state  |N/A  |  

#####Functions (onEVENT or onSTATE)
These functions (with the exception of `__endFlagMarker()` ) are triggered by events or state changes. They are **not** accessable out of this context unless you explicitly redefine the body of these functions later in the code.

|Function Name     |Description   |Arguments      | Returns     | Note    |
|------------------|--------------|---------------|-------------|---------|
|__endFlagMarker()  |Used to mark that the indicators have been on long enough for the noAdmit state and that the manager should return to the default state  |N/A  |N/A  |N/A  |
|ondefault  |Listens for a deviation in the ultrasonic (which then pushes the machine to a noAdmit state), or a new ticket-string from the BLE (which then causes a shift to the checkingDatabase state) using an `async.whilst()` loop.  |N/A  |N/A  |**Cannot be called in the script, as it is an anonymous function** |
|oncheckingDatabase  |Uses an `async.whilst()` loop to listen as the SDSearch function searches the database for a match for the inputted ticket string. If the search is successful, the manager pushes to the appropriate `admit`/`noAdmit` state. If it is not, the manager pushes to the `noAdmit` state. |N/A  |N/A  |**Cannot be called in the script, as it is an anonymous function**   |
|onadmitGEN  |Displays the Admit-General indicators and calls a return to default   |N/A  |N/A  |**Cannot be called in the script, as it is an anonymous function**   |
|onadmitVIP  |Displays the Admit-VIP indicators and calls a return to default   |N/A  |N/A  |**Cannot be called in the script, as it is an anonymous function**   |
|onnoAdmitVOI  |Displays the noAdmit-Void indicators and calls a return to default  |N/A  |N/A  |**Cannot be called in the script, as it is an anonymous function**   |
|onnoAdmit  |Displays the noAdmit indicators and calls a return to default. **Also** listens for a received ticket from the BLE and transfers to the checkingDatabase state if one is found--Basically allows for an interrupt of this state if accidentally triggered by the ultrasonic even if the person has a ticket  |N/A  |N/A  |**Cannot be called in the script, as it is an anonymous function**   |
|onleaveadmitGEN  |Displays the ticketfly logo and returns to default  |N/A  |N/A  |**Cannot be called in the script, as it is an anonymous function**   |
|onleaveadmitVIP  |Displays the ticketfly logo and returns to default   |N/A  |N/A  |**Cannot be called in the script, as it is an anonymous function**   |
|onleavenoAdmitVOI |Displays the ticketfly logo and returns to default  |N/A |N/A |**Cannot be called in the script, as it is an anonymous function**  |
|onleavenoAdmit |Displays the ticketfly logo and returns to default  |N/A |N/A |**Cannot be called in the script, as it is an anonymous function**  |

See [javascript-state-machine](https://github.com/jakesgordon/javascript-state-machine) for more information on how states and events work in the machine. 

##executiveShellCommands.js
A module that resets all the bluetooth daemons before allowing the program to continue.

|Function Name     |Description   |Arguments      | Returns     | Note    |
|------------------|--------------|---------------|-------------|---------|
|clearBluetoothCache()|Removes all bluetooth daemons| N/A|N/A|N/A|
|nextCommand()|Reconfigures the bluetooth socket and the bluetooth daemon|N/A|N/A|N/A|

##BLEandBeacon.js
A module that manages the creation and broadcast of bluetooth services. I will briefly cover all of my added functions. I will not cover the beacon callbacks here, or any built in functions. For information on those, see [bleno](https://github.com/sandeepmistry/bleno).

|Function Name     |Description   |Arguments      | Returns     | Note    |
|------------------|--------------|---------------|-------------|---------|
| __startAdvertisingIbeacon() |Begins broadcasting a beacon data packet and sets a timeout to switch to `__startAdvertisingBle()` |N/A |N/A |N/A | 
| __stopAdvertisingIbeacon() |Stops the iBeacon broadcast  |N/A |N/A |N/A | 
| __startAdvertisingBle() |Begins broadcasting a regular BLE data packet and sets a timeout to switch to `__startAdvertisingIbeacon()`  |N/A |N/A |N/A |  
| __stopAdvertisingBle() |Stops the BLE broadcast |N/A |N/A |N/A |  
| beginBroadcasting()|Initializes the entire beacon and begins the alteration between iBeacon and BLE | N/A |N/A |N/A | 
| resetDataString() |Periodically resets the exported dataString so that the BeaconManager isn’t triggered to switch states without a new ticket-string being found | N/A |N/A |N/A |  


##Images
The necessary images for the OledDisplay module

##node_modules
* **[bleno](https://github.com/sandeepmistry/bleno)**:
  The javascript beacon API
* **[line-reader](https://github.com/nickewing/line-reader)**:
  As it sounds, used in SdSearch to 
* **[png-to-lcd](https://github.com/noopkat/png-to-lcd)**:
  Used to convert png images to lcd compatible bitmaps
* **[replace](https://github.com/harthur/replace)**:
  Used to aid the unimplemented SDReplaceFunction
* **[segfault-handler](https://github.com/ddopson/node-segfault-handler)**:
  Used to catch and manage unexpected segfaults
* **[exec](https://github.com/bahamas10/node-exec)**:
  Used to execute shell commands from within the script
* **[javascript-state-machine](https://github.com/jakesgordon/javascript-state-machine)**:
  State machine--overall controller for state changes
* **[libmraa](https://github.com/intel-iot-devkit/mraa)**:
  Standard bindings for the microcontroller’s SPI and I2C busses

#Future suggestions
See the issues section

#Relevant Documentation 
Maxsonar EZ: http://www.maxbotix.com/documents/HRLV-MaxSonar-EZ_Datasheet.pdf
