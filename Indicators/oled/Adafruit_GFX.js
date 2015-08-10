/*
This is the core graphics library for all our displays, providing a common
set of graphics primitives (points, lines, circles, etc.).  It needs to be
paired with a hardware-specific library for each display device we carry
(to handle the lower-level functions).

Adafruit invests time and resources providing this open source code, please
support Adafruit & open-source hardware by purchasing products from Adafruit!
 
Copyright (c) 2013 Adafruit Industries.  All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

- Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
*/

var font = require('./glcdfont.js');

var Adafruit_GFX = function(width, height){
  var that = this;
  var _width    = width;
  var _height   = height;
  var rotation  = 0;
  var cursor_y  = cursor_x    = 0;
  var textsize  = 1;
  var textcolor = textbgcolor = 0xFFFF;
  var wrap      = true;

Adafruit_GFX.prototype.write = function(c) {
  if (c == '\n') {
    cursor_y += textsize*8;
    cursor_x  = 0;
  } else if (c == '\r') {
    // skip em
  } else {
    this.drawChar(cursor_x, cursor_y, c, textcolor, textbgcolor, textsize);
    cursor_x += textsize*6;
    if (wrap && (cursor_x > (_width - textsize*6))) {
      cursor_y += textsize*8;
      cursor_x = 0;
    }
  }
};

// Draw a character
Adafruit_GFX.prototype.drawChar = function(x, y, c, color, bg, size) {

  if((x >= _width)            || // Clip right
     (y >= _height)           || // Clip bottom
     ((x + 6 * size - 1) < 0) || // Clip left
     ((y + 8 * size - 1) < 0))   // Clip top
    return;

  for (var i=0; i<6; i++ ) {
    var line;
    if (i == 5) 
      line = 0x0;
    else 
      line = pgm_read_byte(font+(c*5)+i);
    for (var j = 0; j<8; j++) {
      if (line & 0x1) {
        if (size == 1) // default size
          this.drawPixel(x+i, y+j, color);
        else {  // big size
          this.fillRect(x+(i*size), y+(j*size), size, size, color);
        } 
      } else if (bg != color) {
        if (size == 1) // default size
          this.drawPixel(x+i, y+j, bg);
        else {  // big size
          this.fillRect(x+i*size, y+j*size, size, size, bg);
        }
      }
      line = (line >> 1);//line >>= 1;
    }
  }
};

Adafruit_GFX.prototype.setCursor = function(x, y) {
  cursor_x = x;
  cursor_y = y;
};

Adafruit_GFX.prototype.setTextSize = function(s) {
  textsize = (s > 0) ? s : 1;
};

Adafruit_GFX.prototype.setTextColor = function(c) {
  // For 'transparent' background, we'll set the bg 
  // to the same as fg instead of using a flag
  textcolor = textbgcolor = c;
};

Adafruit_GFX.prototype.setTextColor = function(c, b) {
  textcolor   = c;
  textbgcolor = b; 
};

Adafruit_GFX.prototype.setTextWrap = function(w) {
  wrap = w;
};

Adafruit_GFX.prototype.getRotation = function() {
  return rotation;
};

Adafruit_GFX.prototype.setRotation = function(x) {
  rotation = (x & 3);
  switch(rotation) {
   case 0:
   case 2:
    _width  = WIDTH;
    _height = HEIGHT;
    break;
   case 1:
   case 3:
    _width  = HEIGHT;
    _height = WIDTH;
    break;
  }
};

// Return the size of the display (per current rotation)
Adafruit_GFX.prototype.width = function() {
  return _width;
};
 
Adafruit_GFX.prototype.height = function() {
  return _height;
};

Adafruit_GFX.prototype.invertDisplay = function(i) {
  // Do nothing, must be subclassed if supported
};
};
module.exports = Adafruit_GFX;