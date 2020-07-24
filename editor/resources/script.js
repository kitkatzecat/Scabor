var Handler = {
	Load: function() {
		Handler.Composition.Sidebar = document.createElement('div');
		Handler.Composition.Sidebar.className = 'sidebar';
		document.body.appendChild(Handler.Composition.Sidebar);

		Handler.Composition.Body = document.createElement('div');
		Handler.Composition.Body.className = 'body';
		document.body.appendChild(Handler.Composition.Body);

		Handler.LoadScript();
	},
	LoadScript: function() {
		var params = new URLSearchParams(window.location.search);
		if (params.get('file') != null) {
			Handler.File = params.get('file');
		} else {
			Handler.File = prompt('Input a script to load:');
		}
		//Handler.File = 'Chapter1.json';

		Handler.Composition.Request = new XMLHttpRequest;
		Handler.Composition.RequestURI = Handler.File;
		
	    Handler.Composition.Request.open('GET', '/resources/scripts/'+Handler.File, true);
	    Handler.Composition.Request.onreadystatechange = Handler.Response;
	    Handler.Composition.Request.setRequestHeader("Cache-Control", "no-cache");
	    Handler.Composition.Request.send(null);
	},
	Response: function() {
		if (Handler.Composition.Request.readyState == 4) {
			if (Handler.Composition.Request.status == 200) {
				var result = Handler.Composition.Request.responseText;
				try {
					result = JSON.parse(result);
					Handler.Script = result;
					console.log('Handler.Response: Loaded script "'+Handler.Composition.RequestURI+'"');
				} catch(err) {
					console.log('Handler.Response: Unable to load script from "'+Handler.Composition.RequestURI+'": '+err);
				}
			} else {
				console.log('Handler.Response: Unable to load script from "'+Handler.Composition.RequestURI+'": '+Handler.Composition.Request.statusText);
			}
		}
		Handler.Display();
	},
	Composition: {},
	Display: function() {
		Handler.Composition.Options = {};
		for (var key in Handler.Script) {
			if (Handler.Script.hasOwnProperty(key)) {
				Handler.Composition.Options[key] = document.createElement('div');
				Handler.Composition.Options[key].className = 'title_box';
				Handler.Composition.Options[key].id = key;
				Handler.Composition.Options[key].innerHTML = key;
				Handler.Composition.Options[key].onclick = function() {
					Handler.Switch(this);
				}
				
				Handler.Composition.Sidebar.appendChild(Handler.Composition.Options[key]);
			}
		}
		Handler.Composition.Body.innerHTML = '<div style="padding-left:16px;"><h2 class="font_title">Conversations loaded from "'+Handler.File+'"</h2>Select a conversation on the right to view it.</div>';
		Tab.SetTitle(Handler.File.substr(0,Handler.File.lastIndexOf('.')));
	},
	Switch: function(obj) {
		for (var key in Handler.Composition.Options) {
			if (Handler.Composition.Options.hasOwnProperty(key)) {
				if (Handler.Composition.Options[key].className == 'title_box_active') {
					Handler.Composition.Options[key].className = 'title_box';
				}
			}
		}
		obj.className = 'title_box_active';

		Handler.Composition.Body.innerHTML = '';

		Handler.Script[obj['id']].forEach(element => {
			var line = document.createElement('div');
			line.className = 'line';

			var character = window.parent.Handler.GetCharacter(element['Who']);
			var name = element['Who'];
			var color = element['Color'];
			if (character !== false) {
				name = character['Name'];
				color = character['Color'];
			} else {
				name = name+'</span> (character not loaded)';
			}
			var image = window.parent.Handler.GetImage(element['Who'],element['Expression'],element['Image']);

			var prompt = '';
			if (typeof element['Prompt'] != 'undefined' && element['Prompt'] !== false) {
				prompt = '<div style="padding-top:14px;padding-bottom: 12px;">';
				element['Prompt'].forEach(option => {
					prompt += '<span class="prompt_option">'+option['Text']+'</span>';
				});
				prompt += '</div>';
			}

			line.innerHTML = '<img src="'+image+'" style="background-color:'+color+'" class="line_img"><div style="margin-top:12px;"><span class="font_title" style="font-weight:bold;">'+name+'</span><br>'+element['Text']+prompt+'</div>';
			Handler.Composition.Body.appendChild(line);
		});
	},
	SwitchLine: function() {

	},
	Characters: {},
	File: false,
	Script: false
}
window.addEventListener('load',Handler.Load);