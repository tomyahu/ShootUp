//storing height and width of the client?s browser
var window_height = 960;
var window_width = 1280;

//since we?re using a phaser, we have to create a variable that holds the config data for the phaser.
var config = {
	type: Phaser.AUTO,
	width: window_width,
	height: window_height,
	backgroundColor: '#000000',
	parent: 'game',

	//this object will hold configuration for arcade physics
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y: 0,
			},
			//this means it will not cross 60
			fps: 60,
			debug: false,
		}
	},
	scene: [ ArenaScene ]
}

// holds a game instance
var game = new Phaser.Game(config);
var player;
var player_init = false;
var platform;