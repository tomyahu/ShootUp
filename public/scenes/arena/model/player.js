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
		
		// holds scene
		this.scene = scene;
		this.setInteractive();
		self = this;
		
		// input handlers
		this.keyLeft = scene.input.keyboard.addKey('A');
		this.keyRight = scene.input.keyboard.addKey('D');
		this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		this.old_x = this.x;
		this.old_y = this.y;

		this.setSize(20, 40);
		this.setOffset(20, 25);

		this.gun = new PlayerGunContainer(scene, this);

		scene.add.existing(this.gun);
	}

	update() {
		this.updatePlayerMovement();
		this.broadcastPlayerMovement();
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


	// broadcastPlayerMovement: None -> None
	// broadcasts the current position of the player to the server
	broadcastPlayerMovement() {
		// send socket to server
		this.scene.io.emit('player_moved', {x: this.x, y: this.y}); //the object contains the movement data
		//assigning new movement data after the player has moved
	}


	// getters
	getGunPosition() {
		return {
			x: this.x,
			y: this.y
		};
	}

}