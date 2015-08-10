var replace = require('replace');

var line = "7eab2192-29bc-11e5-b345-feff819cdc9f,Name,VIP,";

var filePath = '/Users/michael/Downloads/UUID_Strings.txt';

var TicketTypeRetrieve = "VIP";

var lengthString = line.length;
var commaIndex1 = line.indexOf(',');
var commaIndex2 = line.indexOf(',', commaIndex1+1);

function changeTicketStatusVoid (line, TicketTypeRetrieve, filePath){
	var lineout = line.replace(TicketTypeRetrieve, 'Void');
	console.log(lineout);
	replace({
  		regex: line,
  		replacement: lineout,
  		paths: [filePath],
  		recursive: true,
  		silent: true,
	});
	console.log('done');
}

changeTicketStatusVoid(line, TicketTypeRetrieve, filePath);

