function Element(type, props) {
	this.type = type;
	this.dim = [props[0], props[1]];
	
	this.friction = 0.99;
	this.gravitation = 0.85;
	this.speed = 1.0;
	this.direction = [0, 0];
	this.massfactor = 10;
	this.elasticy = 1.0;
	
	/*
	 * Methods
	 */
	this.init = function (id, props, col) {
		this.e_id = id;
		//	this.type = type;
		this.position = [props[0], props[1]];
		this.col = col;
	};
	this.getPosition = function () {
		return this.position;
	};
	this.getDirection = function () {
		return this.direction;
	};
	this.getSpeed = function () {
		return this.speed;
	};
	this.move = function (new_dir) {
		return this.speed;
	};
}

function Circle_El(type, props) {
	this.type = type;
	this.rad = this.dim[0] = props[0];
	this.mass = this.massfactor * this.rad * this.rad * Math.PI;
}

function Block_El(type, props) {
	this.type = type;
	this.dim = [props[0], props[1]];	
	this.mass = this.massfactor * this.dim[0] * this.dim[1];
}

/* Inheritance actions */
Circle_El.prototype  = new Element("", [0, 0]);
Block_El.prototype  = new Element("", [0, 0]);