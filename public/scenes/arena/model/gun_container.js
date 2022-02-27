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

		this.depth = 10;

		this.rot = 0.0;
	}


	update() {
		let gun_position = this.entity.getGunPosition();
		this.setPosition(gun_position.x, gun_position.y);
	}

}