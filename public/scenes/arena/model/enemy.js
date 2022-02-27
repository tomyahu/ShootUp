class Enemy extends Phaser.Physics.Arcade.Sprite {

	constructor (scene, x, y, id) {
		// super
		super(scene, x, y, "enemy");
		
		// render
		scene.add.existing(this);
		
		// physics rendering
		scene.physics.add.existing(this);
		this.depth = 5;
		this.id = id;
		this.setCollideWorldBounds(true);

		this.x = x;
		this.y = y;

		this.wanted_pos = {
			x: this.x,
			y: this.y
		}

		this.correction_time = 100.0;
		this.wanted_speed = {
			x: 0,
			y: 0
		}

		this.gun = new GunContainer(scene, this);
		scene.add.existing(this.gun);
	}


	update( delta ) {
		this.updatePosition(delta)
	}


	// updatePosition: num -> None
	// updates the position of the camera
	updatePosition( delta ) {
		let new_x = this.x + this.wanted_speed.x*delta;
		let new_y = this.y + this.wanted_speed.y*delta;

		if( Math.abs(new_x - this.x) > Math.abs(this.wanted_pos.x - this.x) )
			new_x = this.wanted_pos.x;
		
		if( Math.abs(new_y - this.y) > Math.abs(this.wanted_pos.y - this.y) )
			new_y = this.wanted_pos.y;

		this.x = new_x;
		this.y = new_y;

		this.setPosition(new_x, new_y)
	}


	// setWantedPosition: num, num -> None
	// sets the position where the camera needs to be so it can get there
	setWantedPosition( new_x, new_y ) {
		this.wanted_pos = {
			x: new_x,
			y: new_y
		}

		this.wanted_speed = {
			x: (this.wanted_pos.x - this.x) / this.correction_time,
			y: (this.wanted_pos.y - this.y) / this.correction_time
		}
	}


	// getters
	getGunPosition() {
		return {
			x: this.x,
			y: this.y
		};
	}
}