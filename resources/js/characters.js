Game.Characters = {
	Load: function(source) {
		var request = new XMLHttpRequest;
	
		request.open('GET', './resources/characters/'+source+'.json', true);
		
		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				if (request.status == 200) {
					var result = request.responseText;
					try {
						result = JSON.parse(result);
						Game.Characters.Loaded[result['ID']] = result;
						try {
							Game.Sound.Load(result['Sound']);
						} catch(e) {
							console.log('Game.Characters.Load: Game.Sound.Load error: '+e);
						}
						console.log('Game.Characters.Load: Loaded character "'+result['Name']+'" from "'+source+'.json" as "'+result['ID']+'"');
					} catch(err) {
						console.log('Game.Characters.Load: Unable to load character from "'+source+'.json" (JSON parse): '+err);
					}
				} else {
					console.log('Game.Characters.Load: Unable to load character from "'+source+'.json" (AJAX request): '+request.statusText);
				}
			}
		};
		
		request.setRequestHeader("Cache-Control", "no-cache");
		request.send(null);
	},
	Loaded: {},
	UnloadAll: function() {
		for (var key in Game.Characters.Loaded) {
			if (Game.Characters.Loaded.hasOwnProperty(key)) {
				delete Game.Characters.Loaded[key];
			}
		}
	},
	Unload: function(source) {
		if (Game.Characters.Loaded.hasOwnProperty(source)) {
			delete Game.Characters.Loaded[source];
		} else {
			console.log('Game.Characters.Unload: failed to unload "'+source+'": object is undefined');
		}
	}
}
