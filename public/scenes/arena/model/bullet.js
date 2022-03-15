class Bullet extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, id, x, y, vx, vy){
		super(scene, x, y, 'bullet');
		scene.add.existing(this);
		scene.physics.add.existing(this);

		scene.physics.add.overlap(this, scene.platforms_layer, ()=> {
				var tile = scene.platforms_layer.getTileAtWorldXY(this.x, this.y);
				
				if( tile ) {
					if( tile.properties.bulletproof ) scene.getBulletManager().deleteBullet(id);
				}
			},
			null, scene);

		scene.physics.add.overlap(this, scene.enemies, (bullet, enemy) => {
			},
			null, scene);
		
		scene.physics.add.overlap(this, scene.player, (bullet, player) => {
				scene.getBulletManager().deleteBullet(id)
				scene.io.emit('bullet_delete', {id: id});
				player.getDamaged(bullet.getDmg());
			},
			null, scene);
		
		this.setVelocityX(vx);
		this.setVelocityY(vy);

		this.dmg = 2;

		this.time_alive = 0;
	}


	update(delta) {
		this.time_alive += delta;
	}


	// getters
	getTimeAlive() {
		return this.time_alive;
	}


	getDmg() {
		return this.dmg;
	}
}