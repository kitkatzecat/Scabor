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
						console.log('Game.Place.Load: Room "'+result['default']['title']+'" loaded');

						Game.Place.Next = result['default'];

						if (typeof result[Game.Story.Now] != 'undefined') {
							Object.assign(Game.Place.Next,result[Game.Story.Now]);
						}

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
		var timeout = 0;
		if (!Game.Splash.Visible) {
			Game.Splash.Show();
			timeout = 500;
		}

		setTimeout(function() {
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
	
			Game.Room.Loaded = function() {
				if (!Game.Splash.Visible) {
					Game.Splash.Show();
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
	},
	Current: false,
	Next: false
}