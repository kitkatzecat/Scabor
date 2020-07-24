Game[Game.JS.GetName('events/Game.js')] = {
	Init: function() {},
	'Check_Keycard': function(color) {
		if (Game.Items.GetPlayerItemQuantity('Keycard_'+color) > 0) {
			return true;
		} else if (Game.Items.GetPlayerItemQuantity('Keycard_Master') > 0) {
			return true;
		} else {
			return false;
		}
	},
	'Interact_Keycard_Door': function(color,room,message1,message2="Should I go inside?") {
		if (!!message1) {
			Game.Dialogue.Line({Who:"Me",Text:message1});
		}
		if (Game['Events__Game']['Check_Keycard'](color)) {
			Game.Dialogue.Line({Who:"Me",Text:message2,Prompt:[{Text:"Yes",Function:function() {
				Game.Sound.Play('keycard-unlock.mp3');
				Game.Place.Load(room,true);
			}},{Text:"No",Function:false}]});
		} else {
			Game.Dialogue.Play('Doors.json','Locked');
		}
	},
	'Interact_Sign': function(text) {
		Game.Dialogue.Line({Who:'Me',Text:'There\'s a sign above this door.'});
		Game.Dialogue.Line({Who:'Me',Text:'It says "'+text+'" on it.'});
	},
	'Interact_Sign_Stairs': function(level=1,side='',up=true) {
		Game.Dialogue.Line({Who:'Me',Text:'There\'s two signs by these stairs.'});
		var current = level+side;
		if (level == 1) {
			current = level;
		}
		var next = '';
		var word = 'up';
		if (up) {
			next = (level+1)+side;
		} else {
			word = 'down';
			next = (level-1);
			if (next != 1) {
				next = next+side;
			}
		}
		Game.Dialogue.Line({Who:'Me',Text:'It looks like this is level '+current+', and these stairs go '+word+' to level '+next+'.'});
		if ((Game.Place.Current.id == '2L_Foyer_1' || Game.Place.Current.id == '2L_Foyer_2') && !Game.Story.Progress['Chapter1']['Interact_Sign_Stairs']) {
			Game.Dialogue.Line({Who:'Me',Text:'I wonder what the L stands for?'});
			Game.Story.Progress['Chapter1']['Interact_Sign_Stairs'] = true;
		}
	},
	'Interact_Air-Vent': function() {
		if (Game.Story.Progress['Chapter1']['Completed'] == false) {
			if (Game.Story.Progress['Chapter1']['Interact_Air-Vent'] == false) {
				Game.Dialogue.Play('Chapter1.json','Interact_Air-Vent_Initial');
				Game.Story.Progress['Chapter1']['Interact_Air-Vent'] = true;
			} else {
				Game.Dialogue.Play('Chapter1.json','Interact_Air-Vent_'+(Math.floor(Math.random() * 4) + 1));
			}
		} else {
			Game.Dialogue.Play('Game.json','Interact_Air-Vent');
		}
	},
	'Interact_Speaker': function() {
		if (Game.Story.Progress['Chapter1']['Interact_Speaker'] == false) {
			Game.Dialogue.Play('Game.json','Interact_Speaker_Initial');
			Game.Story.Progress['Chapter1']['Interact_Speaker'] = true;
		} else {
			Game.Dialogue.Play('Game.json','Interact_Speaker');
		}
	},
	'Interact_Keycard-Reader': function(color) {
		if (Game.Items.GetPlayerItemQuantity('Keycard_Red') > 0) {
			if (color == 'White') {
				Game.Dialogue.Line({Who:'Me',Text:'A keycard reader. It\'s unlocked.',Function:"Game.Splash.Show('','Keycard-Reader_"+color+".svg','enter',98);",Close:"Game.Splash.Hide()"});
			} else {
				Game.Dialogue.Line({Who:'Me',Text:'A keycard reader. It has a '+(color.toLowerCase())+' light lit on it.',Function:"Game.Splash.Show('','Keycard-Reader_"+color+".svg','enter',98);"});
				if (Game.Items.GetPlayerItemQuantity('Keycard_'+color) > 0) {
					Game.Dialogue.Line({Who:'Me',Text:'I can use the '+color+' Keycard that I have to open this door.',Close:"Game.Splash.Hide()"});
				} else if (Game.Items.GetPlayerItemQuantity('Keycard_Master') > 0) {
					Game.Dialogue.Line({Who:'Me',Text:'I can use the Master Keycard that I have to open this door.',Close:"Game.Splash.Hide()"});
				} else {
					Game.Dialogue.Line({Who:'Me',Text:'I don\'t have that color of keycard, so I can\'t open this door.',Close:"Game.Splash.Hide()"});
				}
			}
		} else {
			Game.Dialogue.Line({Who:'Me',Text:'A small electronic box with a slit in it... maybe it\'s for a keycard?',Function:"Game.Splash.Show('','Keycard-Reader_"+color+".svg','enter',98);"});
			if (color == 'White') {
				Game.Dialogue.Line({Who:'Me',Text:'It looks like there\'s a light on it, but it\'s off.',Close:"Game.Splash.Hide()"});
			} else {
				Game.Dialogue.Line({Who:'Me',Text:'It has a '+(color.toLowerCase())+' light lit on it.',Close:"Game.Splash.Hide()"});
			}
		}
	},
}