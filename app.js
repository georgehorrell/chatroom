var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var chance = require('chance').Chance();

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

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

http.listen(8081, function() {
	console.log('listening on *:8081');
});
