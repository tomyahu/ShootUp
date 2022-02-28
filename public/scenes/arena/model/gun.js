class Gun extends Phaser.Physics.Arcade.Sprite {

	constructor (scene) {
		super(scene, 18, 6, "gun");
		this.originY = 0;
	}

	//getters
	getOffsetR() {
		return 26
	}

	getOffsetW() {
		return 0.2
	}
}