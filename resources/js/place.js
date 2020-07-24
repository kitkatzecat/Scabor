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
						for (var key in result) {
							if (!result.hasOwnProperty(key)) continue;
				
							if (key.indexOf(Game.Story.Now) != -1 && key.indexOf(':') != -1) {
								var k = key.split(':');
								if (Game.Story.Progress[Game.Story.Now].hasOwnProperty(k[1])) {
									if (!!Game.Story.Progress[Game.Story.Now][k[1]]) {
										Object.assign(Game.Place.Next,result[key]);
									}
								}
							}
							if (key.indexOf(Game.Story.Now) != -1 && key.indexOf('!') != -1) {
								var k = key.split(':');
								if (!Game.Story.Progress[Game.Story.Now][k[1]] || !Game.Story.Progress[Game.Story.Now].hasOwnProperty(k[1])) {
									Object.assign(Game.Place.Next,result[key]);
								}
							}
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
	Enter: function(delay=1,splash=true) {
		if (!Game.Place.Next == false && Game.Place.BeforeEnter == false) {
			var timeout = 0;
			if (!Game.Splash.Visible && splash) {
				Game.Splash.Show();
				Game.Splash.Container.style.cursor = 'wait';
				timeout = 500;
			}

			setTimeout(function() {
				Game.Place.Previous = Game.Place.Current;
				Game.Place.Current = Game.Place.Next;
				Game.Place.Next = false;
				Game.Bar.Room(Game.Place.Current['title']);

				var pos = 50;
				if (typeof Game.Place.Current['position_from'] != 'undefined' && Game.Place.Current['position_from'] !== false) {
					if (typeof Game.Place.Current['position_from']['default'] != 'undefined') {
						pos = Game.Place.Current['position_from']['default'];
					}
					if (typeof Game.Place.Current['position_from'][Game.Place.Previous['id']] != 'undefined') {
						pos = Game.Place.Current['position_from'][Game.Place.Previous['id']];
					}
				}

				Game.Room.Load(Game.Place.Current['room'],pos);

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
							Game.JS.Unload(element);
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
					if (!Game.Splash.Visible && splash) {
						Game.Splash.Show();
						Game.Splash.Container.style.cursor = 'wait';
					}

					if (typeof Game.Place.Current['back'] != 'undefined' && !Game.Place.Current['back'] == false) {
						Game.Room.OnLeave = function() {
							Game.Place.Load(Game.Place.Current['back'],true);
						}
						Game.Room.Leave.Show();
					}

					if (typeof Game.Place.Previous['onleave'] != 'undefined' && Game.Place.Previous['onleave'] != false) {
						if (Array.isArray(Game.Place.Previous['onleave'])) {
							Game.Place.Previous['onleave'].forEach(function(s,i) {
								try {
									eval(s);
								} catch(e) {
									console.log('Game.Place.Enter [Game.When anonymous]: Error evaluating "onleave['+i+']" of current place: '+e);
								}
							});
						} else {
							try {
								eval(Game.Place.Previous['onleave']);
							} catch(e) {
								console.log('Game.Place.Enter [Game.When anonymous]: Error evaluating "onleave" of current place: '+e);
							}
						}
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

					if (typeof Game.Place.Current['boxes'] != 'undefined' && Game.Place.Current['boxes'] != false) {
						Game.Items.BoxIndex = Object.assign({},Game.Items.BoxBase,Game.Place.Current['boxes']);
					} else {
						Game.Items.BoxIndex = Object.assign({},Game.Items.BoxBase);
					}

					try {
						Game.Presence.CheckPersist();
					} catch(e) {
						console.log('Game.Place.Enter: Error calling Game.Presence.CheckPersist: '+e);
					}

					setTimeout(function(){
						if (splash) {
							Game.Splash.Animation = 'fade';
							Game.Splash.Hide();
							Game.Splash.Container.style.cursor = '';
						}
						if (typeof Game.Place.Current['onload'] != 'undefined' && Game.Place.Current['onload'] !== false) {
							if (Array.isArray(Game.Place.Current['onload'])) {
								Game.Place.Current['onload'].forEach(function(s,i) {
									try {
										eval(s);
									} catch(e) {
										console.log('Game.Place.Enter [Game.When anonymous]: Error evaluating "onload['+i+']" of current place: '+e);
									}
								});
							} else {
								try {
									eval(Game.Place.Current['onload']);
								} catch(e) {
									console.log('Game.Place.Enter [Game.When anonymous]: Error evaluating "onload" of current place: '+e);
								}
							}
						}
					},(delay*500));
				}
			},timeout);
		} else if (Game.Place.Next == false) {
			console.log('Game.Place.Enter: No place loaded to enter');
		} else if (typeof Game.Place.BeforeEnter == 'function') {
			try {
				Game.Place.BeforeEnter();
			} catch(e) {
				console.log('Game.Place.BeforeEnter: Error: '+e);
			}
		} else {
			console.log('Game.Place.Enter: An error occurred, attempting to fix and trying again...');
			Game.Place.BeforeEnter = false;
			Game.Place.Enter();
		}
	},
	BeforeEnter: false,
	Previous: false,
	Current: false,
	Next: false
}