// loading all dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

//setting the port
var port = 8080;

//initializing framework
var players = {};

// instancing
var app = express(); //default constructor
var server = http.Server(app); //to launch Express
var io = socketIO(server); //passing ?server? so that it runs on IO server
app.set('port', port);

const max_hp = 40;
const spawn_points = [
	{x:160, y:192},
	{x:640, y:352},
	{x:928, y:352},
	{x:1664, y:352},
	{x:128, y:544},
	{x:736, y:608},
	{x:1632, y:544},
	{x:192, y:736},
	{x:128, y:928},
	{x:704, y:992},
	{x:1088, y:896},
	{x:1632, y:928},
];

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
	const spawn_point = spawn_points[ Math.floor( Math.random() * ( spawn_points.length - 1 ) ) ];

	players[socket.id] = {
		player_id: socket.id,
		x: spawn_point.x,
		y: spawn_point.y,
		rot: 0.0,
		hp: max_hp
	};
	socket.emit('actualPlayers', players); //sends info back to that socket and not to all the other sockets
	socket.broadcast.emit('new_player', players[socket.id]);

	// when player moves send data to others
	socket.on('player_moved', function(movement_data) {
		if( players[socket.id].hp == 0 ) return;

		players[socket.id].x = movement_data.x;
		players[socket.id].y = movement_data.y;

		socket.broadcast.emit('enemy_moved', players[socket.id]);
	});

	// when player takes damage send data to others
	socket.on('player_took_damage', function(damage_data) {
		if( players[socket.id].hp == 0 ) return;
		players[socket.id].hp = damage_data.new_hp;

		socket.broadcast.emit('enemy_took_damage', players[socket.id]);
	});

	// when player dies
	socket.on('player_died', function() {
		if( players[socket.id].hp == 0 ) return;

		players[socket.id].hp = 0;
		socket.broadcast.emit('enemy_died', players[socket.id]);

		setTimeout( () => {
			const spawn_point = spawn_points[ Math.floor( Math.random() * ( spawn_points.length - 1 ) ) ];
			players[socket.id].x = spawn_point.x;
			players[socket.id].y = spawn_point.y;
			players[socket.id].hp = max_hp;

			socket.emit('respawn', players[socket.id]);
			socket.broadcast.emit('new_player', players[socket.id]);
		}, 3000);
	});

	// on disconnect
	socket.on('disconnect', function () {
		console.log("someone has disconnected");
		delete players[socket.id];
		socket.broadcast.emit('player_disconnect', socket.id);
	});

	// rotate the gun of a player
	socket.on('player_gun_rotated', function (gun_data) {
		if( players[socket.id].hp == 0 ) return;

		players[socket.id].rot = gun_data.rot;
		socket.broadcast.emit('rotate_player_gun', players[socket.id]);
	});


	// add bullets
	socket.on('bullet_shot', function (bullet_data) {
		if( players[socket.id].hp == 0 ) return;

		bullet_data.id = (Math.random() + 1).toString(36).substring(10);

		socket.emit('add_bullet', bullet_data);
		socket.broadcast.emit('add_bullet', bullet_data);
	});

	// delete bullets
	socket.on('bullet_delete', function (bullet_data) {
		socket.broadcast.emit('delete_bullet', bullet_data);
	});


});