Game.Sound = {
	Play: function(source) {
		Game.Loader.Show('sound__'+source);
		
		var audio = document.createElement("audio");
		audio.style.display = "none";
		audio.innerHTML = '<source src="./resources/sounds/'+source+'"></source>';

		document.body.appendChild(audio);
		
		audio.oncanplaythrough = function() {
			audio.play();
			Game.Loader.Hide('sound__'+source);
		};
		audio.onended = function() {
			this.parentNode.removeChild(this);
			Game.Loader.Hide('sound__'+source);
		};

	}
};