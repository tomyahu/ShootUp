class CameraObject extends Phaser.GameObjects.Sprite {
	
	constructor (scene, x, y) {
		// super
		super(scene, x, y);
		
		// render
		scene.add.existing(this);
		
		// physics rendering
		scene.physics.add.existing(this);

		this.scene = scene;
		this.max_zoom = 3;

		this.correction_pos_time = 200;
		this.correction_zoom_time = 200;
	}


	update(delta) {
		this.updateCenter(delta);
		this.updateZoom(delta);
	}


	// updateCenter: num -> None
	// updates the center of the camera
	updateCenter(delta) {
		let avg_x = 0;
		let avg_y = 0;

		let players = this.scene.getPlayers();
		for( var i = 0; i < players.length; i++ ) {
			avg_x += players[i].x;
			avg_y += players[i].y;
		}

		if( players.length > 0 ) {
			avg_x /= players.length;
			avg_y /= players.length;
		}

		const cam = this.scene.cameras.main;
		const max_correction = Math.min(delta, this.correction_pos_time);
		const new_x = ( avg_x * max_correction + cam.midPoint.x * this.correction_pos_time ) / ( this.correction_pos_time + max_correction );
		const new_y = ( avg_y * max_correction + cam.midPoint.y * this.correction_pos_time ) / ( this.correction_pos_time + max_correction );

		cam.centerOn(new_x, new_y);
		this.setPos(new_x, new_y);
	}


	// updateZoom: num -> None
	// updates the zoom of the camera
	updateZoom(delta) {
		let players = this.scene.getPlayers();

		let desv_max = 0;
		for( var i = 0; i < players.length; i++ ) {
			desv_max = Math.max(desv_max, 
				Math.max( Math.abs(this.x - players[i].x), Math.abs(this.y - players[i].y)*window_width/window_height)
			)
		}

		const cam = this.scene.cameras.main;
		const zoom = Math.min(this.max_zoom, 1.0 / (desv_max*1.5 + 200) * window_width/2);

		const max_correction = Math.min(delta, this.correction_zoom_time);
		const new_zoom = ( zoom * max_correction + cam.zoom * this.correction_zoom_time ) / ( this.correction_zoom_time + max_correction );

		cam.setZoom(new_zoom);
	}


	// setters
	setPos(x, y) {
		this.x = x;
		this.y = y;
	}
}