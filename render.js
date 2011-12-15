var Render = {
	ctx: null,
	init: function (canvasObj) {
		this.c = canvasObj;
		this.ctx = this.c.getContext("2d");
		this.drawBackground();
	},
	drawBackground: function () {
		var bgc = $("#background")[0];
		var bgctx = bgc.getContext("2d");
		bgctx.lineWidth = 6;  
		bgctx.strokeStyle = "#333";
		bgctx.beginPath();  
		bgctx.fillStyle = "#0F0";
		bgctx.moveTo(0, 120);
		bgctx.bezierCurveTo(0, 120, 300, 290, 605, 180);
		bgctx.lineTo(605, 405);
		bgctx.lineTo(-5, 405);
		bgctx.lineTo(-5, 120);
		bgctx.closePath();
		bgctx.fill();
		bgctx.stroke();
		
		bgctx.beginPath();
		bgctx.fillStyle = "yellow";
		bgctx.arc(500, 75, 50, 0, Math.PI * 2, true);
		bgctx.closePath();
		bgctx.fill();
	},
	drawElement: function (el_props) {
		var type = el_props.type;
		var x = el_props.position[0];
		var y = el_props.position[1];
		var r = el_props.rad/2;
		var w = el_props.dim[0];
		var h = el_props.dim[1];
		var el_id = el_props.e_id;
		var color = (el_props.col) ? el_props.col : "black";
		
		switch (type) {
		case "circle":
			this.ctx.beginPath();
			this.ctx.fillStyle = color;
			this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
			this.ctx.closePath();
			this.ctx.fill();

			this.ctx.lineWidth = 2;
			this.ctx.strokeStyle = "black";
			this.ctx.stroke();

			this.ctx.beginPath();
			this.ctx.lineWidth = 1;
			this.ctx.textAlign = 'center';
			this.ctx.strokeStyle = 'black';
			this.ctx.strokeText(el_id, x, y+4);
			this.ctx.closePath();
			this.ctx.stroke();
			
			break;
		case "block":
			this.ctx.beginPath();
			this.ctx.fillStyle = color;
			this.ctx.fillRect(x, y, w, h);
			this.ctx.closePath();
			this.ctx.fill();

			this.ctx.lineWidth = 2;
			this.ctx.strokeStyle = "black";
			this.ctx.stroke();
			
			this.ctx.beginPath();
			this.ctx.lineWidth = 1;
			this.ctx.textAlign = 'center';
			this.ctx.strokeStyle = 'black';
			this.ctx.strokeText(el_id, x + w/2, y + h/2+4);
			this.ctx.closePath();
			this.ctx.stroke();
			
			break;
		default:
			break;
		}
	
	},
	clearScr: function () {
		this.ctx.clearRect(0, 0, this.c.width, this.c.height);
	}
};