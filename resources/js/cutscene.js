Game.Cutscene = {
	Showing: false,
	Play: function(source,fade=true,showbar=false) {
		if (!Game.Cutscene.Showing) {
			Game.Cursor.Hide();
			Game.Cutscene.Showing = true;
			document.body.appendChild(Game.Cutscene.Composition.Container);
			if (fade) {
				Game.Splash.Show();
			}

			Game.Loader.Show('cutscene');

			if (showbar) {
				Game.Cutscene.Composition.Container.style.zIndex = '95';
			} else {
				Game.Cutscene.Composition.Container.style.zIndex = '150';
			}

			setTimeout(function() {
				var d = new Date();
				var t = d.getTime();
				Game.Cutscene.Composition.Frame.src = './resources/cutscenes/'+source+'?t='+t;
			},500);
		} else {
			console.log('Game.Cutscene.Show: Another cutscene is already playing')
		}
	},
	End: function() {
		Game.Cutscene.Composition.Container.style.opacity = '0';
		setTimeout(function() {
			Game.Cutscene.Composition.Frame.src = '';
			Game.Cutscene.Composition.Frame.onload = function() {
				Game.Cutscene.Composition.Frame.onload = function() {Game.Cutscene.OnLoad();};
			}
			document.body.removeChild(Game.Cutscene.Composition.Container);
		},500);
		this.Loaded = false;
		Game.Cutscene.Showing = false;
	},
	Loaded: false,
	OnLoad: function() {
		if (!Game.Cutscene.Loaded) {
			Game.Cutscene.Composition.Container.style.opacity = '1';
			Game.When(function() {
				return (typeof Game.Cutscene.Composition.Frame.contentWindow.window.Load == 'function');
			},function() {
				Game.Cutscene.Composition.Frame.contentWindow.window.Cutscene = Game.Cutscene;
				try {
					Game.Cutscene.Composition.Frame.contentWindow.window.Load();
				} catch(e) {
					console.log('Game.Cutscene.OnLoad: Error while executing cutscene Load function: '+e);
					Game.Cutscene.Ready();
				}
			},500,50);
			Game.Cutscene.Loaded = true;
		}
	},
	Ready: function() {
		Game.Loader.Hide('cutscene');
		Game.Splash.Hide();
	},
	Composition: {},
	Init: function() {
		Game.Cutscene.Composition.Container = document.createElement('div');
		Game.Cutscene.Composition.Container.id = 'cutscene_container';

		Game.Cutscene.Composition.Frame = document.createElement('iframe');
		Game.Cutscene.Composition.Frame.id = 'cutscene_frame';
		Game.Cutscene.Composition.Frame.onload = function() {Game.Cutscene.OnLoad();};
		Game.Cutscene.Composition.Container.appendChild(Game.Cutscene.Composition.Frame);

		Game.CSS.Load('cutscene.css');
	}
}