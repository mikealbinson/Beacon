# Beacon
###An implementation of iBeacon technology to take ticket information, verify that the information exists in a database and display the result--Updated from Tfly_Beacon

I'll break this down by file. If there are any questions/issues, feel free to drop me a line.

##BeaconMachineManager
The highest up in the file heirarchy of the program. This is where the magic happens. It initiates, manages and listens to all of the different processes (indicators, bluetooth, ultrasonic, etc.) depending on the state of the machine. A more thorough documentation frill follow.

##Images
The necessary images for the OledDisplay module

##Indicators
Oled, LED and buzzer control functions. See the directory for its specific README

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
* **javascript-state-machine**:
  State machine--overall controller for state changes

#Future suggestions
See the issues section

#Relevant Documentation 
Maxsonar EZ: http://www.maxbotix.com/documents/HRLV-MaxSonar-EZ_Datasheet.pdf
