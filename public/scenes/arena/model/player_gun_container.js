class PlayerGunContainer extends GunContainer {

	constructor(scene, player) {
		super(scene, player);

		let bullet_speed = 1000;
		let self = this;
		scene.input.on('pointerdown', function (pointer) {
			if( ! self.entity.isAlive() ) return;
			self.shootBullet(self.x, self.y, bullet_speed * Math.cos(self.rot), bullet_speed * Math.sin(self.rot));
		}, scene);
	}


	update() {
		super.update();

		const mouse = game.input.mousePointer;
		const cam = this.scene.cameras.main;
		const point_in_world = cam.getWorldPoint(mouse.x, mouse.y);

		const dpos = {
			x: point_in_world.x - this.x,
			y: point_in_world.y - this.y
		}

		const new_rot = Math.atan2(dpos.y, dpos.x);
		this.setRot(new_rot);
		this.scene.io.emit('player_gun_rotated', {rot: new_rot}); //the object contains the movement data
	}

}