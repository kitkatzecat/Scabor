Game.Cursor = {
	MouseMove: function(e) {
		Game.Cursor.Composition.Cursor.style.top = e.clientY+'px';
		Game.Cursor.Composition.Cursor.style.left = e.clientX+'px';
	},
	Set: function(style=false) {
		if (style != false) {
			Game.Cursor.Composition.Cursor.className = 'cursor cursor_'+style;
			document.body.appendChild(Game.Cursor.Composition.Cursor);
			document.body.style.cursor = 'none';
		}
	},
	Hide: function() {
		Game.Cursor.Composition.Cursor.remove();
		document.body.style.cursor = '';
	},
	Init: function() {
		Game.CSS.Load('cursor.css');

		document.body.addEventListener('mousemove',Game.Cursor.MouseMove);

		Game.Cursor.Composition.Cursor = document.createElement('div');
		Game.Cursor.Composition.Cursor.className = 'cursor cursor_magnifying-glass';
	},
	Composition: {}
}
