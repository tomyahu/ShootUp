class GunContainer extends Phaser.GameObjects.Container {

	constructor(scene, entity) {
		let gun_position = entity.getGunPosition();
		super(scene, gun_position.x, gun_position.y);

		this.entity = entity;

		let self = this;
		scene.events.on('postupdate', function(time, delta) {
			self.update()
		});

		this.gun = new Gun(scene);
		this.add(this.gun);

		this.scene = scene;
		this.depth = 10;
		this.rot = 0.0;
	}


	update() {
		let gun_position = this.entity.getGunPosition();
		this.setPosition(gun_position.x, gun_position.y);
	}


	setRot(rot) {
		this.rot = rot;
		this.setRotation(this.rot);

		let to_flip = (this.rot > Math.PI*0.5 || this.rot < -Math.PI*0.5);
		this.gun.flipY = to_flip;
	}

	
	shootBullet(x, y, vx, vy) {
		x = x + this.gun.getOffsetR() * Math.cos(this.rot + this.gun.getOffsetW())
		y = y + this.gun.getOffsetR() * Math.sin(this.rot + this.gun.getOffsetW())

		this.scene.io.emit('bullet_shot', {x: x, y: y, vx: vx, vy: vy}); //the object contains the movement data
	}


	destroy() {
		super.destroy();
		this.gun.destroy()
	}


	// getters
	getGun() {
		return this.gun;
	}

}