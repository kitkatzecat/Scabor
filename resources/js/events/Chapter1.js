Game[Game.JS.GetName('events/Chapter1.js')] = {
	Init: function() {},
	'Presence': {
		'Foyer-2L_Introduce': function() {
			// 2L Foyer
			Game.Presence.AddPerson('Rosemary','confused','Chapter1.json@Presence_Rosemary_Foyer-2L_Introduce',['2L_Foyer_1','2L_Foyer_2']);
			Game.Presence.AddPerson('Simon','thinking','Chapter1.json@Presence_Simon_Foyer-2L_Introduce',['2L_Foyer_1','2L_Foyer_2']);

			// 1 Foyer
			Game.Presence.AddPerson('Rosemary','grin','Chapter1.json@Presence_Rosemary_Foyer-1_Initial',['1_Foyer_1','1_Foyer_2']);
			Game.Presence.AddPerson('Simon','neutral','Chapter1.json@Presence_Simon_Foyer-1_Initial',['1_Foyer_1','1_Foyer_2']);
		},
		'Keycard': function() {
			// Offices
			Game.Presence.AddPerson('Rosemary','thinking','Chapter1.json@Presence_Rosemary_Offices',['1_Office-A','1_Office-B','1_Office-C','1_Office-D']);
			Game.Presence.AddPerson('Simon','deadpan','Chapter1.json@Presence_Simon_Offices',['1_Office-A','1_Office-B','1_Office-C','1_Office-D']);

			// 1 Foyer
			Game.Presence.AddPerson('Rosemary','neutral','Chapter1.json@Presence_Rosemary_Foyer-1',['1_Foyer_1','1_Foyer_2']);
			Game.Presence.AddPerson('Simon','thinking','Chapter1.json@Presence_Simon_Foyer-1',['1_Foyer_1','1_Foyer_2']);

			// Office Hall
			Game.Presence.AddPerson('Rosemary','neutral','Chapter1.json@Presence_Rosemary_Office-Hall',['1_Office-Hall_1','1_Office-Hall_2','1_Office-Hall_3','1_Office-Hall_4']);
			Game.Presence.AddPerson('Simon','thinking','Chapter1.json@Presence_Simon_Office-Hall',['1_Office-Hall_1','1_Office-Hall_2','1_Office-Hall_3','1_Office-Hall_4']);

			// Storage
			Game.Presence.AddPerson('Rosemary','deadpan','Chapter1.json@Presence_Rosemary_Storage',['1_Storage']);
			Game.Presence.AddPerson('Simon','neutral','Chapter1.json@Presence_Simon_Storage',['1_Storage']);
		}
	},
	'Start': function() {
		Game.Story.Now = 'Chapter1';
		Game.Story.Progress['Prologue']['Completed'] = true;
		Game.Music.Story['Chapter1'][0]();
		Game.Music.Story['Chapter1'][0].play();
		Game.Splash.Lock = false;
	},
	'Interact_Rooms-Hall_Door_Interior': function() {
		if (Game.Story.Now == 'Chapter1' && Game.Story.Progress['Chapter1']['Interact_Rooms-Hall_Door_Interior'] != true) {
			Game.Dialogue.Play('Chapter1.json','Interact_Rooms-Hall_Door_Interior');
		} else {
			Game.Dialogue.Play('Doors.json','2L_Rooms-Hall_Door_Interior');
		}
	},
	'Enter_Foyer-2L': function() {
		if (!Game.Story.Progress['Chapter1']['Interact_Rooms-Hall_Door_Interior']) {
			Game.Story.Progress['Chapter1']['Interact_Rooms-Hall_Door_Interior'] = true;
			Game.Splash.Show('','','fade',98)
			setTimeout(function() {
				Game.Dialogue.Play('Chapter1.json','Introduce_Rosemary-Simon');
			},2000);
		}
	},
	'Interact_Lobby_Door': function() {
		Game.Dialogue.Play('Doors.json','1_Lobby');
		/*
		if (Game.Story.Now == 'Chapter1' && Game.Story.Progress['Chapter1']['Interact_Lobby_Door'] != true) {
			Game.Story.Progress['Chapter1']['Interact_Lobby_Door'] = true;
			Game.Dialogue.Play('Chapter1.json','Interact_Lobby_Door_Initial');
		} else if (Game.Story.Now == 'Chapter1' && Game.Items.GetPlayerItemQuantity('Keycard_Red') == 0) {
			Game.Dialogue.Play('Chapter1.json','Interact_Lobby_Door_Find-Keycard')
		} else if (Game.Story.Now == 'Chapter1' && Game.Story.Progress['Chapter1']['Enter_Lobby'] != true) {
			Game.Dialogue.Play('Chapter1.json','Interact_Lobby_Door_Keycard');
		} else {
			Game['Events__Game']['Interact_Keycard_Door']('Red','1_Lobby','The lobby door.');
		}
		*/
	},
	'Leave_Foyer-2L': function() {
		Game.Place.BeforeEnter = function() {
			if (Game.Place.Next['id'] == '2L_Rooms-Hall_2') {
				Game.Dialogue.Play('Chapter1.json','Foyer-2L_Leave_Rooms');
			} else if (Game.Place.Next['id'] == '3L_Foyer_2') {
				Game.Dialogue.Play('Chapter1.json','Foyer-2L_Leave_Upstairs');
			} else {
				Game.Place.BeforeEnter = false;
				Game.Place.Enter();
			}
		}
	},
	'Leave_Office-Hall_1': function() {
		Game.Place.BeforeEnter = function() {
			if (Game.Place.Next['id'] == '1_Restroom') {
				Game.Dialogue.Play('Chapter1.json','Office-Hall_Leave_Restroom');
			} else {
				Game.Place.BeforeEnter = false;
				Game.Place.Enter();
			}
		}
	},
	'Leave_Foyer-1': function() {
		Game.Place.BeforeEnter = function() {
			if (Game.Place.Next['id'] == '2L_Foyer_1' && Game.Items.GetPlayerItemQuantity('Keycard_Red') == 0 && Game.Story['Progress']['Chapter1']['Interact_Lobby_Door']) {
					Game.Dialogue.Play('Chapter1.json','Foyer-1_Leave_Keycard');
			} else if (!(Game.Place.Next['id'] == '1_Lobby' || Game.Place.Next['id'] == '1_Foyer_2' || Game.Place.Next['id'] == '1_Foyer_1') && Game.Story.Progress['Chapter1']['Interact_Lobby_Door'] != true) {
				Game.Dialogue.Play('Chapter1.json','Foyer-1_Leave_Door');
			} else if (!(Game.Place.Next['id'] == '1_Lobby' || Game.Place.Next['id'] == '1_Foyer_2' || Game.Place.Next['id'] == '1_Foyer_1') && Game.Story.Progress['Chapter1']['Interact_Lobby_Door'] && Game.Story.Progress['Chapter1']['Find_Keycard']) {
				Game.Dialogue.Play('Chapter1.json','Foyer-1_Leave_Lobby');
			} else {
				Game.Place.BeforeEnter = false;
				Game.Place.Enter();
			}
		}
	},
	'Enter_Lobby_Initial': function() {
		Game.Splash.Show('','','fade',98);
		Game.Sound.Play('door-open.mp3');
		Game.Place.Load('1_Lobby');
		Game.JS.Load('events/Chapter2.js');
		setTimeout(function() {
			Game.Dialogue.Play('Chapter2.json','Enter_Lobby');
		},2500);
	},
	'Enter_Lobby': function() {
		Game.Story.Now = 'Chapter2';
		Game.Story.Progress['Chapter1']['Completed'] = true;
		Game.Music.Story['Chapter2'][0].play();
		Game['Events__Chapter2']['Enter_Lobby_Reaction']();
	}
}