class Player extends Phaser.Physics.Arcade.Sprite {

	constructor (scene, x, y) {
		
		// super
		super(scene, x, y, "player");
		
		// render
		scene.add.existing(this);
		
		// physics rendering to move around and shoot with our players
		scene.physics.add.existing(this);
		this.player_speed = 600;
		this.jump_speed = 600;
		this.depth = 5;
		this.setGravityY(1200);
		this.setMaxVelocity(10000, 1000);

		// Parameters
		this.hp = 40;

		// holds scene
		this.scene = scene;
		this.setInteractive();
		
		// input handlers
		this.keyLeft = scene.input.keyboard.addKey('A');
		this.keyRight = scene.input.keyboard.addKey('D');
		this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		this.old_x = this.x;
		this.old_y = this.y;

		this.setSize(20, 40);
		this.setOffset(20, 25);

		// gun
		this.gun = new PlayerGunContainer(scene, this);
		scene.add.existing(this.gun);

		// UI
		this.hp_text = new Phaser.GameObjects.Text(scene, this.x, this.y, this.hp, { align: 'center', fontSize: '1.5em', fontFamily: 'Arial', })
		scene.add.existing(this.hp_text);

		let self = this;
		scene.events.on('postupdate', function(time, delta) {
			self.updatePlayerDataVisualization()
		});
	}

	update() {
		this.updatePlayerMovement();
		if( this.isAlive() ) {
			this.broadcastPlayerMovement();
		}
	}


	// updatePlayerMovement: None -> None
	// updates the player speed and postion and broadcasts it
	updatePlayerMovement() {
		if (this.keyRight.isDown) {
			this.flipX = false;
			this.setVelocityX(this.player_speed);
		
		} else if(this.keyLeft.isDown) {
			this.setVelocityX(this.player_speed * -1);
			this.flipX = true;
		
		} else this.setVelocityX(0);
		
		if (this.keySpace.isDown && this.body.onFloor())
			this.setVelocityY(this.jump_speed * -1);

		this.old_x = this.x;
		this.old_y = this.y;
	}
	

	updatePlayerDataVisualization() {
		const top_left = this.hp_text.getTopLeft();
		const top_right = this.hp_text.getTopRight();

		this.hp_text.setPosition( this.x - (top_right.x - top_left.x) / 2, this.y-32 );
		this.hp_text.setText(this.hp);
	}


	// broadcastPlayerMovement: None -> None
	// broadcasts the current position of the player to the server
	broadcastPlayerMovement() {
		// send socket to server
		this.scene.io.emit('player_moved', {x: this.x, y: this.y}); //the object contains the movement data
		//assigning new movement data after the player has moved
	}


	getDamaged(dmg) {
		this.hp = Math.max( this.hp - dmg, 0 );
		if( this.isAlive() ) {
			this.scene.io.emit('player_took_damage', {new_hp: this.hp});
		} else {
			console.log("mori");
			this.setAlpha(0.5);
			this.gun.getGun().setAlpha(0.5);
			this.scene.io.emit('player_died', {});
		}

	}


	// getters
	getGunPosition() {
		return {
			x: this.x,
			y: this.y
		};
	}


	getHP() {
		return this.hp;
	}


	isAlive() {
		return this.hp > 0;
	}


	// setters
	setHP( new_hp ) {
		this.hp = new_hp;
	}

}