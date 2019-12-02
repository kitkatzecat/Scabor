Game.Music = {
	Tracks: [],
	Load: function(source,autoplay=false,loop=true) {
		Game.Loader.Show('music__'+source);
		
		var audio = document.createElement("audio");
		audio.style.display = 'none';
		audio.innerHTML = '<source src="resources/music/'+source+'"></source>';
		
		Game.Music.Tracks.push(audio);
		
		document.body.appendChild(audio);
		
		audio.autoplay = autoplay;
		audio.loop = loop;
		
		audio.oncanplaythrough = function() {
			Game.Loader.Hide('music__'+source);
		}
		
		audio.unload = function() {
			this.pause();
			Game.Music.Tracks.splice(Game.Music.Tracks.indexOf(this,1));
			this.parentNode.removeChild(this);
		}
		
		return audio;
	},
	Unload: function(audio) {
		this.pause();
		Game.Music.Tracks.splice(Game.Music.Tracks.indexOf(this,1));
		this.parentNode.removeChild(this);
	},
	PauseAll: function() {
		for (var i = 0; i < Game.Music.Tracks.length; i++) {
			Game.Music.Tracks[i].pause();
		}
	},
	PlayAll: function() {
		for (var i = 0; i < Game.Music.Tracks.length; i++) {
			Game.Music.Tracks[i].play();
		}
	},
	UnloadAll: function() {
		var i = 0;
		while (i < Game.Music.Tracks.length) {
			var track = Game.Music.Tracks.pop();
			track.pause();
			track.parentNode.removeChild(track);
		}
	}
}