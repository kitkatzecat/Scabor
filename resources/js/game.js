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