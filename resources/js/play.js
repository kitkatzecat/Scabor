
window.onbeforeunload = function() {
	return 'Are you sure you want to exit? Any unsaved progress will be lost!';
}

Game.Characters.Load('Rosemary');
Game.Characters.Load('Simon');
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

//Game.Room.Load('hall_test.svg');

Game.Sound.Load('click.mp3');

Game.Story.Now = 'Chapter1';

Game.Place.Load('2F_Rooms-Hall_1');