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
	Bar: {
		Composition: {
			Bar: false,
			Room: false,
			Buttons: []
		},
		Add: function(img,text,funct,align='left') {
			var button = document.createElement('div');
			button.className = 'game_bar_button font_title noselect';
			button.style.float = align;
			button.onmousedown = function() {
				Game.Sound.Play('c3.mp3');
			}
			button.onclick = funct;
			button.innerHTML = '<img class="game_bar_button_image noselect" src="resources/images/'+img+'">'+text;
			
			Game.Bar.Composition.Bar.appendChild(button);
			Game.Bar.Composition.Buttons.push(button);
			
			return button;
		},
		Room: function(text) {
			Game.Bar.Composition.Room.innerText = text;
		},
		Hide: function() {
			Game.Bar.Composition.Bar.style.display = 'none';
		},
		Show: function() {
			Game.Bar.Composition.Bar.style.display = '';
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
	
	Game.Bar.Composition.Bar = document.createElement('div');
	Game.Bar.Composition.Bar.id = 'game_bar';
	Game.Bar.Composition.Bar.className = 'noselect';
	Game.Bar.Composition.Room = document.createElement('div');
	Game.Bar.Composition.Room.id = 'game_bar_room';
	Game.Bar.Composition.Room.className = 'noselect font_title';
	document.body.appendChild(Game.Bar.Composition.Bar);
	Game.Bar.Composition.Bar.appendChild(Game.Bar.Composition.Room);

	Game.Loader.Composition.Load = document.createElement('div');
	Game.Loader.Composition.Load.style.display = 'none';
	Game.Loader.Composition.Load.className = 'game_loader';
	document.body.appendChild(Game.Loader.Composition.Load);
});