#oled
The driver for the SSD1306 oled, built on the libmraa. Only the upper level functions to display images are documented. There are not currently implementations for anything but displaying images in .png format.

##OledDisplay.js
An upper level manager of the OLED driver--controls deconstructing and passing images to the driver (it's within the oled directory)

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
