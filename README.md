# Beacon
###An implementation of iBeacon technology to take ticket information, verify that the information exists in a database and display the result

I'll break this down by file. If there are any questions/issues, feel free to drop me a line.

##iBeaconWrite_V2_7.js
The highest up in the file heirarchy of the program. This is where the magic happens. This portion has three main tasks:
1. Performing two shell commands that reset the bluetooth daemon of the Edison
2. Beginning the intialiazation of the rest of the files in the heirarchy
3. Initalizing and managing the iBeacon and BLE services and events of the beacon

##LedsAndBuzzer.js
Pretty simply manages the initialization and manipulation of the LEDs and the buzzer
#####Buzzer Functions
| Function Name      | Description                                            | Arguments | Returns | Note                                                                                                                                                                                                                                                                                                                                                                  |
|--------------------|--------------------------------------------------------|-----------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| buzzAdmitNote1()   | Starts playing the first note of the admit sequence    | N/A       | N/A     | Cannot be called outside the LedsAndBuzzer.js file                                                                                                                                                                                                                                                                                                                                                                   |
| buzzAdmitNote2()   | Starts playing the second note of the admit sequence   | N/A       | N/A     | Cannot be called outside the LedsAndBuzzer.js file                                                                                                                                                                                                                                                                                                                                                                   |
| buzzNoAdmitNote1() | Starts playing the first note of the no admit sequence | N/A       | N/A     | Cannot be called outside the LedsAndBuzzer.js file                                                                                                                                                                                                                                                                                                                                                                   |
| stopBuzz()         | Stop playing the note                                  | N/A       | N/A     | Cannot be called outside the LedsAndBuzzer.js file                                                                                                                                                                                                                                                                                                                                                                   |
| endBuzz()          | Disable the pin from sending a PWM pulse to the buzzer | N/A       | N/A     | Differs slightly in that this function completely disables the pin from sending a pulse and the previous only stops the current pulse. These are called one after another in order to correct javascript's asynchronous behavior and to try to help the Edison regulate it's pulses (which, because it lacks an onboard hardware timer, it regularly struggles with). Cannot be called outside the LedsAndBuzzer.js file|
| buzzAdmit()        | Makes the buzzer buzz the admit sequence               | N/A       | N/A     | Occasionally fails to play the first note of the sequence--Not sure why yet                                                                                                                                                                                                                                                                                           |
| buzzNoAdmit()      | Makes the buzzer buzz the no admit sequence            | N/A       | N/A     | N/A                                                                                                                                                                                                                                                                                                                                                                   |
#### LED functions
| Function Name      | Description                                    | Arguments | Returns | Note                                               |
|--------------------|------------------------------------------------|-----------|---------|----------------------------------------------------|
| ledFlashAdmit()    | Flashes the green admit LED on for one second  | N/A       | N/A     | N/A                                                |
| ledFlashNoAdmit()  | Flashes the red no admit LED on for one second | N/A       | N/A     | N/A                                                |
| ledIndicatorsOff() | Turns off the LED after a second               | N/A       | N/A     | Cannot be called outside the LedsAndBuzzer.js file |


--One of the more major issues we arrive at here is the lack of ability of the Edison to control its PWM pulses, which results in inconsistent sounds and occasional failure to fully turn off the buzzer, resulting in a high pitched beep that can only be reset by sending a subsequent pulse.

##OledDisplay.js
An upper level manager of the OLED driver--controls deconstructing and passing images to the driver

| Function Name            | Description                                                                           | Arguments | Returns | Note                                          |
|--------------------------|---------------------------------------------------------------------------------------|-----------|---------|-----------------------------------------------|
| beginOled()              | Initializes the I2C bus for the OLED screen (see /Node_Indicators/Edison.js for more) | N/A       | N/A     | N/A                                           |
| __startOled()            | Initializes the OLED screen, clears it, and then displays the Ticketfly logo          | N/A       | N/A     | Only available inside the OledDisplay.js file |
| displayTicketflyLogo()   | Displays the Ticketfly Logo                                                           | N/A       | N/A     | N/A                                           |
| __displayTicketflyLogo() | A private version of the above function                                               | N/A       | N/A     | Only available inside the OledDisplay.js file |
| displayAdmit()           | Displays admit on the OLED screen                                                     | N/A       | N/A     | N/A                                           |
| displayNoAdmit()         | Displays no admit on the OLED screen                                                  | N/A       | N/A     | N/A                                           |
| clearOLEDScreen()        | Clears the buffer of the OLED screen                                                  | N/A       | N/A     | N/A                                           |
| __clearOLEDScreen()      | A private version of the above function                                               | N/A       | N/A     | N/A                                           |
| displayNoAdmitVoid()     | Displays the message "please check ticket"                                            | N/A       | N/A     | N/A                                           |
| displayAdmitVIP()        | Displays the message "Admit VIP"                                                      | N/A       | N/A     | N/A                                           |

