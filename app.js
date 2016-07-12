var port = 8081;
var http = require('http');
var express = require('express');
var path = require('path');

var app = express();
var chance = require('chance').Chance();

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

app.use(express.static(path.join(__dirname + '/public')));

var server = http.createServer(app);
var io = require('socket.io')(server);

var prevSender = "";

io.on('connection', function(socket) {
    var id = socket.id;
	var username = chance.word();
	console.log('connection: ', id);
	socket.on('chat message', function(msg) {
		var message = "" + msg;
		if (message.charAt(0) == '/') {
			username = message.slice(1);
		} else {
			if (prevSender != username) {
				prevSender = username;
				io.emit('new sender', username.capitalize());
				console.log('new sender registered: ', username.capitalize(), ": ", id);
			}
			io.emit('chat message', msg);	
		}
	});
	
});

server.listen(port, function() {
    console.log('listening on *:' + port);
});
