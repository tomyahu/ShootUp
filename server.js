// loading all dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

//setting the port
var port = 8081;

//initializing framework
var players = {};

// instancing
var app = express(); //default constructor
var server = http.Server(app); //to launch Express
var io = socketIO(server); //passing ?server? so that it runs on IO server
app.set('port', port);


//used ?public? folder to use external CSS and JS
app.use('/public', express.static(__dirname + "/public"));

//port listening
server.listen(port, function() {
	console.log("listening...");
});

//handling requests and responses by setting the Express framework
app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "landing.html"));
});
io.on('connection', function (socket) { //returns socket which is a piece of data that talks with server and client
	console.log("someone has connected");
	players[socket.id] = {
		player_id: socket.id,
		x: 500,
		y: 500
	};
	socket.emit('actualPlayers', players); //sends info back to that socket and not to all the other sockets
	socket.broadcast.emit('new_player', players[socket.id]);

	// when player moves send data to others
	socket.on('player_moved', function(movement_data) {
		players[socket.id].x = movement_data.x;
		players[socket.id].y = movement_data.y;

		socket.broadcast.emit('enemy_moved', players[socket.id]);
	});

	//synchronizing shooting
	socket.on('disconnect', function () {
		console.log("someone has disconnected");
		delete players[socket.id];
		socket.broadcast.emit('player_disconnect', socket.id);
	});
});