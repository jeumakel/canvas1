$('#goBut')[0].disabled = '';
$('#stopBut')[0].disabled = 'true';
$('#fireElement')[0].disabled = 'true';

var canvasObj = $("#playground")[0];
Render.init(canvasObj);

var env = new Environment();
env.init(canvasObj.height, canvasObj.width);

function fireElement() { 
	var colors = ["red", "blue", "pink", "grey", "yellow", "green", "cyan"];
	var el_type = $('#el_type_radio')[0].checked ? 'block' : 'circle';
	env.addElement(el_type, [15, 100, 35, 35], colors[Math.round(Math.random() * 6)]); 
	env.element_locations['el_' + env.element_count].direction = [10, -7];
}

function renderAll() {
	var i;
	Render.clearScr();
	$('#infoBox')[0].innerHTML = env.element_count;
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