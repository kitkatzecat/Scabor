Game[Game.JS.GetName('events/Chapter2.js')] = {
	Init: function() {},
	'Presence': {
		'Lobby_Reaction': function () {
			Game.Presence.AddPerson('Rosemary','thinking','Chapter2.json@Presence_Rosemary_Lobby_Reaction');
			Game.Presence.AddPerson('Simon','surprised','Chapter2.json@Presence_Simon_Lobby_Reaction');
		},
		'Lobby_Poster': function() {
			Game.Presence.AddPerson('Rosemary','confused','Chapter2.json@Presence_Rosemary_Lobby_Poster');
			Game.Presence.AddPerson('Simon','deadpan','Chapter2.json@Presence_Simon_Lobby_Poster');
		}
	},
	'Enter_Lobby_Reaction': function() {
		setTimeout(function() {
			Game.Dialogue.Play('Chapter2.json','Enter_Lobby_Reaction');
		},500);
	},
	'Lobby_Leave': function() {
		Game.Place.BeforeEnter = function() {
			if (Game.Story.Progress['Chapter2']['Finished_Lobby'] !== true) {
				Game.Dialogue.Play('Chapter2.json','Lobby_Leave');
			} else {
				Game.Place.BeforeEnter = false;
				Game.Place.Enter();
			}
		}
	}
}