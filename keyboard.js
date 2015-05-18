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
Keyboard.UP = 38;
Keyboard.DOWN = 40;
Keyboard.LEFT = 37;
Keyboard.RIGHT = 39;
Keyboard.SPACE = 32;