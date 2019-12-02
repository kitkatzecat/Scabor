Game.Sound = {
	Load: function(source) {
		Game.Loader.Show('sound__'+(source.substr(0,source.lastIndexOf('.')).replace('/','__')));
			
		var audio = document.createElement("audio");
		audio.style.display = "none";
		audio.innerHTML = '<source src="./resources/sounds/'+source+'"></source>';

		document.body.appendChild(audio);

		audio.onerror = function() {
			console.log('Game.Sound.Load: Error loading audio from source "'+source+'"');
			Game.Loader.Hide('sound__'+(source.substr(0,source.lastIndexOf('.')).replace('/','__')));
		};
	
		audio.oncanplaythrough = function() {
			Game.Loader.Hide('sound__'+(source.substr(0,source.lastIndexOf('.')).replace('/','__')));
		};
		Game.Sound.Loaded[(source.substr(0,source.lastIndexOf('.')).replace('/','__'))] = audio;
		console.log('Game.Sound.Load: Loaded audio from source "'+source+'"');
	},
	Loaded: {},
	Play: function(source) {
		if (typeof Game.Sound.Loaded[(source.substr(0,source.lastIndexOf('.')).replace('/','__'))] == 'undefined') {
			Game.Loader.Show('sound__'+(source.substr(0,source.lastIndexOf('.')).replace('/','__')));
			
			var audio = document.createElement("audio");
			audio.style.display = "none";
			audio.innerHTML = '<source src="./resources/sounds/'+source+'"></source>';

			document.body.appendChild(audio);
			
			audio.oncanplaythrough = function() {
				audio.play();
				Game.Loader.Hide('sound__'+(source.substr(0,source.lastIndexOf('.')).replace('/','__')));
			};
			audio.onerror = function() {
				console.log('Game.Sound.Play: Error loading audio from source "'+source+'"');
				Game.Loader.Hide('sound__'+(source.substr(0,source.lastIndexOf('.')).replace('/','__')));
			};
			audio.onended = function() {
				this.parentNode.removeChild(this);
				Game.Loader.Hide('sound__'+(source.substr(0,source.lastIndexOf('.')).replace('/','__')));
			};
		} else {
			Game.Sound.Loaded[(source.substr(0,source.lastIndexOf('.')).replace('/','__'))].currentTime = 0;
			Game.Sound.Loaded[(source.substr(0,source.lastIndexOf('.')).replace('/','__'))].play();
		}
	}
};