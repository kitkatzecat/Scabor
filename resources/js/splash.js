Game.Splash = {
	Lock: false,
	Show: function(text='',background=false,animation='fade',z=200,skip=false) {
		if (!Game.Splash.Lock) {
			Game.Splash.ShowLock(text,background,animation,z,skip);
		}
	},
	ShowLock: function(text='',background=false,animation='fade',z=200,skip=false){
		Game.Splash.Animation = animation;
		if (!Game.Splash.Visible) {
			if (animation == 'fade') {
				Game.Splash.Container.className = 'splash_container noselect splash_container_animated_fade-open';
			} else if (animation == 'enter') {
				Game.Splash.Container.className = 'splash_container noselect splash_container_animated_enter-open';
			} else if (animation == 'leave') {
				Game.Splash.Container.className = 'splash_container noselect splash_container_animated_leave-open';
			} else if (Game.Splash.Animation == 'none') {
				Game.Splash.Container.className = 'splash_container noselect';
			} else {
				Game.Splash.Container.className = 'splash_container noselect splash_container_animated_fade-open';
				Game.Splash.Animation = 'fade';
			}
		}
		if (skip == true) {
			Game.Splash.Container.className = 'splash_container noselect';
		}
		Game.Splash.Text.innerHTML = text;
		Game.Splash.Container.style.display = '';
		Game.Splash.Container.style.zIndex = z;
		if (background) {
			if (background.indexOf('.svg') != -1) {
				Game.Splash.Container.style.backgroundImage = 'url("resources/splash/'+background+'")';
			} else {
				Game.Splash.Container.style.backgroundImage = background;
			}
		}
		Game.Splash.Visible = true;
		clearTimeout(Game.Splash.Timeout);
	},
	Hide: function() {
		if (!Game.Splash.Lock) {
			Game.Splash.HideLock();
		}
	},
	HideLock: function() {
		if (Game.Splash.Animation == 'fade') {
			Game.Splash.Container.className = 'splash_container noselect splash_container_animated_fade-close';
		} else if (Game.Splash.Animation == 'enter') {
			Game.Splash.Container.className = 'splash_container noselect splash_container_animated_enter-close';
		} else if (Game.Splash.Animation == 'leave') {
			Game.Splash.Container.className = 'splash_container noselect splash_container_animated_leave-close';
		} else if (Game.Splash.Animation == 'none') {
			Game.Splash.Container.className = 'splash_container noselect';
		} else {
			Game.Splash.Container.className = 'splash_container noselect splash_container_animated_fade-close';
		}
		Game.Splash.Timeout = setTimeout(function() {
			Game.Splash.Container.style.display = 'none';
			Game.Splash.Container.style.backgroundImage = 'none';
			Game.Splash.Container.className = 'splash_container noselect splash_container_animated_fade-open';
			Game.Splash.Visible = false;
		},300);
	},
	Visible: false,
	Animation: 'fade'
}
Game.Splash.Init = function() {
	Game.CSS.Load('splash.css');

	Game.Splash.Container = document.createElement('div');
	Game.Splash.Container.className = 'splash_container noselect splash_container_animated_fade-open';
	Game.Splash.Container.style.display = 'none';
	document.body.appendChild(Game.Splash.Container);

	Game.Splash.Text = document.createElement('div');
	Game.Splash.Text.className = 'splash_text font_title noselect';
	Game.Splash.Container.appendChild(Game.Splash.Text);
}