##SDReplaceFunction.js
An unimplemented function for the SdSearch module

| Function Name            | Description                                               | Arguments                                                                                                                                                   | Returns | Note |
|--------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|------|
| changeTicketStatusVoid() | Changes the status of the selected ticket line to "Void"  | line: the ticket line from the file being read TicketTypeRetrieve: the ticket type of the ticket you found filePath: the path to the ticket containing file | N/A     |      |

##SdSearch.js
Manages the search of the SD card for a specific ticket string. Also manages the upper level ultrasonic tasks as we want to stop taking measurements for a period of time if a 

####SD functions
| Function Name            | Description                                                                                                                                                 | Arguments                                                                                                                                                                        | Returns | Note                                                                                                                                                                             |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| searchForTicketString()  | Searches the selected file for the input search string and uses the __TypeLogic() function to display the proper system reaction if a ticket match is found | *stringToFind*: the string received by the BLE beacon to be searched in the database *typeToSearch*: the type of input string, either (1) ticket UUID, or (2) ticket holder name | N/A     | N/A                                                                                                                                                                              |
| __successfulSearch()     | Displays the admit signals if a search is successful                                                                                                        | N/A                                                                                                                                                                              | N/A     | Cannot be called outside the SDSearch.js file                                                                                                                                    |
| __successfulSearchVIP()  | Displays the VIP specific admit signals if a search is successful                                                                                           | N/A                                                                                                                                                                              | N/A     | Cannot be called outside the SDSearch.js file                                                                                                                                    |
| __successfulSearchVoid() | Displays the Void specific admit signals if a search is successful                                                                                          | N/A                                                                                                                                                                              | N/A     | Cannot be called outside the SDSearch.js file                                                                                                                                    |
| __TypeLogic()            | Performs type logic to determine what kind of successful search response to throw if a ticket UUID/name is a match                                          | N/A                                                                                                                                                                              | N/A     | Cannot be called outside the SDSearch.js file                                                                                                                                    |
| __fileName()             | Reassigns the name of the file to be searched based off of the arguments from the command line                                                              | N/A                                                                                                                                                                              | N/A     | When beginning the program, add a third argument to the command line call, i.e. `node iBeaconWrite_V2_7.js yourTicketdatabase.txt` Cannot be called outside the SDSearch.js file |

##UltrasonicSensor.js
Controls and sets up reading the ultrasonic. 

| Function Name          | Description                                                                                                                                                                                                                                                         | Arguments | Returns | Note |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|---------|------|
| initUltrasonic()       | Initiate the voltage reading pin to read from the ultrasonic (US).                                                                                                                                                                                                  | N/A       | N/A     | N/A  |
| takeUSReading()        | Calibrates the US on startup. Then takes readings from the US and heavily filters the data to avoid large deviations in US readings. Displays a no admit if a consistent deviation less than the calibrated value of the sensor is detected and set a flag to true. | N/A       | N/A     |      |
| __resetIndicatorFlag() | Reset the indicator flag to true in order to display no admit again if another deviation is detected.                                                                                                                                                               | N/A       | N/A     | N/A  |

## UUID_Strings.txt
An example file of the structures necessary to read ticket strings with the SdSearch module

##Images
The necessary images for the OledDisplay module

##Node_Indicators
The OLED driver and bindings

##node_modules
* **Bleno**:
  The javascript beacon API
* **line-reader**:
  As it sounds, used in SdSearch to 
* **png-to-lcd**:
  Used to convert png images to lcd compatible bitmaps
* **replace**:
  Used to aid the unimplemented SDReplaceFunction
* **segfault-handler**:
  Used to catch and manage unexpected segfaults
* **exec**:
  Used to execute shell commands from within the script
* **machina**:
  State machine--overall controller for state changes


#Future suggestions
See the issues section


#Relevant Documentation 

Maxsonar EZ: http://www.maxbotix.com/documents/HRLV-MaxSonar-EZ_Datasheet.pdf
