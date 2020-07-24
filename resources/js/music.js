Game.Music = {
	Story: {},
	Tracks: [],
	Load: function(source,autoplay=false,loop=true,time=0) {
		Game.Loader.Show('music__'+source);
		
		var audio = document.createElement("audio");
		audio.style.display = 'none';
		audio.innerHTML = '<source src="resources/music/'+source+'"></source>';
		
		Game.Music.Tracks.push(audio);
		
		document.body.appendChild(audio);
		
		audio.autoplay = autoplay;
		audio.loop = loop;
		audio.currentTime = time;
		
		audio.oncanplaythrough = function() {
			Game.Loader.Hide('music__'+source);
		}
		
		audio.unload = function() {
			audio.pause();
			audio.innerHTML = '';
			Game.Music.Tracks.splice(Game.Music.Tracks.indexOf(audio,1));
			audio.parentNode.removeChild(audio);
		}
		
		return audio;
	},
	Unload: function(audio) {
		audio.pause();
		audio.innerHTML = '';
		Game.Music.Tracks.splice(Game.Music.Tracks.indexOf(audio,1));
		audio.parentNode.removeChild(audio);
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
};
(function() {
	var request = new XMLHttpRequest;
	
	request.open('GET', 'resources/music.json', true);
	
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			if (request.status == 200) {
				var result = request.responseText;
				try {
					result = JSON.parse(result);
					Game.Music.Story = result;
					for (let part in Game.Music.Story) {
						if (Game.Music.Story.hasOwnProperty(part)) {
							Game.Music.Story[part].forEach(function(file,i) {
								Game.Music.Story[part][i] = function() {
									Game.Music.Story[part][i] = Game.Music.Load(file);
								}
								Game.Music.Story[part][i].unload = function() {
									console.log('Game.Music: Warning: Story track "'+i+'" of part "'+part+'" unloaded before loading');
								};
								Game.Music.Story[part][i].play = function() {
									console.log('Game.Music: Warning: Story track "'+i+'" of part "'+part+'" played without preloading');
									Game.Music.Story[part][i] = Game.Music.Load(file,true);
								}
							});
						}
					}
					console.log('Game.Music [anonymous]: Story music loaded');
				} catch(err) {
					console.log('Game.Music [anonymous]: Unable to load story music (JSON parse): '+err);
				}
			} else {
				console.log('Game.Music [anonymous]: Unable to load story music (AJAX request): '+request.statusText);
			}
		}
	};
	
	request.setRequestHeader("Cache-Control", "no-cache");
	request.send(null);
})();