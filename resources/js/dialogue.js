Game.Dialogue = {
	Visible: false,
	Who: false,
	Image: false,
	Text: false,
	Color: false,
	Sound: false,
	Prompt: false,
	OnClose: false,
	Queue: [],
	Previous: false,
	Speak: function(Input={Who:'Game.Dialogue.Speak: Input.Who not defined',Text:'Game.Dialogue.Speak: Input.Text not defined',Color:'#888',Image:false,Sound:false,Function:false,Prompt:false,Close:false}) {
		if (Game.Dialogue.Text != false) {
			Game.Dialogue.Queue.push(Input);
			Game.Dialogue.Composition.Button.className = 'dialogue_button dialogue_button_image-arrow-right font_title noselect';
		} else {
			if (Game.Dialogue.Visible == false) {
				Game.Dialogue.Open();
			}

			try {
				clearInterval(Game.Dialogue.Composition.TextAnimationInterval);
			} catch(e) {}
		
			Game.Dialogue.Composition.Bubble.innerHTML = ''
			Game.Dialogue.Composition.Title.innerHTML = '';
			Game.Dialogue.Composition.Title.style.backgroundColor = '';
			
			if (Input.Who !== Game.Dialogue.Previous.Who) {
				Game.Dialogue.Composition.Image.src = '';
				Game.Dialogue.Composition.Image.style.display = 'none';
			}
			
			Game.Dialogue.Text = Input.Text.replace('{character_name}',Game.Story['Me']['Name']);
			
			Game.Dialogue.Composition.TextAnimationCount = 0;
			Game.Dialogue.Composition.TextAnimationInterval = setInterval(function() {
				if (Game.Dialogue.Composition.TextAnimationCount < Game.Dialogue.Text.length) {
					Game.Dialogue.Composition.Bubble.insertAdjacentHTML('beforeend',Game.Dialogue.Text.substr(Game.Dialogue.Composition.TextAnimationCount,1));
					Game.Dialogue.Composition.TextAnimationCount++;
				} else {
					Game.Dialogue.Composition.Bubble.innerHTML = Game.Dialogue.Text;
					clearInterval(Game.Dialogue.Composition.TextAnimationInterval);
				}
			},10);
			
			Game.Dialogue.Who = Input.Who.replace('{character_name}',Game.Story['Me']['Name']);

			Game.Dialogue.Composition.Title.innerHTML = Game.Dialogue.Who;
			Game.Dialogue.Color = Input.Color;
			Game.Dialogue.Composition.Title.style.backgroundColor = Input.Color;
			
			console.log('[Dialogue] '+Input.Who+': '+Input.Text);
			
			if (typeof Input.Close !== 'undefined') {
				if (typeof Input.Close == 'string') {
					try {
						var f = new Function(Input.Close);
						Game.Dialogue.OnClose = f;
					} catch(e) {console.log('Game.Dialogue.Speak: Error while processing dialogue OnClose from string: '+e);}
				}
				if (typeof Input.Function == 'function') {
					Game.Dialogue.OnClose = Input.Close;
				}
			}
			
			if (Input.Sound != false && Input.Sound !== 'undefined') {
				try {
					Game.Sound.Play(Input.Sound);
					Game.Dialogue.Sound = Input.Sound;
				} catch(e) {
					Game.Dialogue.Sound = false;
					console.log('Game.Dialogue.Speak: Error while playing sound: '+e);
				}
			} else {
				Game.Dialogue.Sound = false;
			}
			
			/* Test - speech synthesis
			if (Input.Color == '#008' || Input.Color == '#080') {
				var utterance = new SpeechSynthesisUtterance(Input.Text);
				if (Input.Color == '#008') {
					utterance.voice = window.speechSynthesis.getVoices()[1];
				}
				if (Input.Color == '#080') {
					utterance.voice = window.speechSynthesis.getVoices()[2];
				}
				window.speechSynthesis.speak(utterance);
			}*/
			
			if (typeof Input.Function !== 'undefined') {
				if (typeof Input.Function == 'string') {
					try {
						var f = new Function(Input.Function);
						f();
					} catch(e) {console.log('Game.Dialogue.Speak: Error while processing dialogue function from string: '+e);}
				}
				if (typeof Input.Function == 'function') {
					try {
						Input.Function();
					} catch(e) {console.log('Game.Dialogue.Speak: Error while processing dialogue function: '+e);}
				}
			}
			
			if (typeof Input.Prompt !== 'undefined') {
				if (Array.isArray(Input.Prompt)) {
					Game.Dialogue.OpenPrompt(Input.Prompt);
				}
			}
			
			if (typeof Input.Image !== 'undefined' && Input.Image != false) {
				Game.Dialogue.Image = Input.Image;
				Game.Dialogue.Composition.Image.src = './resources/images/'+Input.Image;
				if (Game.Dialogue.Previous != false) {
					if (Input.Who !== Game.Dialogue.Previous.Who) {
						Game.Dialogue.Composition.Image.className = 'dialogue_image noselect';
						setTimeout(function() {
							Game.Dialogue.Composition.Image.className = 'dialogue_image dialogue_image_animated-open noselect';
							Game.Dialogue.Composition.Image.style.display = 'inline-block';
						},10);
					} else if (Input.Image !== Game.Dialogue.Previous.Image && Game.Dialogue.Previous.Image != false) {
						Game.Dialogue.Composition.Image.className = 'dialogue_image noselect';
						setTimeout(function() {
							Game.Dialogue.Composition.Image.className = 'dialogue_image dialogue_image_animated-change noselect';
							Game.Dialogue.Composition.Image.style.display = 'inline-block';
						},10);
					} else {
						Game.Dialogue.Composition.Image.style.display = 'inline-block';
					}
				} else {
					Game.Dialogue.Composition.Image.className = 'dialogue_image noselect';
					setTimeout(function() {
						Game.Dialogue.Composition.Image.className = 'dialogue_image dialogue_image_animated-open noselect';
						Game.Dialogue.Composition.Image.style.display = 'inline-block';
					},10);
				}
			} else {
				Game.Dialogue.Image = false;
				Game.Dialogue.Composition.Image.src = '';
				Game.Dialogue.Composition.Image.style.display = 'none';
			}
		}
		
		if (Game.Dialogue.Queue.length > 0) {
			Game.Dialogue.Composition.Button.className = 'dialogue_button dialogue_button_image-arrow-right font_title noselect';
		} else {
			Game.Dialogue.Composition.Button.className = 'dialogue_button dialogue_button_image-check font_title noselect';
		}
	},
	SkipTextAnimation: function() {
		if (Game.Dialogue.Text != false) {
			clearInterval(Game.Dialogue.Composition.TextAnimationInterval);
			Game.Dialogue.Composition.Bubble.innerHTML = Game.Dialogue.Text;
		}
	},
	OpenPrompt: function(options) {
		Game.Dialogue.Composition.PromptContainer.className = 'dialogue_prompt dialogue_prompt_animated-open font_text noselect';
		Game.Dialogue.Composition.PromptContainer.style.display = '';
		Game.Dialogue.Composition.Button.style.display = 'none';
		Game.Dialogue.Next = function() {};
		
		Game.Dialogue.Prompt = [];
		
		for (var i = 0; i < options.length; i++) {
			Game.Dialogue.Prompt[i] = document.createElement('div');
			Game.Dialogue.Prompt[i].className = "dialogue_prompt_option font_text noselect";
			Game.Dialogue.Prompt[i].innerHTML = options[i]['Text'];
			Game.Dialogue.Prompt[i].option = options[i];
			Game.Dialogue.Prompt[i].onclick = function() {
				Game.Sound.Play('click.mp3');
				
				try {
					if (typeof this.option['Function'] == 'string') {
						try {
							var f = new Function(this.option['Function']);
							f();
						} catch(e) {console.log('Game.Dialogue.OpenPrompt (option.onclick): Error while processing prompt function from string: '+e);}
						Game.Dialogue.ClosePrompt();
						setTimeout(function() {
							Game.Dialogue.Next();
						}, 500);
					} else  if (typeof this.option['Function'] == 'function') {
						try {
							this.option['Function']();
						} catch(e) {console.log('Game.Dialogue.OpenPrompt (option.onclick): Error while processing prompt function: '+e);}
						Game.Dialogue.ClosePrompt();
						setTimeout(function() {
							Game.Dialogue.Next();
						}, 500);
					} else  if (this.option['Function'] == false) {
						if (Game.Dialogue.Queue.length < 1) {
							Game.Dialogue.Close();
						}
					} else {
						Game.Dialogue.ClosePrompt();
						setTimeout(function() {
							Game.Dialogue.Next();
						}, 500);
					}
				} catch(e) {console.log('Game.Dialogue.OpenPrompt (option.onclick): Error while processing prompt function: '+e);}
			}
			Game.Dialogue.Composition.PromptContainer.appendChild(Game.Dialogue.Prompt[i]);
		}
	},
	ClosePrompt: function() {
		Game.Dialogue.Composition.PromptContainer.className = 'dialogue_prompt dialogue_prompt_animated-close font_text noselect';
		Game.Dialogue.Composition.Button.style.display = '';
		Game.Dialogue.Prompt = false;
		Game.Dialogue.Composition.PromptContainer.style.pointerEvents = 'none';
	
		setTimeout(function(){
			Game.Dialogue.Composition.PromptContainer.className = 'dialogue_prompt dialogue_prompt_animated-open font_text noselect';
			Game.Dialogue.Composition.PromptContainer.style.display = 'none';
			Game.Dialogue.Composition.PromptContainer.style.pointerEvents = '';
			Game.Dialogue.Composition.PromptContainer.innerHTML = '';
			Game.Dialogue.Next = Game.Dialogue.NextForce;
		},500);
	},
	Next: function() {},
	NextForce: function() {
		if (typeof Game.Dialogue.OnClose == 'function') {
			try {
				Game.Dialogue.OnClose();
			} catch(e) {'Game.Dialogue.NextForce: Error while executing dialogue OnClose: '+e}
			Game.Dialogue.OnClose = false;
		} else {
			Game.Dialogue.OnClose = false;
		}
		if (Game.Dialogue.Queue.length > 0) {
			Game.Dialogue.Previous = {Who:Game.Dialogue.Who,Text:Game.Dialogue.Text,Image:Game.Dialogue.Image,Color:Game.Dialogue.Color,Sound:Game.Dialogue.Sound};
			
			Game.Dialogue.Who = false;
			Game.Dialogue.Image = false;
			Game.Dialogue.Text = false;
			Game.Dialogue.Color = false;
			Game.Dialogue.Sound = false;
			
			Game.Dialogue.Speak(Game.Dialogue.Queue.shift());
		} else {
			Game.Dialogue.Close();
		}
	},
	Open: function() {
		document.body.appendChild(Game.Dialogue.Composition.Background);
		document.body.appendChild(Game.Dialogue.Composition.Container);
		Game.Dialogue.Visible = true;
		
		try {
			Game.Room.Movement.SetSpeed(0);
			Game.Room.Movement.Locked = true;
		} catch(e) {
			console.log('Game.Dialogue.Open: Error while setting room movement: '+e);
		}
	},
	Close: function() {
		try {
			clearInterval(Game.Dialogue.Composition.TextAnimationInterval);
		} catch(e) {}
		Game.Dialogue.Composition.Bubble.innerHTML = Game.Dialogue.Text;
		
		Game.Dialogue.Who = false;
		Game.Dialogue.Image = false;
		Game.Dialogue.Text = false;
		Game.Dialogue.Color = false;
		Game.Dialogue.Sound = false;
		Game.Dialogue.Previous = false;
		
		Game.Dialogue.Text = true;
		Game.Dialogue.Visible = false;
		Game.Dialogue.Composition.Container.className = 'dialogue_container dialogue_container_animated-close font_text noselect';
		Game.Dialogue.Composition.Background.className = 'dialogue_background dialogue_background_animated-close font_text noselect';
		Game.Dialogue.Composition.Image.className = 'dialogue_image dialogue_image_animated-close noselect';
		
		Game.Dialogue.ClosePrompt();
		
		setTimeout(function(){
			Game.Dialogue.Composition.Container.parentNode.removeChild(Game.Dialogue.Composition.Container);
			Game.Dialogue.Composition.Container.className = 'dialogue_container dialogue_container_animated-open font_text noselect';
			
			Game.Dialogue.Composition.Background.parentNode.removeChild(Game.Dialogue.Composition.Background);
			Game.Dialogue.Composition.Background.className = 'dialogue_background dialogue_background_animated-open font_text noselect';
			
			Game.Dialogue.Composition.Image.style.display = 'none';
			Game.Dialogue.Composition.Image.className = 'dialogue_image noselect';
	
			Game.Dialogue.Composition.Bubble.innerHTML = ''
			Game.Dialogue.Composition.Title.innerHTML = '';
			Game.Dialogue.Composition.Title.style.backgroundColor = '';
			
			try {
				Game.Room.Movement.Locked = false;
			} catch(e) {
				console.log('Game.Dialogue.Open: Error while setting room movement: '+e);
			}
			
			Game.Dialogue.Text = false;
			if (Game.Dialogue.Queue.length > 0) {
				Game.Dialogue.Speak(Game.Dialogue.Queue.shift());
			}
		},500);
	},
	Load: function(file,id=false) {
		Game.Loader.Show('dialogue');
		Game.Dialogue.Composition.Request = new XMLHttpRequest;
		Game.Dialogue.Composition.RequestURI = file;
		Game.Dialogue.Composition.RequestID = id;
		
		if (id != false && Game.Dialogue.Visible == false) {
			document.body.appendChild(Game.Dialogue.Composition.Background);
		}
		
	    Game.Dialogue.Composition.Request.open('GET', 'resources/scripts/'+file, true);
	    Game.Dialogue.Composition.Request.onreadystatechange = Game.Dialogue.Response;
	    Game.Dialogue.Composition.Request.setRequestHeader("Cache-Control", "no-cache");
	    Game.Dialogue.Composition.Request.send(null);
	},
	Response: function() {
		if (Game.Dialogue.Composition.Request.readyState == 4) {
			if (Game.Dialogue.Composition.Request.status == 200) {
				var result = Game.Dialogue.Composition.Request.responseText;
				try {
					result = JSON.parse(result);
					if (Game.Dialogue.Composition.RequestID != false) {
						for (var i = 0; i < result[Game.Dialogue.Composition.RequestID].length; i++) {
							Game.Dialogue.Line(result[Game.Dialogue.Composition.RequestID][i]);
						}
						console.log('Game.Dialogue.Response: Loaded script "'+Game.Dialogue.Composition.RequestURI+'" for action "'+Game.Dialogue.Composition.RequestID+'"');
					} else {
						Game.Dialogue.LoadedScripts[Game.Dialogue.Composition.RequestURI.substr(0,Game.Dialogue.Composition.RequestURI.lastIndexOf('.')).replace('/','__')] = result;
						console.log('Game.Dialogue.Response: Loaded script "'+Game.Dialogue.Composition.RequestURI+'" as "'+Game.Dialogue.Composition.RequestURI.substr(0,Game.Dialogue.Composition.RequestURI.lastIndexOf('.')).replace('/','__')+'"');
					}
				} catch(err) {
					console.log('Game.Dialogue.Response: Unable to load script from "'+Game.Dialogue.Composition.RequestURI+'": '+err);
				}
			} else {
				console.log('Game.Dialogue.Response: Unable to load script from "'+Game.Dialogue.Composition.RequestURI+'": '+Game.Dialogue.Composition.Request.statusText);
			}
		}
		Game.Loader.Hide('dialogue');
	},
	Play: function(file,id) {
		Game.Loader.Show('dialogue');
		var filevar = file.substr(0,file.lastIndexOf('.')).replace('/','__');
		if (typeof Game.Dialogue.LoadedScripts[filevar] !== 'undefined') {
			if (typeof Game.Dialogue.LoadedScripts[filevar][id] !== 'undefined') {
				for (var i = 0; i < Game.Dialogue.LoadedScripts[filevar][id].length; i++) {
					Game.Dialogue.Line(Game.Dialogue.LoadedScripts[filevar][id][i]);
					Game.Loader.Hide('dialogue');
				}
			}
		} else {
			Game.Dialogue.Load(file,id);
		}
	},
	Line: function(script) {
		if (typeof Game.Characters != 'undefined') {
			if (Game.Characters.Loaded.hasOwnProperty(script['Who'])) {
				//console.log('Game.Dialogue.Line: Character "'+script['Who']+'" is loaded');
				var character = Game.Characters.Loaded[script['Who']];
				var dialogue = {};

				dialogue['Who'] = character['Name'];
				dialogue['Color'] = character['Color'];
				if (script.hasOwnProperty('Sound') && script['Sound'] != false) {
					dialogue['Sound'] = script['Sound'];
				} else {
					if (Game.Dialogue.Queue.length > 0) {
						if (Game.Dialogue.Queue[Game.Dialogue.Queue.length-1]['Who'] == dialogue['Who']) {
							dialogue['Sound'] = false;
						} else {
							dialogue['Sound'] = character['Sound'];
						}
					} else if (Game.Dialogue.Text != false) {
						if (Game.Dialogue.Who == dialogue['Who']) {
							dialogue['Sound'] = false;
						} else {
							dialogue['Sound'] = character['Sound'];
						}
					} else {
						dialogue['Sound'] = character['Sound'];
					}
				}
				if (script.hasOwnProperty('Expression')) {
					if (!script['Expression']) {
						var exp = character['Expressions'][character['Default']];
					} else {
						if (character['Expressions'].hasOwnProperty(script['Expression'])) {
							var exp = character['Expressions'][script['Expression']];
						} else {
							var exp = character['Expressions'][character['Default']];
						}
					}
				}
				if (!!exp) {
					dialogue['Image'] = 'characters/'+character['ID']+'/'+exp;
				} else {
					if (typeof script['Image'] != 'undefined') {
						dialogue['Image'] = script['Image'];
					} else {
						dialogue['Image'] = false;
					}
				}

				var speak = Object.assign({}, script, dialogue);
				Game.Dialogue.Speak(speak);
			} else {
				console.log('Game.Dialogue.Line: [Warning] Character "'+script['Who']+'" is not loaded. Speaking line directly.');
				Game.Dialogue.Speak(script);
			}
		} else {
			console.log('Game.Dialogue.Line: [Warning] Game.Characters is not initialized. Speaking line directly.');
			Game.Dialogue.Speak(script);
		}
	},
	LoadedScripts: {},
	Composition: {}
};

