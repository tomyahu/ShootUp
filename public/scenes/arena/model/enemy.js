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

		// gun
		this.gun = new GunContainer(scene, this);
		scene.add.existing(this.gun);

		// hp
		this.hp = 40;

		// UI
		this.hp_text = new Phaser.GameObjects.Text(scene, this.x, this.y, this.hp, { align: 'center', fontSize: '1.5em', fontFamily: 'Arial', })
		scene.add.existing(this.hp_text);

		this.setSize(20, 40);
		this.setOffset(20, 25);
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


	updateDataVisualization() {
		const top_left = this.hp_text.getTopLeft();
		const top_right = this.hp_text.getTopRight();

		this.hp_text.setPosition( this.x - (top_right.x - top_left.x) / 2, this.y-32 );
		this.hp_text.setText(this.hp);
	}


	// setWantedPosition: num, num -> None
	// sets the position where the camera needs to be so it can get there
	setWantedPosition( new_x, new_y ) {
		this.wanted_pos = {
			x: new_x,
			y: new_y
		}

		const dx = (this.wanted_pos.x - this.x);
		const dy = (this.wanted_pos.y - this.y);
		const k = 2.5; // corrention constant depending on distance
		const c_t = Math.min( Math.sqrt( dx*dx + dy*dy ) * k + 0.001, this.correction_time );

		this.wanted_speed = {
			x: dx / c_t,
			y: dy / c_t
		}
	}


	destroy() {
		super.destroy();
		this.gun.destroy();
		this.hp_text.destroy();
	}


	// setters
	setHP(new_hp) {
		this.hp = new_hp;
	}


	// getters
	getGunPosition() {
		return {
			x: this.x,
			y: this.y
		};
	}


	getGun() {
		return this.gun;
	}
}