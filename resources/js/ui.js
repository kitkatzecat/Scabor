Game.UI = {
	Show: function(obj) {
		Game.UI.Hidden();
		if (obj.tagName.toLowerCase() == 'div') {
			obj.className = 'ui_container ui_container_animated-open font_text';
			Game.UI.Composition.Current = obj;
			document.body.appendChild(Game.UI.Composition.Current);
			document.body.appendChild(Game.UI.Composition.Background);
			setTimeout(function() {
				Game.UI.Composition.Current.className = 'ui_container font_text';
			},500);
		} else {
			console.log('Game.UI.Show: Invalid object');
		}
	},
	Hide: function() {
		if (Game.UI.Composition.Current != false) {
			Game.UI.Composition.Current.className = 'ui_container ui_container_animated-close font_text';
			Game.UI.Composition.Background.className = 'ui_background ui_background_animated-close font_text noselect';
			setTimeout(Game.UI.Hidden,500);
		}
	},
	Hidden: function() {
		try {
			Game.UI.Composition.Current.remove();
		} catch (e) {}
		Game.UI.Composition.Current = false;
		try {
			Game.UI.Composition.Background.remove();
		} catch (e) {}
		Game.UI.Composition.Background.className = 'ui_background ui_background_animated-open font_text noselect';
	},
	Composition: {
		Current: false,
		Background: false
	}
}

Game.UI.Init = function() {
	Game.UI.Composition.Background = document.createElement('div');
	Game.UI.Composition.Background.className = 'ui_background ui_background_animated-open font_text noselect';
	Game.CSS.Load('ui.css');
}

Game.Ui = Game.UI;