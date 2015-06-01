function Keyboard(element) {
	var self = this;
	element = element || window;
	element.addEventListener("keydown", function(evt) {
		self[evt.keyCode] = true
	});
	element.addEventListener("keyup", function(evt) {
		self[evt.keyCode] = false
	});
}
