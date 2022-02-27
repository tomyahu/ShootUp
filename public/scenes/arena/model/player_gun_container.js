class PlayerGunContainer extends Phaser.GameObjects.Container {

	constructor(scene, player) {
		super(scene, player);
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

		this.rot = Math.atan2(dpos.y, dpos.x);
		this.setRotation(this.rot);

		let to_flip = (this.rot > Math.PI*0.5 || this.rot < -Math.PI*0.5);
		this.gun.flipY = to_flip;

	}

}