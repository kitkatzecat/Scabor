Game.Room = {
	Current: false,
	Load: function(file,position=50) {
		Game.Room.Loading = {'file':file,'position':position};
		
		if (typeof Game.Room.BeforeUnload == 'function') {
			try {
				Game.Room.BeforeUnload();
			} catch(e) {
				console.log('Game.Room.Load: Game.Room.BeforeUnload error: '+e);
				Game.Room.LoadNow();
			}
		} else {
			Game.Room.LoadNow();
		}
	},
	Loading: false,
	LoadNow: function() {
		var file = Game.Room.Loading['file'];
		var position = Game.Room.Loading['position'];
		Game.Room.Loading = false;
		Game.Room.BeforeUnload = false;
		
		Game.Loader.Show('room');
		
		Game.Room.Composition.Request = new XMLHttpRequest;
		Game.Room.Composition.RequestURI = file;
		Game.Room.Composition.RequestPos = position;
		
	    Game.Room.Composition.Request.open('GET', './resources/rooms/'+file, true);
	    Game.Room.Composition.Request.onreadystatechange = Game.Room.Response;
	    Game.Room.Composition.Request.setRequestHeader("Cache-Control", "no-cache");
	    Game.Room.Composition.Request.send(null);
		
		/*try {
			Game.Presence.ClearAll();
		} catch(e) {
			console.log('Game.Room.LoadNow: Error while calling Game.Presence.ClearAll: '+e);
		}*/
		Game.Room.Leave.Hide();
	},
	Loaded: false,
	BeforeUnload: false,
	AfterLoad: [],
	Response: function() {
		if (Game.Room.Composition.Request.readyState == 4) {
			if (Game.Room.Composition.Request.status == 200) {
				var result = Game.Room.Composition.Request.responseText;
				if (document.getElementById('room') != null) {
					document.getElementById('room').parentNode.removeChild(document.getElementById('room'));
				}
				document.body.insertAdjacentHTML('afterbegin',result);
				Game.Room.Current = Game.Room.Composition.RequestURI;
				
				Game.Room.Composition.Image = document.getElementById('room');
				var l = (((Game.Room.Composition.Image.clientWidth/100)*Game.Room.Composition.RequestPos)-(window.innerWidth/2));
				if (l < 0) { l = 0; }
				Game.Room.Composition.Image.style.left = '-'+l+'px';
				Game.Room.Composition.Image.onmouseover = function() {Game.Cursor.Set('magnifying-glass');};
				Game.Room.Composition.Image.addEventListener('mousedown',function() {Game.Sound.Play('click.mp3');});
				Game.Room.Composition.Image.addEventListener('mouseout',function() {Game.Cursor.Hide();});
				Game.Room.Resize();
				
				try {
					Game.Room.Loaded();
				} catch(e) {console.log('Game.Room.Response: Error processing Game.Room.Loaded function: '+e);}
				Game.Room.Loaded = false;
				Game.Loader.Hide('room');
				
				for (var i in Game.Room.AfterLoad) {
					try {
						Game.Room.AfterLoad[i]();
					} catch(e) {console.log('Game.Room.Response: Error processing Game.Room.AfterLoad function ['+i+']: '+e);}
				}
				Game.Room.AfterLoad = [];
				
				console.log('Game.Room.Response: Room "'+Game.Room.Composition.RequestURI+'" loaded at position '+Game.Room.Composition.RequestPos+'% (-'+l+'px)');
			} else {
				Game.Dialogue.Speak({Who:'Error',Text:'Unable to load room from "'+Game.Room.Composition.RequestURI+'": '+Game.Room.Composition.Request.statusText,Color:'#888'});
				try {
					Game.Room.Loaded();
				} catch(e) {console.log('Game.Room.Response: Error processing Game.Room.Loaded function: '+e);}
				Game.Room.Loaded = false;
				Game.Loader.Hide('room');
			}
		}
	},
	Unload: function() {
		if (document.getElementById('room') != null) {
			document.getElementById('room').parentNode.removeChild(document.getElementById('room'));
		}
		Game.Room.Current = false;

		Game.Room.Move.RightCheck();
		Game.Room.Move.LeftCheck();
	},
	Resize: function() {
		Game.Room.Movement.EdgeCheck();
		if (Game.Room.Composition.Image.clientWidth < window.innerWidth) {
			Game.Room.Composition.Image.style.left = ((window.innerWidth-Game.Room.Composition.Image.clientWidth)/2)+'px';
		}
	},
	Move: {
		SetPosition: function(pos) { /* NOT YET WORKING!!!!! */
			try {
				clearInterval(Game.Room.Move.LeftInterval);
			} catch(e) {console.log('Game.Move.SetPosition: '+e);}
			try {
				clearInterval(Game.Room.Move.RightInterval);
			} catch(e) {console.log('Game.Move.SetPosition: '+e);}
			
			Game.Room.Composition.Image.style.transition = 'left .2s ease-out';
			if ((Game.Room.Composition.Image.clientWidth - parseInt(pos)) > (window.innerWidth - Game.Room.Composition.Image.clientWidth)) {
				pos = (window.innerWidth - Game.Room.Composition.Image.clientWidth);
			}
			Game.Room.Composition.Image.style.left = '-'+pos+'px';
			setTimeout(function() {
				Game.Room.Composition.Image.style.transition = '';
				Game.Room.Resize();
			}, 200);
		},
		Left: function() {
			Game.Room.Composition.Image.style.transition = '';
			Game.Room.Move.LeftInterval = setInterval(function() {
				if (parseInt(Game.Room.Composition.Image.style.left) < 0) {
					Game.Room.Composition.Image.style.left = (parseInt(Game.Room.Composition.Image.style.left)+(Game.Room.Composition.Image.clientWidth/300))+'px';
					Game.Room.Composition.Right.style.display = 'block';
				}
				if (parseInt(Game.Room.Composition.Image.style.left) > 0) {
					Game.Room.Composition.Image.style.left = '0px';
				}
				Game.Room.Move.LeftCheck();
				Game.Room.Move.RightCheck();
			},10);
		},
		LeftInterval: false,
		LeftCheck: function() {
			if (document.getElementById('room') != null) {
				if (parseInt(Game.Room.Composition.Image.style.left) >= 0) {
					Game.Room.Composition.Left.style.display = 'none';
				}
			} else {
				Game.Room.Composition.Left.style.display = 'none';
			}
		},
		LeftJump: function() {
			clearInterval(Game.Room.Move.LeftInterval);
			Game.Room.Composition.Image.style.transition = 'left .2s ease-out';
			Game.Room.Composition.Image.style.left = '0px';
			setTimeout(function() {
				Game.Room.Composition.Image.style.transition = '';
				Game.Room.Move.LeftCheck();
				Game.Room.Move.RightCheck();
			}, 200);
		},
		Right: function() {
			Game.Room.Composition.Image.style.transition = '';
			Game.Room.Move.RightInterval = setInterval(function() {
				if (parseInt(Game.Room.Composition.Image.style.left) > (window.innerWidth - Game.Room.Composition.Image.clientWidth)) {
					Game.Room.Composition.Image.style.left = (parseInt(Game.Room.Composition.Image.style.left)-(Game.Room.Composition.Image.clientWidth/300))+'px';
					Game.Room.Composition.Left.style.display = 'block';
				}
				if (parseInt(Game.Room.Composition.Image.style.left) < (window.innerWidth - Game.Room.Composition.Image.clientWidth)) {
					Game.Room.Composition.Image.style.left = (window.innerWidth - Game.Room.Composition.Image.clientWidth)+'px';
				}
				Game.Room.Move.LeftCheck();
				Game.Room.Move.RightCheck();
			},10);
		},
		RightCheck: function() {
			if (document.getElementById('room') != null) {
				if (parseInt(Game.Room.Composition.Image.style.left) <= (window.innerWidth - Game.Room.Composition.Image.clientWidth)) {
					Game.Room.Composition.Right.style.display = 'none';
				}
			} else {
				Game.Room.Composition.Right.style.display = 'none';
			}
		},
		RightJump: function() {
			clearInterval(Game.Room.Move.RightInterval);
			Game.Room.Composition.Image.style.transition = 'left .2s ease-out';
			Game.Room.Composition.Image.style.left = (window.innerWidth - Game.Room.Composition.Image.clientWidth)+'px';
			setTimeout(function() {
				Game.Room.Composition.Image.style.transition = '';
				Game.Room.Move.LeftCheck();
				Game.Room.Move.RightCheck();
			}, 200);
		},
		RightInterval: false,
		Stop: function() {
			if (Game.Room.Move.LeftInterval != false) {
				try {
					clearInterval(Game.Room.Move.LeftInterval);
					Game.Room.Move.LeftInterval = false;
				} catch (e) {}
				
				if (parseInt(Game.Room.Composition.Image.style.left) < 0) {
					Game.Room.Composition.Image.style.transition = 'left .2s ease-out';
					Game.Room.Composition.Image.style.left = (parseInt(Game.Room.Composition.Image.style.left)+(Game.Room.Composition.Image.clientWidth/75))+'px';
					if (parseInt(Game.Room.Composition.Image.style.left) > 0) {
						Game.Room.Composition.Image.style.left = '0px';
					}
					setTimeout(function() {
						Game.Room.Composition.Image.style.transition = '';
					}, 200);
				}
			}
			if (Game.Room.Move.RightInterval != false) {
				try {
					clearInterval(Game.Room.Move.RightInterval);
					Game.Room.Move.RightInterval = false;
				} catch (e) {}
				
				if (parseInt(Game.Room.Composition.Image.style.left) > (window.innerWidth - Game.Room.Composition.Image.clientWidth)) {
					Game.Room.Composition.Image.style.transition = 'left .2s ease-out';
					Game.Room.Composition.Image.style.left = (parseInt(Game.Room.Composition.Image.style.left)-(Game.Room.Composition.Image.clientWidth/75))+'px';
					if (parseInt(Game.Room.Composition.Image.style.left) < (window.innerWidth - Game.Room.Composition.Image.clientWidth)) {
						Game.Room.Composition.Image.style.left = (window.innerWidth - Game.Room.Composition.Image.clientWidth)+'px';
					}
					setTimeout(function() {
						Game.Room.Composition.Image.style.transition = '';
					}, 200);
				}
			}
		},
	},
	Leave: {
		Show: function() {
			Game.Room.Composition.Button.style.display = 'block';
			if (Game.Story['Tutorial']['Room_Leave'] !== true) {
				Game.Dialogue.Play('Tutorial.json','Room_Leave');
				Game.Story['Tutorial']['Room_Leave'] = true;
			}
		},
		Hide: function() {
			Game.Room.Composition.Button.style.display = 'none';
			Game.Room.Leave.Message = 'Leave this room?';
		},
		Message: 'Leave this room?',
		On: function() {
			Game.Dialogue.Speak({Who:'Narrator',Text:Game.Room.Leave.Message,Sound:'Me.mp3',Color:'#888',Prompt:[
				{Text:'Yes',Function:function() {
					if (typeof Game.Room.BeforeLeave == 'function') {
						try {
							Game.Room.BeforeLeave();
						} catch(e) {console.log('Game.Room.Leave.On: Game.Room.BeforeLeave error: '+e);}
					} else {
						if (typeof Game.Room.OnLeave == 'function') {
							try {
								Game.Room.OnLeave();
							} catch(e) {console.log('Game.Room.Leave.On: Game.Room.OnLeave error: '+e);}
						}
						//Game.Room.OnLeave = false;
					}
				}},
				{Text:'No',Function:false}
			]});
		}
	},
	BeforeLeave: false,
	OnLeave: false,
	ShowPointer: function() {
		Game.Cursor.Hide();
		Game.Room.Composition.Image.style.cursor = 'pointer';
		Game.Room.Composition.Image.onmouseover = function() {};
		Game.Room.Composition.Image.onmouseout = function() {};
	},
	HidePointer: function() {
		Game.Cursor.Set('magnifying-glass');
		Game.Room.Composition.Image.style.cursor = '';
		Game.Room.Composition.Image.onmouseover = function() {Game.Cursor.Set('magnifying-glass');};
		Game.Room.Composition.Image.onmouseout = function() {Game.Cursor.Hide();};
	},
	ShowCover: function() {
		Game.Room.Composition.Cover = document.createElement('div');
		Game.Room.Composition.Cover.className = 'room_cover room_cover_animated-open';
		document.body.appendChild(Game.Room.Composition.Cover);
	},
	HideCover: function() {
		Game.Room.Composition.Cover.className = 'room_cover room_cover_animated-close';
		setTimeout(function() {
			Game.Room.Composition.Cover.remove();
		},200);
	},
	Composition: {},
	Movement: {
		MaxSpeed: 10,
		Speed: 0,
		Locked: false,
		SetSpeed: function(speed) {
			if (Game.Room.Movement.Locked == false) {
				if (Game.Room.Composition.Image.clientWidth < window.innerWidth) {
					console.log('Game.Room.Movement.SetSpeed: Cannot set room speed, room width is smaller than viewport');
				} else {
					Game.Room.Movement.Speed = speed;
					console.log('Game.Room.Movement.SetSpeed: Room speed set to '+speed);
					if (Game.Room.Movement.Speed == 0) {
						clearInterval(Game.Room.Movement.Interval);
					} else if (Game.Room.Movement.Speed > 0 || Game.Room.Movement.Speed < 0) {
						clearInterval(Game.Room.Movement.Interval);
						Game.Room.Movement.Interval = setInterval(Game.Room.Movement.Move,10);
						Game.Room.Movement.EdgeCheck();
					}
				}
			} else {
				console.log('Game.Room.Movement.SetSpeed: Cannot set room speed, speed is locked to '+Game.Room.Movement.Speed);
			}
		},
		EdgeCheck: function() {
			if (document.getElementById('room') != null) {
				Game.Room.Composition.Right.style.display = 'block';
				Game.Room.Composition.Left.style.display = 'block';
				
				if (parseInt(Game.Room.Composition.Image.style.left) <= (window.innerWidth - Game.Room.Composition.Image.clientWidth)) {
					Game.Room.Composition.Right.style.display = 'none';
					console.log('Game.Room.Movement.EdgeCheck: Hit right edge or room width smaller than viewport');
					if (Game.Room.Movement.Speed < 0) {
						Game.Room.Movement.Locked = false;
						Game.Room.Movement.SetSpeed(0);
					}
					Game.Room.Composition.Image.style.left = (window.innerWidth - Game.Room.Composition.Image.clientWidth)+'px';
				}
				if (parseInt(Game.Room.Composition.Image.style.left) >= 0) {
					console.log('Game.Room.Movement.EdgeCheck: Hit left edge or room width smaller than viewport');
					Game.Room.Composition.Left.style.display = 'none';
					if (Game.Room.Movement.Speed > 0) {
						Game.Room.Movement.Locked = false;
						Game.Room.Movement.SetSpeed(0);
					}
					Game.Room.Composition.Image.style.left = '0px';
				}
			} else {
				Game.Room.Composition.Right.style.display = 'none';
				Game.Room.Composition.Left.style.display = 'none';
				Game.Room.Movement.SetSpeed(0);
			}
		},
		Interval: false,
		Move: function() {
			Game.Room.Movement.EdgeCheck();
			Game.Room.Composition.Image.style.left = (parseInt(Game.Room.Composition.Image.style.left)+Game.Room.Movement.Speed)+'px';
		},
		RightMouse: function(e) {
			speed = (e.offsetX/Game.Room.Composition.Right.clientWidth)*(-1*Game.Room.Movement.MaxSpeed);
			if (speed > -0.5) {
				speed = -0.5;
			}
			Game.Room.Movement.Speed = speed;
			Game.Room.KeyMovement = true;
		},
		LeftMouse: function(e) {
			speed = ((Game.Room.Composition.Left.clientWidth-e.offsetX)/Game.Room.Composition.Left.clientWidth)*Game.Room.Movement.MaxSpeed;
			if (speed < 0.5) {
				speed = 0.5;
			}
			Game.Room.Movement.Speed = speed;
			Game.Room.KeyMovement = true;
		},
		KeyMovement: false
	},
	Compass: {
		Composition: false,
		Set: function(deg) {
			if (deg == 0) {
				Game.Room.Compass.Composition.style.transform = 'rotateX(0deg) rotateY(0deg)';
			} else if (deg == 90) {
				Game.Room.Compass.Composition.style.transform = 'rotateX(0deg) rotateY(180deg)';
			} else if (deg == 180) {
				Game.Room.Compass.Composition.style.transform = 'rotateX(180deg) rotateY(180deg)';
			} else if (deg == 270) {
				Game.Room.Compass.Composition.style.transform = 'rotateX(180deg) rotateY(0deg)';
			} else {
				Game.Room.Compass.Composition.style.transform = 'rotateX(0deg) rotateY(0deg)';
			}
		}
	}
}
Game.Room.Init = function() {
	Game.CSS.Load('room.css');

	Game.Room.Composition.Right = document.createElement('div');
	Game.Room.Composition.Right.className = 'room_move-right noselect';
	Game.Room.Composition.Right.onmouseover = function() {
		Game.Room.Movement.SetSpeed(-1);
		Game.Cursor.Set('room_arrow-right');
	}
	Game.Room.Composition.Right.onmousemove = function(e) {
		Game.Room.Movement.RightMouse(e);
	}
	Game.Room.Composition.Right.onmouseout = function() {
		Game.Room.Movement.SetSpeed(0);
		Game.Room.Movement.KeyMovement = false;
		Game.Cursor.Hide();
	}
	Game.Room.Composition.Right.ondblclick = Game.Room.Move.RightJump;
	document.body.appendChild(Game.Room.Composition.Right);
	
	Game.Room.Composition.Left = document.createElement('div');
	Game.Room.Composition.Left.className = 'room_move-left noselect';
	Game.Room.Composition.Left.onmouseover = function() {
		Game.Room.Movement.SetSpeed(1);
		Game.Cursor.Set('room_arrow-left');
	}
	Game.Room.Composition.Left.onmousemove = function(e) {
		Game.Room.Movement.LeftMouse(e);
	}
	Game.Room.Composition.Left.onmouseout = function() {
		Game.Room.Movement.SetSpeed(0);
		Game.Room.Movement.KeyMovement = false;
		Game.Cursor.Hide();
	}
	Game.Room.Composition.Left.ondblclick = Game.Room.Move.LeftJump;
	document.body.appendChild(Game.Room.Composition.Left);
	
	window.addEventListener('resize',Game.Room.Resize,true);
	
	Game.Room.Move.LeftCheck();
	Game.Room.Move.RightCheck();
	
	Game.Room.Composition.Button = document.createElement('div');
	Game.Room.Composition.Button.className = 'room_button font_text noselect';
	Game.Room.Composition.Button.style.display = 'none';
	Game.Room.Composition.Button.onmousedown = function() {
		Game.Sound.Play('click.mp3');
	}
	Game.Room.Composition.Button.onclick = Game.Room.Leave.On;
	document.body.appendChild(Game.Room.Composition.Button);
	
	Game.Room.Composition.ButtonCaption = document.createElement('div');
	Game.Room.Composition.ButtonCaption.className = 'room_button_caption font_text noselect';
	Game.Room.Composition.ButtonCaption.innerHTML = 'Leave Room';
	document.body.appendChild(Game.Room.Composition.ButtonCaption);
	
	Game.Room.Compass.Composition = document.createElement('img');
	Game.Room.Compass.Composition.className = 'room_compass noselect';
	Game.Room.Compass.Composition.src = 'resources/images/room_compass.svg';
	document.body.appendChild(Game.Room.Compass.Composition);
	
	document.addEventListener("keydown", function(e) {
		if (e.keyCode == 65 || e.keyCode == 37) {
			if (Game.Room.Movement.Locked == false && Game.Room.Movement.KeyMovement !== true) {
				Game.Room.Movement.SetSpeed(5);
				Game.Room.Movement.Locked = true;
				Game.Room.Movement.KeyMovement = true;
			}
			e.preventDefault();
		}
		if (e.keyCode == 68 || e.keyCode == 39) {
			if (Game.Room.Movement.Locked == false) {
				Game.Room.Movement.SetSpeed(-5);
				Game.Room.Movement.Locked = true;
				Game.Room.Movement.KeyMovement = true;
			}
			e.preventDefault();
		}
	});
	document.addEventListener("keyup", function(e) {
		if (e.keyCode == 65 || e.keyCode == 37 || e.keyCode == 68 || e.keyCode == 39) {
			if (Game.Room.Movement.KeyMovement && Game.Room.Movement.KeyMovement !== true) {
				Game.Room.Movement.Locked = false;
				Game.Room.Movement.SetSpeed(0);
				Game.Room.Movement.KeyMovement = false;
			}
			e.preventDefault();
		}
	});
}