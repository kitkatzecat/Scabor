Game.CSS.Load('index.css');
Game.CSS.Load('game.css');
Game.CSS.Load('font.css');

Game.Index = {
	ButtonClick: function(button) {
		Game.Sound.Play('click.mp3');
		
		if (button == 'new_game') {
			var a = document.createElement('div');
			a.innerHTML = '<div class="ui_title font_title noselect">New Game</div><span class="noselect font_text">Enter a name for your character:</span><br><input type="text"><br><br><span class="noselect font_text">Choose your character\'s pronouns:</span><br><select><option selected disabled>Pick an option...</option><option>she/her/hers</option><option>he/him/his</option><option>they/them/theirs</option></select><br><br><div class="ui_button font_text noselect">Next</div><div onclick="Game.UI.Hide();Game.Sound.Play(\'click.mp3\');" class="ui_button font_text noselect">Back</div>';
			Game.UI.Show(a);
		} else if (button == 'load_game') {
			if (confirm('Open gametest?')) {
				Game.Splash.Show();
				setTimeout(function() {
					window.location.href = 'game.htm';
					Game.Splash.Hide();
				}, 400);
			}
		} else if (button == 'options') {
			var a = document.createElement('div');
			a.innerHTML = '<div class="ui_title font_title noselect">Options</div><div onclick="Game.UI.Hide();Game.Sound.Play(\'click.mp3\');" class="ui_button font_text noselect">Close</div>';
			Game.UI.Show(a);
		} else if (button == 'exit') {
			window.close();
		}
	},
	Init: function() {
		var body = document.createElement('div');
		body.className = 'menu_body';
		body.innerHTML = '<div id="menu_frame-container"><iframe id="menu_frame" src="./resources/cutscenes/menu.htm"></iframe></div><div id="menu_content"><span style="font-size:72px;color:#fff;text-shadow:0px 0px 8px #000;" class="font_title noselect">Scabor</span><div onclick="Game.Index.ButtonClick(\'new_game\');" class="font_text noselect menu_option">New Game</div><div onclick="Game.Index.ButtonClick(\'load_game\');" class="font_text noselect menu_option">Load Game</div><div onclick="Game.Index.ButtonClick(\'options\');" class="font_text noselect menu_option">Options</div><div onclick="Game.Index.ButtonClick(\'exit\');" class="font_text noselect menu_option">Exit</div></div>';
		document.body.appendChild(body);
		Game.CSS.Load('menu.css');
		Game.Sound.Load('click.mp3');
		Game.Music.Load('scabor3.mp3',true,true);
	}

}

//<div id="menu_background"></div><div id="menu_background_particles-back-dark"></div><div id="menu_background_particles-back-light"></div><div id="menu_background_particles-front-dark"></div><div id="menu_background_particles-front-light"></div>