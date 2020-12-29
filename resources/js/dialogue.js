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
			if (Game.Dialogue.Prompt == false) {
				Game.Dialogue.Composition.ContainerBackground.Cursor = 'arrow';
			}
		} else {
			if (Game.Dialogue.Visible == false) {
				Game.Dialogue.Open();
			}
		
			if (Game.Dialogue.Queue.length > 0) {
				Game.Dialogue.Composition.Button.className = 'dialogue_button dialogue_button_image-arrow-right font_title noselect';
				Game.Dialogue.Composition.ContainerBackground.Cursor = 'arrow';
			} else {
				Game.Dialogue.Composition.Button.className = 'dialogue_button dialogue_button_image-check font_title noselect';
				Game.Dialogue.Composition.ContainerBackground.Cursor = 'check';
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
			Game.Dialogue.Composition.TextAnimationCharacters = [];
			for (let i = 0; i < Game.Dialogue.Text.length; i++) {
				let c = document.createElement('span');
				c.className = 'dialogue_character font_text';
				c.innerHTML = Game.Dialogue.Text.charAt(i);
				Game.Dialogue.Composition.TextAnimationCharacters.push(c);
				Game.Dialogue.Composition.Bubble.appendChild(c);
			}
			Game.Dialogue.Composition.TextAnimationInterval = setInterval(function() {
				if (Game.Dialogue.Composition.TextAnimationCount < Game.Dialogue.Text.length) {
					Game.Dialogue.Composition.TextAnimationCharacters[Game.Dialogue.Composition.TextAnimationCount].style.opacity = '1';
					Game.Dialogue.Composition.TextAnimationCount++;
				} else {
					Game.Dialogue.Composition.TextAnimationCharacters.forEach(function(c) {
						c.style.opacity = '1';
					});
					clearInterval(Game.Dialogue.Composition.TextAnimationInterval);
				}
			},7);
			
			Game.Dialogue.Who = Input.Who.replace('{character_name}',Game.Story['Me']['Name']);

			Game.Dialogue.Composition.Title.innerHTML = Game.Dialogue.Who;
			Game.Dialogue.Color = Input.Color;
			Game.Dialogue.Composition.Title.style.backgroundColor = Input.Color;
			
			console.log('[Dialogue] '+Input.Who+': '+Input.Text);
			
			if (typeof Input.Set !== 'undefined' && Input.Set != false) {
				let i = Input.Set;
				if (!Array.isArray(Input.Set)) {
					i = [Input.Set];
				}
				i.forEach(function(v) {
					let k = [v];
					let val = true;
					let c = Game.Story.Now;

					if (v.indexOf('!') != -1) {
						k = v.split('!');
						val = false;
					}
					if (v.indexOf(':') != -1) {
						k = v.split(':');
						val = true;
					}

					if (k.length == 2) {
						c = k[0];
						k[0] = k[1];
					}

					Game.Story.Progress[c][k[0]] = val;
				});
			}

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
			if (typeof Input['Play'] !== 'undefined') {
				Game.Dialogue.ProcessBlock(Input['Play'],Input['File']);
			}
		
			if (typeof Input.Prompt !== 'undefined') {
				if (Array.isArray(Input.Prompt)) {
					Game.Dialogue.OpenPrompt(Input.Prompt,Input);
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

			Game.Dialogue.Transcript.push(Input);
			if (Game.Dialogue.Transcript.length > 30) {
				Game.Dialogue.Transcript.shift();
			}
		}
	},
	SkipTextAnimation: function() {
		if (Game.Dialogue.Text != false) {
			clearInterval(Game.Dialogue.Composition.TextAnimationInterval);
			Game.Dialogue.Composition.Bubble.innerHTML = Game.Dialogue.Text;
		}
	},
	OpenPrompt: function(options,line) {
		Game.Dialogue.Composition.PromptContainer.className = 'dialogue_prompt dialogue_prompt_animated-open font_text noselect';
		Game.Dialogue.Composition.PromptContainer.style.display = '';
		Game.Dialogue.Composition.Button.style.display = 'none';
		Game.Dialogue.Composition.ContainerBackground.Cursor = 'question';
		Game.Dialogue.Next = function() {};
		
		Game.Dialogue.Prompt = [];
		
		for (var i = 0; i < options.length; i++) {
			Game.Dialogue.Prompt[i] = document.createElement('div');
			Game.Dialogue.Prompt[i].className = "dialogue_prompt_option font_text noselect";
			Game.Dialogue.Prompt[i].innerHTML = options[i]['Text'];
			Game.Dialogue.Prompt[i].option = options[i];
			Game.Dialogue.Prompt[i].onclick = function() {
				Game.Sound.Play('click.mp3');

				if (typeof this.option['Set'] !== 'undefined' && this.option['Set'] != false) {
					let i = this.option['Set'];
					if (!Array.isArray(this.option['Set'])) {
						i = [this.option['Set']];
					}
					i.forEach(function(v) {
						let k = [v];
						let val = true;
						let c = Game.Story.Now;
	
						if (v.indexOf('!') != -1) {
							k = v.split('!');
							val = false;
						}
						if (v.indexOf(':') != -1) {
							k = v.split(':');
							val = true;
						}
	
						if (k.length == 2) {
							c = k[0];
							k[0] = k[1];
						}
	
						Game.Story.Progress[c][k[0]] = val;
					});
				}
					
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

				if (typeof this.option['Play'] !== 'undefined') {
					Game.Dialogue.ProcessBlock(this.option['Play'],line['File']);
				}
			}
			Game.Dialogue.Composition.PromptContainer.appendChild(Game.Dialogue.Prompt[i]);
		}
	},
	ClosePrompt: function() {
		Game.Dialogue.Composition.PromptContainer.className = 'dialogue_prompt dialogue_prompt_animated-close font_text noselect';
		Game.Dialogue.Composition.ContainerBackground.Cursor = 'check';
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
		Game.Dialogue.Composition.ContainerBackground.Cursor = 'arrow';
		
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
			try {
				Game.Dialogue.Composition.Container.parentNode.removeChild(Game.Dialogue.Composition.Container);
				Game.Dialogue.Composition.Container.className = 'dialogue_container dialogue_container_animated-open font_text noselect';
			} catch(e) {}
			
			try {
				Game.Dialogue.Composition.Background.parentNode.removeChild(Game.Dialogue.Composition.Background);
				Game.Dialogue.Composition.Background.className = 'dialogue_background dialogue_background_animated-open font_text noselect';
			} catch(e) {}
			
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
		},490);
	},
	Load: function(file,id=false) {
		Game.Loader.Show('dialogue');
		let Request = new XMLHttpRequest;
		let RequestURI = file;
		let RequestID = id;
		
		if (id != false && Game.Dialogue.Visible == false) {
			document.body.appendChild(Game.Dialogue.Composition.Background);
		}
		
		Request.open('GET', 'resources/scripts/'+file, true);
		Request.onreadystatechange = function() {
			if (Request.readyState == 4) {
				if (Request.status == 200) {
					var result = Request.responseText;
					try {
						result = JSON.parse(result);
						if (RequestID != false) {
							if (result.hasOwnProperty(RequestID)) {
								Game.Loader.Hide('dialogue');
								Game.Dialogue.ProcessBlock(result[RequestID],RequestURI);
								console.log('Game.Dialogue.Load (Response): Loaded script "'+RequestURI+'" for action "'+RequestID+'"');
							} else {
								Game.Loader.Hide('dialogue');
								Game.Dialogue.ProcessBlock(false,RequestURI);
								console.log('Game.Dialogue.Load (Response): Loaded script "'+RequestURI+'" successfully, but action "'+RequestID+'" does not exist');
							}
						} else {
							Game.Dialogue.LoadedScripts[RequestURI.substr(0,RequestURI.lastIndexOf('.')).replace('/','__')] = result;
							console.log('Game.Dialogue.Load (Response): Loaded script "'+RequestURI+'" as "'+RequestURI.substr(0,RequestURI.lastIndexOf('.')).replace('/','__')+'"');
						}
					} catch(err) {
						console.log('Game.Dialogue.Load (Response): Unable to load script from "'+RequestURI+'": '+err);
					}
				} else {
					console.log('Game.Dialogue.Load (Response): Unable to load script from "'+RequestURI+'": '+Request.statusText);
				}
			}
			Game.Loader.Hide('dialogue');
		};
		Request.setRequestHeader("Cache-Control", "no-cache");
		Request.send(null);
	},
	Play: function(file,id) {
		Game.Loader.Show('dialogue');
		var filevar = file.substr(0,file.lastIndexOf('.')).replace('/','__');
		if (typeof Game.Dialogue.LoadedScripts[filevar] !== 'undefined') {
			if (typeof Game.Dialogue.LoadedScripts[filevar][id] !== 'undefined') {
				Game.Loader.Hide('dialogue');
				Game.Dialogue.ProcessBlock(Game.Dialogue.LoadedScripts[filevar][id],file);
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
	ProcessBlock: function(block,file='') {
		if (typeof block == 'object') {
			if (Array.isArray(block)) {
				if (block.length == 0) {
					if (!Game.Dialogue.Visible) {
						Game.Dialogue.Composition.Background.remove();
					}
				} else if (block.every(function(e) {
					return (typeof e == 'object' && !Array.isArray(e));
				})) {
					block.forEach(function(l) {
						l['File'] = file;
						Game.Dialogue.Line(l);
					});
				} else {
					let r = Math.ceil(Math.random()*block.length)-1;
					Game.Dialogue.ProcessBlock(block[r],file);
				}
			} else {
				let p = 'default';
				if (typeof block[Game.Story.Now] != 'undefined') {
					p = Game.Story.Now;
				}
				for (let key in block) {
					if (!block.hasOwnProperty(key)) continue;

					if ((key.indexOf(Game.Story.Now) != -1 || key.substring(0,1) == '&') && key.indexOf(':') != -1) {
						progress = Game.Story.Now;
						if (key.substring(0,1) == '&') {
							progress = key.substring(1,key.indexOf(':'))
						}
						let k = key.split(':');
						if (Game.Story.Progress[progress].hasOwnProperty(k[1])) {
							if (!!Game.Story.Progress[progress][k[1]]) {
								p = key;
							}
						}
					}
					if ((key.indexOf(Game.Story.Now) != -1 || key.substring(0,1) == '&') && key.indexOf('!') != -1) {
						progress = Game.Story.Now;
						if (key.substring(0,1) == '&') {
							progress = key.substring(1,key.indexOf('!'))
						}
						let k = key.split('!');
						if (!Game.Story.Progress[progress][k[1]] || !Game.Story.Progress[progress].hasOwnProperty(k[1])) {
							p = key;
						}
					}
					if ((key.indexOf(Game.Story.Now) != -1 || key.substring(0,1) == '&') && key.indexOf('#') != -1) {
						let k = key.split('#');
						if (Game.Items.GetPlayerItemQuantity(k[1]) > 0) {
							p = key;
						}
					}
					if ((key.indexOf(Game.Story.Now) != -1 || key.substring(0,1) == '&') && key.indexOf('$') != -1) {
						let k = key.split('$');
						if (Game.Items.GetPlayerItemQuantity(k[1]) == 0) {
							p = key;
						}
					}
				}
				Game.Dialogue.ProcessBlock(block[p],file);
			}
		} else if (typeof block == 'string') {
			if (block.indexOf('@') == -1) {
				Game.Dialogue.Play(file,block);
			} else {
				var k = block.split('@');
				Game.Dialogue.Play(k[0],k[1]);
			}
		} else if (block == false) {
			if (!Game.Dialogue.Visible) {
				Game.Dialogue.Composition.Background.remove();
			}
		} else {
			console.log('Game.Dialogue.ProcessBlock: Invalid block');
		}
	},
	Transcript: [],
	ShowTranscript: function() {
		var div = document.createElement('div');

		var button = document.createElement('div');
		button.className = 'ui_button font_text noselect';
		button.style.float = 'right';
		button.style.marginTop = '12px';
		button.onclick = function() {
			Game.Sound.Play('click.mp3');
			Game.UI.Hide();
		};
		button.innerHTML = 'Close';
		div.appendChild(button);

		var header = document.createElement('div');
		header.className = 'ui_title font_title noselect';
		header.style.display = 'inline-block';
		header.innerHTML = 'Transcript';
		div.appendChild(header);

		/*var subtitle = document.createElement('div');
		subtitle.className = 'ui_subtitle font_text noselect';
		subtitle.innerHTML = 'This is a list of all items currently loaded in the game.';
		div.appendChild(subtitle);*/

		var items = document.createElement('div');
		items.style.display = 'inline-block';
		items.style.width = '100%';
		Game.Dialogue.Transcript.reverse().forEach(function(Line) {
			var item = document.createElement('div');
			item.className = 'dialogue_transcript_line';

			var image = document.createElement('img');
			if (Line.Image == '' || Line.Image == false || typeof Line.Image == 'undefined') {
				image.src = './resources/images/dialogue.svg';
			} else {
				image.src = './resources/images/'+Line.Image;
			}
			image.className = 'dialogue_transcript_image';
			item.appendChild(image);

			var name = document.createElement('div');
			name.innerHTML = Line.Who;
			name.className = 'font_title noselect dialogue_transcript_name';
			item.appendChild(name);

			var text = document.createElement('div');
			text.innerHTML = Line.Text;
			text.className = 'font_text noselect dialogue_transcript_text';
			item.appendChild(text);

			items.appendChild(item);
		});
		div.appendChild(items);

		if (Game.Dialogue.Transcript.length == 0) {
			items.className = 'font_text noselect';
			items.style.paddingBottom = '16px';
			items.innerHTML = 'Nothing has been said yet!';
		}

		Game.Dialogue.Transcript.reverse();

		Game.UI.Show(div);
	},
	LoadedScripts: {},
	Composition: {}
};

Game.Dialogue.Init = function() {
	Game.CSS.Load('dialogue.css');

	Game.Dialogue.Next = Game.Dialogue.NextForce;

	Game.Dialogue.Composition.Container = document.createElement('div');
	Game.Dialogue.Composition.Container.className = 'dialogue_container dialogue_container_animated-open font_text noselect';

	Game.Dialogue.Composition.ContainerBackground = document.createElement('div');
	Game.Dialogue.Composition.ContainerBackground.className = 'dialogue_container_background font_text noselect';
	Game.Dialogue.Composition.ContainerBackground.onclick = function() {
		Game.Dialogue.Next();
	}
	Game.Dialogue.Composition.ContainerBackground.Cursor = 'arrow';
	Game.Dialogue.Composition.ContainerBackground.addEventListener('mousemove',function() {Game.Cursor.Set('dialogue_'+Game.Dialogue.Composition.ContainerBackground.Cursor);});
	Game.Dialogue.Composition.ContainerBackground.addEventListener('mouseout',function() {Game.Cursor.Hide();});
	Game.Dialogue.Composition.Container.appendChild(Game.Dialogue.Composition.ContainerBackground);

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

	Game.Bar.Add('bar_transcript.svg','Transcript',function(){Game.Dialogue.ShowTranscript();});
}