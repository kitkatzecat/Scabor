
window.onbeforeunload = function() {
	return 'Are you sure you want to exit? Any unsaved progress will be lost!';
}

Game.Play = {
	Init: function() {
		Game.Characters.Load('Rosemary');
		Game.Characters.Load('Simon');
		Game.Characters.Load('Adam');
		Game.Characters.Load('Me');
		Game.Characters.Load('Tutorial');
		
		//Game.Dialogue.Load('test.json');
		
		Game.When(function() {
			return Game.Characters.Loaded.hasOwnProperty('Me');
		}, function(r) {
			if (r) {
				Game.Characters.Loaded['Me']['Name'] = 'Makoto';
				Game.Story['Me']['Name'] = 'Makoto';
			}
		},500,10);
		
		Game.Sound.Load('click.mp3');
		
		//Game.Story.Now = 'Prologue';
		//Game.Story.Now = 'Chapter1';
		//Game.Story.Tutorial['Room_Leave'] = true;
		//Game.Story.Progress['Chapter1']['Interact_Lobby_Door'] = true;
		//Game.Story.Progress['Chapter1']['Find_Keycard'] = true;
		//Game.Story.Items.push('Keycard_Red');
		
		//Game.JS.Load('events/Chapter1.js');
		//Game.JS.Load('events/Game.js');
		
		//Game.Dialogue.Load('Game.json');
		//Game.Dialogue.Load('Doors.json');
		
		//Game.Place.Load('1_Foyer_2');
		
		//Game.Cutscene.Play('Prologue_0.htm')

		console.log('Game.Play.Init: Ready');
	}
}
