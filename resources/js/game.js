var Game = {
	CSS: {
		Load: function(source) {
			var css = document.createElement('link');
			css.setAttribute('rel','stylesheet');
			css.setAttribute('href','./resources/css/'+source);
			document.head.appendChild(css);
			var name = source.substr(0,source.lastIndexOf('.')).replace('/','__');
			Game.CSS.Loaded[name] = css;
			
			console.log('Game.CSS.Load: loaded stylesheet "'+source+'" as "'+name+'"');
			return name;
		},
		Loaded: {},
		UnloadAll: function() {
			for (var key in Game.CSS.Loaded) {
				if (Game.CSS.Loaded.hasOwnProperty(key)) {
					Game.CSS.Loaded[key].parentNode.removeChild(Game.CSS.Loaded[key]);
					delete Game.CSS.Loaded[key];
				}
			}
		},
		Unload: function(source) {
			if (Game.CSS.Loaded.hasOwnProperty(source)) {
				Game.CSS.Loaded[source].parentNode.removeChild(Game.CSS.Loaded[source]);
				delete Game.CSS.Loaded[source];
			} else {
				console.log('Game.CSS.Unload: failed to unload "'+source+'": object is undefined');
			}
		}
	}
};