Blind.camera = (function(){

	// ========================== CAMERA STATE  =============================

	// position
	var x=0,y=0;

	// orientation
	var angle=-Math.PI/2;

	// speed (per second)
	var moveSpeed = 50;
	var angleSpeed = Math.PI;

	function setPosition(_x,_y) {
		x = _x;
		y = _y;
	}

	function setAngle(_angle) {
		angle = _angle;
	}

	// ========================== MAP & PROJECTION  =============================

	var map;
	var projection;

	function init(_map) {
		map = _map;
		updateProjection();
	}

	function updateProjection() {
		projection = Blind.getProjection({
			x: x,
			y: y,
			boxes: map.boxes,
		});
	}

	// ========================== CONTROLLER FUNCTIONS =============================
	
	var controls = {
		"turnLeft": false,
		"turnRight": false,
		"moveUp": false,
		"moveDown": false,
	};
	function clearControls() {
		var name;
		for (name in controls) {
			controls[name] = false;
		}
	};
	var viewKeyHandler = {
		'press': {
			'left': function() {
				controls["turnLeft"] = true;
			},
			'right': function() {
				controls["turnRight"] = true;
			},
		},
		'release': {
			'left': function() {
				controls["turnLeft"] = false;
			},
			'right': function() {
				controls["turnRight"] = false;
			},
		}
	};
	var moveKeyHandler = {
		'press': {
			'up': function() {
				controls["moveUp"] = true;
			},
			'down': function() {
				controls["moveDown"] = true;
			},
		},
		'release': {
			'up': function() {
				controls["moveUp"] = false;
			},
			'down': function() {
				controls["moveDown"] = false;
			},
		}
	};
	function enableViewKeys()  { Blind.input.addKeyHandler(    viewKeyHandler); }
	function disableViewKeys() { Blind.input.removeKeyHandler( viewKeyHandler); }
	function enableMoveKeys()  { Blind.input.addKeyHandler(    moveKeyHandler); }
	function disableMoveKeys() { Blind.input.removeKeyHandler( moveKeyHandler); }

	// ========================== MAIN FUNCTIONS  =============================

	function update(dt) {
		if (controls["turnLeft"]) {
			angle -= angleSpeed*dt;
		}
		if (controls["turnRight"]) {
			angle += angleSpeed*dt;
		}
		if (controls["moveUp"]) {
			x += Math.cos(angle)*moveSpeed*dt;
			y += Math.sin(angle)*moveSpeed*dt;
		}
		if (controls["moveDown"]) {
			x -= Math.cos(angle)*moveSpeed*dt;
			y -= Math.sin(angle)*moveSpeed*dt;
		}
		if (controls["moveUp"] || controls["moveDown"]) {
			updateProjection();
		}
	}

	function draw(ctx) {
		ctx.save();
		ctx.translate(Blind.canvas.width/2, Blind.canvas.height/2);
		var w = 4;
		ctx.fillStyle="#FFF";
		ctx.fillRect(-w/2,-w/2,w,w);
		ctx.rotate(-Math.PI/2-angle);
		ctx.translate(-x, -y);
		map.draw(ctx);
		Blind.drawArcs(ctx, {
			x: x,
			y: y,
			radius: 50,
			lineWidth: 10,
			projection: projection,
		});

		ctx.restore();
	}

	return {
		init: init,
		updateProjection: updateProjection,
		enableViewKeys: enableViewKeys,
		disableViewKeys: disableViewKeys,
		enableMoveKeys: enableMoveKeys,
		disableMoveKeys: disableMoveKeys,
		setPosition: setPosition,
		setAngle: setAngle,
		update: update,
		draw: draw,
	};
})();
