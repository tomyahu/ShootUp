class CameraObject extends Phaser.GameObjects.Sprite {
	
	constructor (scene, x, y) {
		// super
		super(scene, x, y);
		
		// render
		scene.add.existing(this);
		
		// physics rendering
		scene.physics.add.existing(this);

		this.scene = scene;
		this.max_zoom = 1.5;
	}


	update() {
		this.updateCenter();
		this.updateZoom();
	}


	// updateCenter: None -> None
	// updates the center of the camera
	updateCenter() {
		let avg_x = 0;
		let avg_y = 0;

		let players = this.scene.getPlayers();
		for( var i = 0; i < players.length; i++ ) {
			avg_x += players[i].x;
			avg_y += players[i].y;
		}

		avg_x /= players.length;
		avg_y /= players.length;

		const cam = this.scene.cameras.main;
		cam.centerOn(avg_x, avg_y);
		this.setPos(avg_x, avg_y);
	}


	// updateZoom: None -> None
	// updates the zoom of the camera
	updateZoom() {
		let players = this.scene.getPlayers();

		let desv_max = 0;
		for( var i = 0; i < players.length; i++ ) {
			desv_max = Math.max(desv_max, 
				Math.max( Math.abs(this.x - players[i].x), Math.abs(this.y - players[i].y)*window_width/window_height)
			)
		}

		const cam = this.scene.cameras.main;
		const zoom = Math.min(this.max_zoom, 1.0 / (desv_max*1.5 + 200) * window_width/2);
		cam.setZoom(zoom*1.5);
	}


	// setters
	setPos(x, y) {
		this.x = x;
		this.y = y;
	}
}