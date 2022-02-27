class ArenaScene extends Phaser.Scene {
	
	constructor (config)
	{
		super(config);
		this.player;
		this.player_init = false;
		this.camera_object;
		
		this.tileset;
		this.map;
		this.platforms_layer;
	}


	preload() {
		this.load.image('player', './public/img/player.png');
		this.load.image('enemy', './public/img/player.png');
		this.load.image('box', './public/img/box.png');
		this.load.image('gun', './public/img/gun.png');
		this.load.image('debug_area_sprite_sheet', './public/img/DebugMapSpriteSheet.png');
		this.load.tilemapTiledJSON('warehouse', './public/tiles/warehouse.json' );
	}

	
	create(data) {
		this.createMap();
		this.camera_object = new CameraObject(this, window_width/2, window_height/2)

		this.io = io(); //initializing a new io server
		var self = this; //because we have an event handler
		this.enemies = this.physics.add.group();
		this.io.on('actualPlayers', function(players) {
			Object.keys(players).forEach(function (id) { //looping through the players
				if (players[id].player_id == self.io.id) {
					//we are in the array
					self.createPlayer(self, players[id].x, players[id].y);
					self.physics.add.collider(self.player, self.platforms_layer);

				}else {
					// we are creating other players
					self.createEnemy(self, players[id]);
				}

			});
		});

		self = this;
		this.io.on('new_player', function (pInfo) { //we?re sending info about the new player from the server. So, we accept the info by pInfo
			self.createEnemy(self, pInfo);
		});

		this.io.on('player_disconnect', function (p_id) { //we're sending info about the new player from the server. So, we accept the info by pInfo
			var disconnected_player = self.enemies.getMatching( 'id', p_id )[0];
			disconnected_player.destroy();
		});

		//synchronizing enemy movement
		let enemies_ref = this.enemies; //holds the reference to the enemy's group
		this.io.on('enemy_moved', function(player_data) {
			enemies_ref.getChildren().forEach(function(enemy) {
				if (player_data.player_id == enemy.id) { //set a new position for the enemy because the player data and enemy id in the enemy's group match together
					enemy.setWantedPosition(player_data.x, player_data.y);
				}
			});
		});
	}


	update(time, delta) {
		if (this.player_init == true) {
			this.player.update();
		}

		this.camera_object.update();

		this.enemies.getChildren().forEach(function(enemy) {
			enemy.update(delta);
		});
	}


	// createMap: None -> None
	// creates the map to play on
	createMap() {
		this.map = this.make.tilemap({ key: 'warehouse' });
		this.tileset = this.map.addTilesetImage('warehouse_v2', 'debug_area_sprite_sheet');

		this.platforms_layer = this.map.createLayer('platforms', this.tileset);
		this.platforms_layer.setScale(2);
		this.platforms_layer.setCollisionByProperty({ collision: true });

		/*const debugGraphics = this.add.graphics().setAlpha(0.75);
		this.platforms_layer.renderDebug(debugGraphics, {
			tileColor: null, // Color of non-colliding tiles
			collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
			faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
		});
		*/

		this.platforms_layer.layer.data.forEach((tiles) => {
			tiles.forEach((tile) => {
				if( tile.properties.one_way_platform ) {
					tile.collideDown = false;
					tile.collideLeft = false;
					tile.collideRight = false;
				}
			})
		})
	}


	// createPlayer: Phaser.Scene, num, num -> None
	// creates the user's player and initializes it
	createPlayer(scene, x, y) {
		//creating the player on the scene i.e making the new players visible
		scene.player_init = true;
		scene.player = new Player(scene, x, y);
	}


	// createEnemy: Phaser.Scene, dict -> None
	// creates an enemy given the info and adds it to the enemies group
	createEnemy(scene, enemy_info) {
		const enemy = new Enemy(scene, enemy_info.x, enemy_info.y, enemy_info.player_id);
		scene.enemies.add(enemy);
	}


	// getPlayers: None -> list(Phaser.Physics.Arcade.Sprite)
	// gets the player list
	getPlayers() {
		let player_list = [];
		if( this.player ) player_list.push(this.player);

		let enemies = this.enemies.getChildren();
		for( var i = 0; i < enemies.length; i++ )
			player_list.push(enemies[i])

		return player_list;
	}
}