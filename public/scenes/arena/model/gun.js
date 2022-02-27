class Gun extends Phaser.Physics.Arcade.Sprite {

	constructor (scene) {
		super(scene, 18, 6, "gun");
		this.originY = 0;
	}
}