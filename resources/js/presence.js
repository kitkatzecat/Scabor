Game.Presence = {
	AddPerson: function(person,expression=false,onclick=function(){},persist=false) {
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
	Add: function(id,img,onclick=function(){},persist=false) {
		if (!persist) {
			persist = [Game.Place.Current['id']];
		}
		if (Game.Presence.Present.hasOwnProperty(id)) {
			Game.Presence.Present[id].remove();
		}
		
		var p = document.createElement('img');
		p.src = './resources/images/'+img;
		p.setSrc = function(imag) {p.src = './resources/images/'+imag;};
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
		p.onclick = onclick;
		p.onmouseover = function() {Game.Cursor.Set('dialogue');};
		p.onmouseout = function() {Game.Cursor.Hide();};
		p.className = 'presence_character';
		
		Game.Presence.Present[id] = p;
		Game.Presence.Composition.Container.appendChild(p);

		Game.Presence.Composition.Button.style.display = 'block';

		return p;
	},
	CheckPersist: function() {
		Game.Presence.HideAll();
		var object = Game.Presence.Present;
		for (var property in object) {
			if (object.hasOwnProperty(property)) {
				if (typeof object[property].persist != 'undefined' && object[property].persist.indexOf(Game.Place.Current['id']) != -1) {
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
	},
	IsPresent: function(id) {
		if (Game.Presence.Present.hasOwnProperty(id)) {
			return true;
		} else {
			return false;
		}
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
