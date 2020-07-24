Game.Presence = {
	AddPerson: function(person,expression=false,onclick='',persist=false) {
		if (typeof Game.Characters != 'undefined') {
			if (Game.Characters.Loaded.hasOwnProperty(person)) {
				var character = Game.Characters.Loaded[person];

				if (!expression) {
					var exp = 'characters/'+person+'/'+character['Expressions'][character['Default']];
				} else {
					if (character['Expressions'].hasOwnProperty(expression)) {
						var exp = 'characters/'+person+'/'+character['Expressions'][expression];
					} else {
						var exp = 'characters/'+person+'/'+character['Expressions'][character['Default']];
					}
				}
				return Game.Presence.Add(person,exp,onclick,persist);
			} else {
				console.log('Game.Presence.AddPerson: Character "'+person+'" is not loaded, unable to add presence');
			}
		} else {
			console.log('Game.Presence.AddPerson: Game.Characters is not initialized, unable to add presence');
		}
	},
	Add: function(id,img,onclick='',persist=false) {
		if (!persist) {
			persist = [Game.Place.Current['id']];
		}
		if (Game.Presence.IsPresent(id)) {
			for (let person in Game.Presence.Present) {
				if (person.indexOf(id) == 0) {
					persist.forEach(function(place) {
						if (Game.Presence.Present[person].persist.indexOf(place) != -1) {
							Game.Presence.Present[person].persist.splice(Game.Presence.Present[person].persist.indexOf(place),1);
						}
					});
					if (Game.Presence.Present[person].persist.length == 0) {
						Game.Presence.Present[person].remove();
					}
				}
			}
		}
		if (typeof onclick !== 'object' && typeof onclick !== 'string') {
			console.log('Game.Presence.Add: Error when adding person "'+id+'": onclick is not a valid Dialogue block')
			onclick = [{Who:"Error",Text:"Invalid dialogue block provided"}];
		}
		
		var p = document.createElement('img');
		p.src = '/resources/images/'+img;
		p.setSrc = function(imag) {p.src = '/resources/images/'+imag;};
		p.persist = persist;
		p.setPersist = function(per=false) {
			if (!per) {
				per = [Game.Place.Current['id']];
			}
			p.persist = per;
		}
		p.onmousedown = function() {
			p.style.animation = 'presence_character_click .2s ease-in-out 1';
			setTimeout(function() {
				p.style.animation = 'none';
			},250);
			Game.Sound.Play('click.mp3');
		}
		p.dialogue = onclick;
		p.onclick = function() {
			if (p.dialogue !== '' && p.dialogue !== false) {
				Game.Dialogue.ProcessBlock(p.dialogue);
			} 
		};
		p.onmouseover = function() {Game.Cursor.Set('dialogue');};
		p.onmouseout = function() {Game.Cursor.Hide();};
		p.className = 'presence_character';
		p.presenceID = id;

		var i = 0;
		while (Game.Presence.Present.hasOwnProperty(id+'_'+i)) {
			i++;
		}
		
		Game.Presence.Present[id+'_'+i] = p;
		Game.Presence.Composition.Container.appendChild(p);

		Game.Presence.Composition.Button.style.display = 'block';

		Game.Presence.CheckPersist();

		return p;
	},
	CheckPersist: function() {
		Game.Presence.HideAll();
		var object = Game.Presence.Present;
		for (var property in object) {
			if (object.hasOwnProperty(property)) {
				if (typeof object[property].persist != 'undefined' && Array.isArray(object[property].persist) && object[property].persist.indexOf(Game.Place.Current['id']) != -1) {
					Game.Presence.Show(property);
				} else if (typeof object[property].persist != 'undefined' && object[property].persist == true) {
					Game.Presence.Show(property);
				}
			}
		}
	},
	Show: function(id) {
		if (Game.Presence.Present.hasOwnProperty(id)) {
			Game.Presence.Present[id].style.display = 'inline-block';
		}
		Game.Presence.Composition.Button.style.display = 'inline-block';
	},
	ShowAll: function() {
		var object = Game.Presence.Present;
		for (var property in object) {
			if (object.hasOwnProperty(property)) {
				Game.Presence.Present[property].style.display = 'inline-block';
			}
		}
		Game.Presence.Composition.Button.style.display = 'block';
	},
	Hide: function(id) {
		if (Game.Presence.Present.hasOwnProperty(id)) {
			Game.Presence.Present[property].style.display = 'none';
		}
		var isEmpty = true;
		for(var key in Game.Presence.Present) {
			if(Game.Presence.Present.hasOwnProperty(key) && Game.Presence.Present[key].style.display == 'inline-block') {
				isEmpty = false;
			}
		}
		if (isEmpty) {
			Game.Presence.Composition.Button.style.display = 'none';
		}
	},
	HideAll: function() {
		var object = Game.Presence.Present;
		for (var property in object) {
			if (object.hasOwnProperty(property)) {
				Game.Presence.Present[property].style.display = 'none';
			}
		}
		Game.Presence.Composition.Button.style.display = 'none';
	},
	Clear: function(id) {
		if (Game.Presence.Present.hasOwnProperty(id)) {
			Game.Presence.Present[id].remove();
			delete Game.Presence.Present[id];
		}
		var isEmpty = true;
		for(var key in Game.Presence.Present) {
			if(Game.Presence.Present.hasOwnProperty(key) && Game.Presence.Present[key].style.display == 'inline-block') {
				isEmpty = false;
			}
		}
		if (isEmpty) {
			Game.Presence.Composition.Button.style.display = 'none';
		}
	},
	ClearAll: function() {
		var object = Game.Presence.Present;
		for (var property in object) {
			if (object.hasOwnProperty(property)) {
				Game.Presence.Present[property].remove();
				delete Game.Presence.Present[property];
			}
		}
		Game.Presence.Composition.Button.style.display = 'none';
		if (Game.Presence.Toggled) {
			Game.Presence.Toggle();
		}
	},
	IsPresent: function(id) {
		for (let p in Game.Presence.Present) {
			if (p.indexOf(id) == 0) {
				return true;
			}
		}
		return false;
	},
	Toggle: function() {
		if (Game.Presence.Toggled) {
			Game.Presence.Composition.Container.className = 'presence_container noselect';
			Game.Presence.Composition.Button.innerHTML = '<img style="width:28px;height:28px;pointer-events:none;" class="noselect" src="./resources/images/presence_arrow-down.svg" />';
			Game.Presence.Toggled = false;
		} else {
			Game.Presence.Composition.Container.className = 'presence_container presence_container-toggled noselect';
			Game.Presence.Composition.Button.innerHTML = '<img style="width:28px;height:28px;pointer-events:none;" class="noselect" src="./resources/images/presence_arrow-up.svg" />';
			Game.Presence.Toggled = true;
		}
	},
	Toggled: false,
	Present: {},
	Composition: {}
}

Game.Presence.Init = function() {
	Game.CSS.Load('presence.css');

	Game.Presence.Composition.Container = document.createElement('div');
	Game.Presence.Composition.Container.className = 'presence_container noselect';
	document.body.appendChild(Game.Presence.Composition.Container);

	Game.Presence.Composition.Button = document.createElement('div');
	Game.Presence.Composition.Button.className = 'presence_button noselect';
	Game.Presence.Composition.Button.onmouseup = function() {Game.Sound.Play('click.mp3');};
	Game.Presence.Composition.Button.onclick = Game.Presence.Toggle;
	Game.Presence.Composition.Button.innerHTML = '<img style="width:28px;height:28px;pointer-events:none;" class="noselect" src="./resources/images/presence_arrow-down.svg" />';
	Game.Presence.Composition.Button.style.display = 'none';
	document.body.appendChild(Game.Presence.Composition.Button);
}
