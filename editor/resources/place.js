var Handler = {
	Load: function() {
		Handler.LoadPlace();
	},
	LoadPlace: function() {
		var params = new URLSearchParams(window.location.search);
		if (params.get('file') != null) {
			Handler.File = params.get('file');
		} else {
			Handler.File = prompt('Input a place to load:');
		}
		//Handler.File = '2L_Rooms-Hall_1.json';

		Handler.Composition.Request = new XMLHttpRequest;
		Handler.Composition.RequestURI = Handler.File;
		
	    Handler.Composition.Request.open('GET', '/resources/places/'+Handler.File, true);
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
					Handler.Room = result;
					console.log('Handler.Response: Loaded place "'+Handler.Composition.RequestURI+'"');
				} catch(err) {
					console.log('Handler.Response: Unable to load place from "'+Handler.Composition.RequestURI+'": '+err);
				}
			} else {
				console.log('Handler.Response: Unable to load place from "'+Handler.Composition.RequestURI+'": '+Handler.Composition.Request.statusText);
			}
		}
		Handler.Display();
	},
	Composition: {},
	Display: function() {
		document.getElementById('room').src = '/resources/rooms/'+Handler.Room['default']['room'];
		document.getElementById('title').innerHTML = Handler.Room['default']['title'];
		document.getElementById('file').innerHTML = Handler.File;
		document.getElementById('text').innerHTML = JSON.stringify(Handler.Room,null,2);

		if (typeof Handler.Room['default']['background'] != 'false' && Handler.Room['default']['background'] != false) {
			document.getElementById('roomcontainer').style.backgroundImage = 'url(\'/resources/images/'+Handler.Room['default']['background']+'\')';
		}

		Tab.SetTitle(Handler.Room['default']['id']);
	},
	File: false,
	Room: false
}
window.addEventListener('load',Handler.Load);