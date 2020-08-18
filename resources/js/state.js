Game.State = {
	GetCurrent: function() {
		var state = {};
		state['State'] = {
			Time: Date.now(),
			GameVersion: Game.Version
		};

		state['Story'] = Game.Story;

		state['JS'] = [];
		for (let k in Game.JS.Loaded) {
			if (Game.JS.Engine.indexOf(k) == -1) {
				state['JS'].push(Game.JS.Loaded[k].src.replace(window.location.origin+'/resources/js/',''));
			}
		};

		state['Scripts'] = [];
		for (let k in Game.Dialogue.LoadedScripts) {
			if (Game.Dialogue.LoadedScripts.hasOwnProperty(k)) {
				state['Scripts'].push(k+'.json');
			}
		};

		state['Presence'] = [];
		for (let k in Game.Presence.Present) {
			if (Game.Presence.Present.hasOwnProperty(k)) {
				let p = Game.Presence.Present[k];
				state['Presence'].push({
					id: p.presenceID,
					img: p.src.replace(window.location.origin+'/resources/images/',''),
					onclick: p.dialogue,
					persist: p.persist
				})
			}
		}

		state['Place'] = Game.Place.Current['id'];

		state['Transcript'] = Game.Dialogue.Transcript;

		state['Music'] = {
			'Story': JSON.parse(JSON.stringify(Game.Music.Story)),
			'Tracks': []
		}
		for (let p in Game.Music.Story) {
			if (Game.Music.Story.hasOwnProperty(p)) {
				for (let t in Game.Music.Story[p]) {
					if (Game.Music.Story[p].hasOwnProperty(t)) {
						if (typeof Game.Music.Story[p][t] == 'object') {
							state['Music']['Story'][p][t] = Game.Music.Tracks.indexOf(Game.Music.Story[p][t]);
						}
					}
				}
			}
		}
		for (let k in Game.Music.Tracks) {
			if (Game.Music.Tracks.hasOwnProperty(k)) {
				let t = Game.Music.Tracks[k];
				let s = {};

				s.src = t.currentSrc.replace(window.location.origin+'/resources/music/','');
				s.playing = !t.paused;
				s.loop = t.loop;
				s.time = t.currentTime;

				state['Music']['Tracks'].push(s);
			}
		}

		return state;
	},
	Load: function(State) {
		Game.Splash.Show('Loading...');
		if (typeof State == 'string') {
			try {
				state = JSON.parse(State);
			} catch(e) {
				console.log('Game.State.Load: Unable to convert string to JSON: '+e);
				return;
			}
		}

		if (Game.Version != State.State.GameVersion) {
			if (!confirm('Save state GameVersion ('+State.State.GameVersion+') does not match game version ('+Game.Version+'). Continue loading?')) {
				Game.Splash.Hide();
				return;
			}
		}

		Game.Story = Object.assign(Game.Story,State.Story);

		State.Scripts.forEach(function(s) {
			Game.Dialogue.Load(s);
		});

		Game.Dialogue.Transcript = State.Transcript;

		State.Presence.forEach(function(p) {
			Game.Presence.Add(p.id,p.img,p.onclick,p.persist);
		});

		for (let i = 0; i < State.Music.Tracks.length; i++) {
			State.Music.Tracks[i] = Game.Music.Load(
				State.Music.Tracks[i]['src'],
				State.Music.Tracks[i]['playing'],
				State.Music.Tracks[i]['loop'],
				State.Music.Tracks[i]['time']
			);
		}
		for (let p in Game.Music.Story) {
			if (Game.Music.Story.hasOwnProperty(p)) {
				for (let t in Game.Music.Story[p]) {
					if (Game.Music.Story[p].hasOwnProperty(t)) {
						if (typeof State.Music.Story[p][t] == 'number') {
							Game.Music.Story[p][t] = State.Music.Tracks[State.Music.Story[p][t]];
						}
					}
				}
			}
		}

		State.JS.forEach(function(j) {
			Game.JS.Load(j);
		});

		Game.Place.Load(State.Place,true);

		console.log('Game.State.Load: Save state loaded from '+State.State.Time);
	},
	SaveFile: function(name) {
		var State = Game.State.GetCurrent();
		State.State.Name = name;

		var query = '?d=write';
		query += '&file='+encodeURIComponent(btoa(name));
		var body = 'contents='+btoa(JSON.stringify(State));

		var request = new XMLHttpRequest;
		request.open('POST','/saves/io.php'+query);
		request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		request.setRequestHeader("Cache-Control", "no-cache");
		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				if (request.status == 200) {
					if (request.responseText != '0') {
						console.log('Game.State.SaveFile: Successfully saved "'+name+'"');
					} else {
						console.log('Game.State.SaveFile: Error when saving "'+name+'": Write error');
					}
				} else {
					console.log('Game.State.SaveFile: Error when saving "'+name+'": '+request.statusText);
				}
			}
		}
		request.send(body);
	},
	LoadFile: function(name) {
		if (!Game.Place.Current) {
			var query = '?d=read';
			query += '&file='+encodeURIComponent(btoa(name));

			var request = new XMLHttpRequest;
			request.open('GET','/saves/io.php'+query);
			request.onreadystatechange = function() {
				if (request.readyState == 4) {
					if (request.status == 200) {
						var content = JSON.parse(atob(request.responseText));
						if (content) {
							Game.State.Load(content);
							console.log('Game.State.LoadFile: Successfully loaded "'+name+'"');
						} else {
							console.log('Game.State.LoadFile: Error when loading "'+name+'": Invalid response text');
						}
					} else {
						console.log('Game.State.LoadFile: Error when loading "'+name+'": '+request.statusText);
					}
				}
			}
			request.send();
		} else {
			window.location.href = '?save='+encodeURIComponent(name);
		}
	}
}