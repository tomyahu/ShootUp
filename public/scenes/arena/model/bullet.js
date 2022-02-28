class Bullet extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, vx, vy){
		super(scene, x, y, 'bullet');
		scene.add.existing(this);
		scene.physics.add.existing(this);

		scene.physics.add.overlap(this, scene.platforms_layer, ()=> {
				var tile = scene.platforms_layer.getTileAtWorldXY(this.x, this.y);
				
				if( tile ) {
					if( tile.properties.bulletproof ) scene.getBulletManager().deleteBullet(this);
				}
			},
			null, scene);

		scene.physics.add.overlap(this, scene.enemies, ()=> {
				scene.getBulletManager().deleteBullet(this);
			},
			null, scene);
		
		this.setVelocityX(vx);
		this.setVelocityY(vy);

		this.time_alive = 0;
	}


	update(delta) {
		this.time_alive += delta;
	}


	// getters
	getTimeAlive() {
		return this.time_alive;
	}
}