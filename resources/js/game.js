var Game = {
	CSS: {
		Load: function(source) {
			var css = document.createElement('link');
			css.setAttribute('rel','stylesheet');
			css.setAttribute('href','./resources/css/'+source);
			document.head.appendChild(css);
			var name = source.substr(0,source.lastIndexOf('.')).replace('/','__');
			Game.CSS.Loaded[name] = css;
			
			console.log('Game.CSS.Load: Loaded stylesheet "'+source+'" as "'+name+'"');
			return name;
		},
		Loaded: {},
		UnloadAll: function() {
			for (var key in Game.CSS.Loaded) {
				Game.CSS.Unload(key);
			}
			console.log('Game.CSS.UnloadAll: Unloaded all stylesheets');
		},
		Unload: function(source) {
			if (Game.CSS.Loaded.hasOwnProperty(source)) {
				Game.CSS.Loaded[source].parentNode.removeChild(Game.CSS.Loaded[source]);
				delete Game.CSS.Loaded[source];
			} else {
				console.log('Game.CSS.Unload: Failed to unload "'+source+'": object is undefined');
			}
		}
	},
	Loader: {
		Composition: {
			Load: false,
			Loading: []
		},
		Show: function(id) {
			if (Game.Loader.Composition.Loading.indexOf(id) < 0) {
				Game.Loader.Composition.Loading.push(id);
			}
			Game.Loader.Composition.Load.style.display = 'block';
		},
		Hide: function(id) {
			var loc = Game.Loader.Composition.Loading.indexOf(id);
			if (loc > -1) {
				Game.Loader.Composition.Loading.splice(loc,1);
			}
			if (Game.Loader.Composition.Loading.length == 0) {
				Game.Loader.Composition.Load.style.display = 'none';
			}
		}
	},
	When: function(condition=function(){return true;},callback=function(result=true){},time=500,tries=5,attempt=0) {
		if (attempt < tries) {
			console.log('Game.When: Checking condition (attempt '+(attempt+1)+' of '+tries+')');
			console.log(condition);

			var ret;
			try {
				ret = condition();
			} catch(e) {
				console.log('Game.When: Condition function error: '+e);
			}

			if (!!ret) {
				console.log('Game.When: Condition is true');
				console.log(condition);
				try {
					callback(true);
				} catch(e) {
					console.log('Game.When: Callback function error: '+e);
				}
			} else {
				attempt++;
				setTimeout(function(){
					Game.When(condition,callback,time,tries,attempt);
				},time);
			}

		} else {
			console.log('Game.When: Condition unable to be validated');
			console.log(condition);
			try {
				callback(false);
			} catch(e) {
				console.log('Game.When: Callback function error: '+e);
			}
		}
	}
};
window.addEventListener('load',function() {
	Game.CSS.Load('game.css');

	Game.Loader.Composition.Load = document.createElement('div');
	Game.Loader.Composition.Load.style.display = 'none';
	Game.Loader.Composition.Load.className = 'game_loader';
	document.body.appendChild(Game.Loader.Composition.Load);
});