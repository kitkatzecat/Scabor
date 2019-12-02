var Game = {
	Ready: false,
	Version: 0.1,
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
	JS: {
		Load: function(source) {
			var js = document.createElement('script');
			js.setAttribute('language','javascript');
			js.setAttribute('src','./resources/js/'+source);
			document.head.appendChild(js);
			var name = (source.substr(0,source.lastIndexOf('.')).replace('/','__'));
			name = name.charAt(0).toUpperCase() + name.slice(1);
			Game.JS.Loaded[name] = js;

			Game.When(function() {
				return (typeof Game[name] != 'undefined');
			},function() {
				try {
					Game[name].Init();
				} catch(e) {
					console.log('Game.JS.Load: Unable to execute Init of '+name+': '+e);
				}
			});
			
			console.log('Game.JS.Load: Loaded JavaScript "'+source+'" as "'+name+'"');
			return name;
		},
		Loaded: {},
		UnloadAll: function() {
			for (var key in Game.JS.Loaded) {
				Game.JS.Unload(key);
			}
			console.log('Game.JS.UnloadAll: Unloaded all JavaScript scripts');
		},
		Unload: function(source) {
			if (Game.JS.Loaded.hasOwnProperty(source)) {
				Game.JS.Loaded[source].parentNode.removeChild(Game.JS.Loaded[source]);
				delete Game.JS.Loaded[source];
			} else {
				console.log('Game.JS.Unload: Failed to unload "'+source+'": object is undefined');
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
				Game.Sound.Play('click.mp3');
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
	When: function(condition=function(){return true;},callback=function(result=true){},time=500,tries=5,attempt=0,id=false) {
		if (!id) {
			id = new Date().getTime();
		}
		if (attempt < tries) {
			console.log('Game.When ('+id+'): Checking condition (attempt '+(attempt+1)+' of '+tries+')');
			if (attempt == 0) {
				console.log(condition);
			}

			var ret;
			try {
				ret = condition();
			} catch(e) {
				console.log('Game.When ('+id+'): Condition function error: '+e);
			}

			if (!!ret) {
				console.log('Game.When ('+id+'): Condition is true');
				//console.log(condition);
				try {
					callback(true);
				} catch(e) {
					console.log('Game.When ('+id+'): Callback function error: '+e);
				}
			} else {
				attempt++;
				setTimeout(function(){
					Game.When(condition,callback,time,tries,attempt,id);
				},time);
			}

		} else {
			console.log('Game.When ('+id+'): Condition unable to be validated');
			//console.log(condition);
			try {
				callback(false);
			} catch(e) {
				console.log('Game.When ('+id+'): Callback function error: '+e);
			}
		}
	}
};
window.addEventListener('load',function() {
	console.log('Welcome to Scabor game engine - version '+Game.Version);

	Game.Loader.Composition.Load = document.createElement('div');
	Game.Loader.Composition.Load.style.display = 'none';
	Game.Loader.Composition.Load.className = 'game_loader';
	document.body.appendChild(Game.Loader.Composition.Load);

	if (window.location.href.indexOf('game.htm') != -1) {
		console.log('Setting up game...');
		Game.Loader.Show('Game');

		Game.CSS.Load('game.css');
		Game.CSS.Load('font.css');
		
		Game.Bar.Composition.Bar = document.createElement('div');
		Game.Bar.Composition.Bar.id = 'game_bar';
		Game.Bar.Composition.Bar.className = 'noselect';
		Game.Bar.Composition.Room = document.createElement('div');
		Game.Bar.Composition.Room.id = 'game_bar_room';
		Game.Bar.Composition.Room.className = 'noselect font_title';
		document.body.appendChild(Game.Bar.Composition.Bar);
		Game.Bar.Composition.Bar.appendChild(Game.Bar.Composition.Room);

		Game.JS.Load('story.js');

		Game.JS.Load('characters.js');
		Game.JS.Load('dialogue.js');
		Game.JS.Load('cutscene.js');

		Game.JS.Load('sound.js');
		Game.JS.Load('music.js');
		Game.JS.Load('splash.js');
		Game.JS.Load('cursor.js');
		Game.JS.Load('ui.js');

		Game.JS.Load('room.js');
		Game.JS.Load('place.js');
		Game.JS.Load('items.js');

		Game.When(function() {return typeof Game.Splash != 'undefined'},function(result) {
			if (result) {
				if (!Game.Ready) {
					Game.Splash.Show('Loading...',false,'none');
				}
				document.body.style.opacity = '1';
			}
		});

		Game.When(function() {
			if (
				typeof Game.Story != 'undefined' &&
				typeof Game.Characters != 'undefined' &&
				typeof Game.Dialogue != 'undefined' &&
				typeof Game.Sound != 'undefined' &&
				typeof Game.Splash != 'undefined' &&
				typeof Game.Cursor != 'undefined' &&
				typeof Game.Room != 'undefined' &&
				typeof Game.Items != 'undefined'
			) {
				return true;
			} else {
				return false;
			}
		},function(result) {
			if (result) {
				Game.Ready = true;
			}
		},500,50);

		Game.When(function() {return Game.Ready},function(result) {
			if (result) {
				Game.Splash.Hide();
				Game.Loader.Hide('Game');
				Game.JS.Load('play.js');
			} else {
				Game.Loader.Hide('Game');
				Game.Splash.Show('An error occurred while loading.<br><span class="font_text" style="font-size:0.8em;">Try reloading the game.</span><br><span class="font_text" style="font-size:0.4em;">Developers: See console log for details.</span>',false,'none');
				console.log('Game [anonymous window load]: In Game.When - Game.Ready was never true');
			}
		},500,50);

	} else {
		console.log('Menu screen - loading lite engine');
		Game.JS.Load('music.js');
		Game.JS.Load('sound.js');
		Game.JS.Load('splash.js');
		Game.JS.Load('ui.js');
		Game.JS.Load('index.js');
		Game.Ready = true;
	}
});