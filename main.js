document.getElementById('goBut').disabled = '';
document.getElementById('stopBut').disabled = 'true';
document.getElementById('fireElement').disabled = 'true';

var canvasObj = document.getElementById("playground");
Render.init(canvasObj);

var env = new Environment();
env.init(canvasObj.height, canvasObj.width);

function fireElement() { 
	var colors = ["red", "blue", "pink", "grey", "yellow", "green", "cyan"];
	env.addElement("circle", [15, 100, 35, 35], colors[Math.round(Math.random() * 6)]); 
	env.element_locations['el_' + env.element_count].direction = [10, -7];
}

function renderAll() {
	var i;
	Render.clearScr();
	document.getElementById('infoBox').innerHTML = env.element_count;
	for (i in env.element_locations) {
		if (env.element_locations.hasOwnProperty(i)) {
			var obj = env.element_locations[i];
			Render.drawElement(obj);	
			env.moveElement(obj, obj.getDirection(), i);
			obj = null;
		}
	}
}

Render.clearScr();

var intId;
function startDemo() {
	intId = setInterval(renderAll, 40);	
}