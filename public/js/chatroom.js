function updateScroll() {
	var element = document.getElementById("messages");
	element.scrollTop = element.scrollHeight + 20;
}

var socket = io();
$('form').submit(function() {
	socket.emit('chat message', $('#send').val());
	$('#send').val('');
	return false;
});
socket.on('new sender', function(sender) {
	$('#messages').append($('<p>').text(sender));
});
socket.on('chat message', function(msg) {
	$('#messages').append($('<li>').text(msg));
	$('#messages').append($('<br />'));
    updateScroll();	
});
