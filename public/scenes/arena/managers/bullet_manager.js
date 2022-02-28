class BulletManager {

	constructor (scene) {
		this.scene = scene;

		this.bullet_time_to_live = 3000;
		this.bullets = new Set();
	}


	update(delta) {
		for (let bullet of this.bullets) {
			bullet.update(delta);
			
			if( bullet.getTimeAlive() > this.bullet_time_to_live ) {
				this.bullets.delete(bullet);
				bullet.destroy();
			}
		}
	}


	addBullet( x, y, vx, vy ) {
		let new_bullet = new Bullet( this.scene, x, y, vx, vy )
		this.bullets.add( new_bullet );
	}


	deleteBullet(bullet) {
		this.bullets.delete(bullet);
		bullet.destroy();
	}
}