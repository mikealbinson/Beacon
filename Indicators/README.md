#Indicators
Manages the initialization and manipulation of the LEDs and the buzzer--all exported functions come through the **Indicators.js** file, all the other files support the module

##Indicators

|Function Name | Description    | Arguments | Returns | Note|
|--------------|----------------|-----------|---------|-----|
| defaultTicketflyLogo()|Displays the Ticketfly Logo |N/A |N/A |Currently doesn’t work on startup of the machine—may be because the OLED has not yet fully init-ed |
|AdmitVIP()|Displays the admit-VIP indicators (LED, buzzer, OLED) |N/A |N/A |N/A |
| AdmitGeneral()|Displays the admit-General indicators |N/A |N/A |N/A |
|NoAdmit() |Displays the noAdmit-General indicators |N/A |N/A |N/A |
|NoAdmitVoid() |Displays the noAdmit-Void indicators |N/A |N/A |N/A |
|killAllNoAdmitIndicators() |clears all noAdmit indicators |N/A |N/A |Used in the case of the noAdmit->checkingDatabase interrupt |

##LedsAndBuzzer.js
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