Game.Dialogue.Init = function() {
	Game.CSS.Load('dialogue.css');

	Game.Dialogue.Next = Game.Dialogue.NextForce;

	Game.Dialogue.Composition.Container = document.createElement('div');
	Game.Dialogue.Composition.Container.className = 'dialogue_container dialogue_container_animated-open font_text noselect';
	
	Game.Dialogue.Composition.Background = document.createElement('div');
	Game.Dialogue.Composition.Background.className = 'dialogue_background dialogue_background_animated-open font_text noselect';
	
	Game.Dialogue.Composition.Image = document.createElement('img');
	Game.Dialogue.Composition.Image.className = 'dialogue_image noselect';
	Game.Dialogue.Composition.Image.style.display = 'none';
	
	Game.Dialogue.Composition.Bubble = document.createElement('div');
	Game.Dialogue.Composition.Bubble.className = 'dialogue_bubble font_text noselect';
	Game.Dialogue.Composition.Bubble.onclick = Game.Dialogue.SkipTextAnimation;
	
	Game.Dialogue.Composition.Title = document.createElement('div');
	Game.Dialogue.Composition.Title.className = 'dialogue_title font_title noselect';
	
	Game.Dialogue.Composition.Button = document.createElement('div');
	Game.Dialogue.Composition.Button.className = 'dialogue_button dialogue_button_image-check font_title noselect';
	Game.Dialogue.Composition.Button.onclick = Game.Dialogue.Next;
	
	Game.Dialogue.Composition.PromptContainer = document.createElement('div');
	Game.Dialogue.Composition.PromptContainer.className = 'dialogue_prompt dialogue_prompt_animated-open font_text noselect';
	Game.Dialogue.Composition.PromptContainer.style.display = 'none';
	
	document.body.appendChild(Game.Dialogue.Composition.Image);
	Game.Dialogue.Composition.Container.appendChild(Game.Dialogue.Composition.Bubble);
	Game.Dialogue.Composition.Container.appendChild(Game.Dialogue.Composition.Button);
	Game.Dialogue.Composition.Container.appendChild(Game.Dialogue.Composition.Title);
	document.body.appendChild(Game.Dialogue.Composition.PromptContainer);
	
	document.addEventListener("keyup", function(e) {
		if (e.keyCode == 13) {
			Game.Dialogue.Next();
			e.preventDefault();
		}
	});
}