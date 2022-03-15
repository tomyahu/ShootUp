class BulletManager {

	constructor (scene) {
		this.scene = scene;

		this.bullet_time_to_live = 3000;
		this.bullets = {};
		
	}


	update(delta) {
		for (let id of Object.keys(this.bullets)) {
			let bullet = this.bullets[id];
			bullet.update(delta);
			
			if( bullet.getTimeAlive() > this.bullet_time_to_live ) {
				bullet.destroy();
				delete this.bullets[id];
			}
		}
	}


	addBullet( id, x, y, vx, vy ) {
		let new_bullet = new Bullet( this.scene, id, x, y, vx, vy )
		this.bullets[id] = new_bullet;
	}


	deleteBullet(id) {
		let bullet = this.bullets[id];
		if( bullet ) bullet.destroy();
		
		delete this.bullets[id];
	}
}