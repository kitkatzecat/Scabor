Game.Place = {
	Load: function(id,enter=false,delay=1) {
		var request = new XMLHttpRequest;
	
		request.open('GET', './resources/places/'+id+'.json', true);
		
		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				if (request.status == 200) {
					var result = request.responseText;
					try {
						result = JSON.parse(result);

						Game.Place.Next = result['default'];

						if (typeof result[Game.Story.Now] != 'undefined') {
							Object.assign(Game.Place.Next,result[Game.Story.Now]);
						}
						console.log('Game.Place.Load: Room "'+Game.Place.Next['id']+'" loaded');

						if (enter || !Game.Place.Current) {
							try {
								Game.Place.Enter(delay);
							} catch(e) {
								console.log('Game.Place.Enter (from Game.Place.Load): '+e);
							}
						}
					} catch(err) {
						console.log('Game.Place.Load: Unable to load room from '+id+' (JSON parse): '+err);
					}
				} else {
					console.log('Game.Place.Load: Unable to load room from '+id+' (AJAX request): '+request.statusText);
				}
			}
		};
		
		request.setRequestHeader("Cache-Control", "no-cache");
		request.send(null);
	},
	Enter: function(delay=1) {
		if (!Game.Place.Next == false) {
			var timeout = 0;
			if (!Game.Splash.Visible) {
				Game.Splash.Show();
				timeout = 500;
			}

			setTimeout(function() {
				Game.Place.Previous = Game.Place.Current;
				Game.Place.Current = Game.Place.Next;
				Game.Place.Next = false;
				Game.Bar.Room(Game.Place.Current['title']);
				Game.Room.Load(Game.Place.Current['room']);
				Game.Room.Compass.Set(Game.Place.Current['orientation']);
				Game.Place.Current['scripts'].forEach(element => {
					var script = element.substr(0,element.lastIndexOf('.')).replace('/','__');
					if (typeof Game.Dialogue.LoadedScripts[script] == 'undefined') {
						Game.Dialogue.Load(element);
					}
				});
				if (Game.Place.Previous != false) {
					Game.Place.Previous['js'].forEach(element => {
						var js = element.substr(0,element.lastIndexOf('.')).replace('/','__');
						js = js.charAt(0).toUpperCase() + js.slice(1)
						if (typeof Game.Place.Current[element] == 'undefined') {
							Game.JS.Unload(js);
						}
					});
				}
				Game.Place.Current['js'].forEach(element => {
					var js = element.substr(0,element.lastIndexOf('.')).replace('/','__');
					js = js.charAt(0).toUpperCase() + js.slice(1);
					if (typeof Game.JS.Loaded[js] == 'undefined') {
						Game.JS.Load(element);
					}
				});
		
				Game.Room.Loaded = function() {
					if (!Game.Splash.Visible) {
						Game.Splash.Show();
					}

					if (typeof Game.Place.Current['sound_from'] != 'undefined') {
						if (typeof Game.Place.Current['sound_from'][Game.Place.Previous['id']] != 'undefined') {
							try {
								Game.Sound.Play(Game.Place.Current['sound_from'][Game.Place.Previous['id']]);
							} catch(e) {
								console.log('Game.Place.Enter [Game.Room.Loaded]: Error playing sound_from for current place: '+e);
							}
						} else if (typeof Game.Place.Current['sound_from']['default'] != 'undefined') {
							try {
								Game.Sound.Play(Game.Place.Current['sound_from']['default']);
							} catch(e) {
								console.log('Game.Place.Enter [Game.Room.Loaded]: Error playing sound_from for current place: '+e);
							}
						}
					}
					if (typeof Game.Place.Current['background'] != 'undefined' && Game.Place.Current['background'] != false) {
						document.body.style.backgroundImage = "url('./resources/images/"+Game.Place.Current['background']+"')";
					} else {
						document.body.style.backgroundImage = 'none';
					}

					setTimeout(function(){
						Game.Splash.Animation = 'fade';
						Game.Splash.Hide();
						try {
							eval(Game.Place.Current['onload']);
						} catch(e) {
							console.log('Game.Place.Enter [Game.When anonymous]: Error evaluating "onload" of current place: '+e);
						}
					},(delay*1000));
				}
			},timeout);
		} else {
			console.log('Game.Place.Enter: No place loaded to enter');
		}
	},
	Previous: false,
	Current: false,
	Next: false
}