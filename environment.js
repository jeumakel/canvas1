function Environment() {
	this.init = function (h, w) {
		this.element_locations = [];
		this.element_count = 0;
		this.max_height = h;
		this.max_width = w;
		
		this.obstacle_locations = [];
	};
	this.updateLocation = function (key_obj, newlocation) {
		key_obj.position = newlocation;
	};
	this.updateDirection = function (key_obj, newDirection) {
		key_obj.direction = newDirection;
	};
	this.addElement = function (type, props, col) {
		var obj = null;
		var sx = props[2];
		var sy = props[3];
		switch (type) {
		case "circle":
			obj = new Circle_El("circle", [sx]);
			break;
		case "block":
			obj = new Block_El("block", [sx, sy]);
			break;
		default:
			obj = new Element("element", [sx, sy]);
			break;
		}
		this.element_count++;
		var key = "el_" + this.element_count;
		this.element_locations[key] = obj;
		this.element_locations[key].init(this.element_count, [props[0], props[1]], col);
		if (this.element_count > 1) {
			var n = 0;
			var intersections;
			for (n = 0; n < 0; n++) {
				intersections = this.checkElementIntersects(this.element_locations[key]);
				if (intersections.length > 0) {
					this.updateLocation(this.element_locations[key], [props[0] + 25, props[1] - 25]);
				} else { break; }
			}
		}
		return this.element_count.toString;
	};
	this.removeElement = function (id) {
		this.element_locations = this.element_locations.splice(id, 1);
	};
	this.moveElement = function (key_obj, dir, id) {
		dir = this.addGravity(key_obj, dir);			
		
		var temp_pos = [key_obj.position[0] + dir[0], key_obj.position[1] + dir[1]];
		
		var isCircle = (key_obj.rad) ? true : false;
		var dist_pos = [];
		dist_pos[0] = (isCircle) ? key_obj.rad / 2 : key_obj.dim[0];
		dist_pos[1] = (isCircle) ? key_obj.rad / 2 : key_obj.dim[1];
	
		var temp_changes = this.checkBorders(isCircle, temp_pos, dir, dist_pos);
		
		temp_pos = temp_changes[0];
		dir = temp_changes[1];
		
		var intersections = this.checkElementIntersects(key_obj);
		if (intersections.length > 0) { dir = this.addCollisions(key_obj, dir, intersections); }

		this.updateLocation(key_obj, temp_pos);
		
		this.updateDirection(key_obj, [parseInt((dir[0] < 1 && dir[0] > -1) ? dir[0] : dir[0].toFixed(3)), 
										parseInt((dir[1] < 1 && dir[1] > -1) ? dir[1] : dir[1].toFixed(3))]);
		//console.log(((dir[0] < 1 && dir[0] > -1) ? dir[0] : dir[0].toFixed(3)) + "----------------.__" + ((dir[1] < 1 && dir[1] > -1) ? dir[1] : dir[1].toFixed(3)));
	};
	this.addGravity = function (key_obj, dir) {
		var dx = dir[0];
		var dy = dir[1];

		if (dx < 0.01 && dx > -0.01) { dx = 0; } else { dx = key_obj.friction * dx; }
		
		if (dy > -1 && dy < 0) { dy = 0; } else if (dy === 0) { dy = 1; } else { dy = (dy <= -1) ? key_obj.gravitation * dy : 1.15 * dy; }
		
		//console.log(dx+' --+-- '+dy);
		
		return [dx, dy];
	};
	this.checkBorders = function (isCircle, temp_pos, dir, dist_pos) {
		if (temp_pos[0] + dist_pos[0] > this.max_width) { 
			temp_pos[0] = this.max_width - dist_pos[0]; 
			dir[0] = -dir[0]; 
		} else if (temp_pos[0] - ((isCircle) ? dist_pos[0] : 0) < 0) { 
			temp_pos[0] = (isCircle) ? dist_pos[0] : 0; dir[0] = -dir[0]; 
		} else { /*gf dfg */ }
		if (temp_pos[1] + dist_pos[1] > this.max_height) { 
			if (dir[1] <= 1) { 
				temp_pos[1] = this.max_height - dist_pos[1];  
				dir[1] = 0; 
			} else {
				temp_pos[1] = this.max_height - dist_pos[1];  
				dir[1] = -dir[1]; 
			}
		} else if (temp_pos[1] - ((isCircle) ? dist_pos[1] : 0) < 0) { 
			temp_pos[1] = (isCircle) ? dist_pos[1] : 0; dir[1] = -dir[1]; 
		}
		return [temp_pos, dir];
	};
	// returns true if there is any overlap
	// params: x,y,w,h of two rectangles
	this.intersects = function (x1, y1, w1, h1, type1,  x2, y2, w2, h2, type2) {
		if (type1 === 'circle') {
			if (w2 !== Infinity && w1 !== Infinity) {
				var d1 = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 -y1 ), 2));
				var d2 = (w1 + w2)/2;
				//console.log(Math.pow((x2 - x1), 2) +"-><-"+Math.pow((y2 -y1 ), 2) +"-><-"+d1 +"-><-"+ d2); 
				if (isNaN(d1) || isNaN(d2) || d1 > d2) { return false; }
			}
			return true;
		} else {
			if (w2 !== Infinity && w1 !== Infinity) {
				w2 += x2;
				w1 += x1;
				if (isNaN(w1) || isNaN(w2) || x2 > w1 || x1 > w2) { return false; }
			}
			if (y2 !== Infinity && h1 !== Infinity) {
				h2 += y2;
				h1 += y1;
				if (isNaN(h1) || isNaN(y2) || y2 > h1 || y1 > h2) { return false; }
			}
			return true;
		}
	};
	this.checkElementIntersects =  function (key_obj) {
		var x1 = key_obj.position[0] + key_obj.direction[0];
		var y1 = key_obj.position[1] + key_obj.direction[1];
		var type1 = key_obj.type;
		var w1 = (type1 === "circle") ? key_obj.rad : key_obj.dim[0];
		var h1 = (type1 === "circle") ? key_obj.rad : key_obj.dim[1];
		var x2;
		var y2;
		var w2;
		var h2;
		var type2;
		var i;
		var obj2;
		var intersections = [];
		for (i in this.element_locations) {
			if (this.element_locations.hasOwnProperty(i) && this.element_locations[i] !== key_obj) {
				obj2 = this.element_locations[i];
				x2 = obj2.position[0];
				y2 = obj2.position[1];
				w2 = (type2 === "circle") ? obj2.rad : obj2.dim[0];
				h2 = (type2 === "circle") ? obj2.rad : obj2.dim[1];
				type2 = obj2.type;
				if (this.intersects(x1, y1, w1, h1, type1, x2, y2, w2, h2, type2)) {  /* console.log(x1 + "--" + y1 + "--" + x2 + "--" + y2); */   intersections.push(i); }
				obj2 = null;
			}
		}
		return intersections;
	};
	this.checkObstacleIntersections = function (key_obj) {
	
	};
	this.addCollisions = function (key_obj, dir, intersections) {
		var i;
		var col_obj;
		var other_dir = [0, 0];
		var curr_key;
		var key_mass = key_obj.mass;
		var other_mass;
		for (i in intersections) {
			if (this.element_locations.hasOwnProperty(intersections[i])) {
				var dir_change = 0;
				curr_key = intersections[i];
				col_obj = this.element_locations[curr_key];
				other_dir = col_obj.direction;
				other_mass = col_obj.mass;
				//console.log(key_mass + "__" + other_mass);
				// movement on x direction
 				if (other_dir[0] * dir[0] > 0) {
					dir_change = parseInt((key_mass <= other_mass) ? key_mass / other_mass :  other_mass / key_mass); 
					other_dir[0] = parseInt(other_dir[0]) + parseInt(( other_dir[0] > dir[0] ? 1 : -1 ) * dir_change);
					dir[0] = parseInt(dir[0]) + parseInt(( other_dir[0] > dir[0] ? 1 : -1 ) * dir_change);
					//console.log("|" + dir_change + "|" + other_dir[0] + "|" + (( other_dir[0] > dir[0] ? 1 : -1 ) * dir_change));
				} else { 
					other_dir[0] *= -1; 
					dir[0] *= -1; 
					dir_change = parseInt((key_mass <= other_mass) ? key_mass / other_mass :  other_mass / key_mass); 
					other_dir[0] = parseInt(other_dir[0]) + parseInt(( other_dir[0] > dir[0] ? 1 : -1 ) * dir_change);
					dir[0] = parseInt(dir[0]) + parseInt(( other_dir[0] > dir[0] ? 1 : -1 ) * dir_change);
					//console.log("|" + dir_change + "|" + other_dir[0] + "|" + (( other_dir[0] > dir[0] ? 1 : -1 ) * dir_change));
				}
				// movement on y direction
 				if (other_dir[1] * dir[1] > 0) { 
					dir_change = parseInt((key_mass <= other_mass) ? key_mass / other_mass :  other_mass / key_mass); 
					other_dir[1] = parseInt(other_dir[1]) +  (( other_dir[1] > dir[1] ? 1 : -1 ) * dir_change);
					dir[1] = parseInt(dir[1]) + parseInt(( other_dir[1] > dir[1] ? 1 : -1 ) * dir_change);
					//console.log("---------------|" + dir_change);
				} else {
					other_dir[1] *= -1; 
					dir[1] *= -1; 
					dir_change = parseInt((key_mass <= other_mass) ? key_mass / other_mass :  other_mass / key_mass); 
					other_dir[1] = parseInt(other_dir[1]) + parseInt(( other_dir[1] > dir[1] ? 1 : -1 ) * dir_change);
					dir[1] = parseInt(dir[1]) + parseInt(( other_dir[1] > dir[1] ? 1 : -1 ) * dir_change);
					//console.log("---------------|" + dir_change);
 				} 
				/* else if (other_dir[1] < 0 && dir[1] < 0) {} */
				//console.log(dir[0] +"<|||>"+ dir[1]+"<|||>"+ other_dir[0]+"<|||>"+ other_dir[1]);
				this.updateDirection(col_obj, other_dir);
				//this.updateDirection(key_obj, dir);
				col_obj = null;
			}
		}
		return dir;
	};
}