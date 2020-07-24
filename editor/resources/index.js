var Tabs = {
	Open: function(url,title,icon,duplicate=false) {
		var t = false;
		if (Tabs.All.length > 0) {
			Tabs.All.forEach((tab) => {
				if ((tab.Url == url) && (!duplicate)) {
					Tabs.Switch(tab);
					t = tab;
				}
			});
		}
		if (!t) {
			t = Tabs.Create(url,title,icon);
		}
		return t;
	},
	Create: function(url,title,icon) {
		var tab = {
			Title: title,
			Icon: icon,
			Url: url
		};

		tab.Frame = document.createElement('iframe');
		tab.Frame.className = 'body';
		tab.Frame.src = url;
		tab.Frame.style.display = 'none';
		tab.Frame.addEventListener('load',() => {
			tab.Frame.contentWindow.Tab = tab;
		});

		tab.Tab = document.createElement('div');
		tab.Tab.className = 'tab';
		tab.Tab.innerHTML = '<img class="tabicon" src="resources/'+icon+'">'+title;
		tab.Tab.addEventListener('mousedown',() => {
			Tabs.Switch(tab);
		});
		tab.Tab.addEventListener('mouseenter',() => {
			tab.CloseButton.style.display = 'block';
		});
		tab.Tab.addEventListener('mouseleave', () => {
			tab.CloseButton.style.display = 'none';
		});

		tab.CloseButton = document.createElement('div');
		tab.CloseButton.className = 'tabclose';
		tab.CloseButton.innerHTML = '✕';
		tab.CloseButton.addEventListener('mousedown', (e) => {
			e.stopPropagation();
		});
		tab.CloseButton.addEventListener('click',(e) => {
			tab.Close();
			e.stopPropagation();
		});
		tab.Tab.appendChild(tab.CloseButton);

		tab.Active = false;

		tab.Close = () => {
			if (tab.Active) {
				if (Tabs.All.length > 1) {
					if (Tabs.All.indexOf(tab) > 0) {
						Tabs.Switch(Tabs.All[Tabs.All.indexOf(tab)-1]);
					} else {
						Tabs.Switch(Tabs.All[0]);
					}
				}
			}

			tab.Frame.remove();
			tab.Tab.remove();
			Tabs.All.splice(Tabs.All.indexOf(tab),1);
			delete tab;
		};

		tab.SetIcon = (icon) => {
			tab.Icon = icon;
			tab.Tab.innerHTML = '<img class="tabicon" src="resources/'+icon+'">'+tab.Title;
			tab.Tab.appendChild(tab.CloseButton);
		};

		tab.SetTitle = (title) => {
			tab.Title = title;
			tab.Tab.innerHTML = '<img class="tabicon" src="resources/'+tab.Icon+'">'+title;
			tab.Tab.appendChild(tab.CloseButton);
		};

		document.getElementById('iframebody').appendChild(tab.Frame);
		document.getElementById('tabs').appendChild(tab.Tab);

		Tabs.All.push(tab);

		Tabs.Switch(tab);

		return tab;
	},
	Switch: function(tab) {
		Tabs.All.forEach((element) => {
			if (element === tab) {
				element.Frame.style.display = 'inline-block';
				element.Tab.className = 'tab tabactive';
				element.Active = true;
			} else {
				element.Frame.style.display = 'none';
				element.Tab.className = 'tab';
				element.Active = false;
			}
		});
	},
	All: []
};

var Handler = {
	Load: function() {
		Handler.LoadFiles();
	},
	LoadCharacter: function(file) {
		var request = new XMLHttpRequest;
		
	    request.open('GET', '/resources/characters/'+file, true);
	    request.onreadystatechange = function() {
			if (request.readyState == 4) {
				if (request.status == 200) {
					var result = request.responseText;
					try {
						result = JSON.parse(result);
						Handler.Characters[result['ID']] = result;
						console.log('Handler.Response: Loaded character "'+result['ID']+'"');
					} catch(err) {
						console.log('Handler.Response: Unable to load character from "'+file+'": '+err);
					}
				} else {
					console.log('Handler.Response: Unable to load character from "'+file+'": '+request.statusText);
				}
			}
		};
	    request.setRequestHeader("Cache-Control", "no-cache");
	    request.send(null);
	},
	GetCharacter: function(id) {
		if (Handler.Characters.hasOwnProperty(id)) {
			return Handler.Characters[id];
		} else {
			return false;
		}
	},
	GetImage: function(id, expression, image=false) {
		var character = Handler.GetCharacter(id);
		if (id == "Me") {
			return 'resources/message.svg';
		} else if (character !== false) {
			if (character['Expressions'].hasOwnProperty(expression)) {
				return '/resources/images/characters/'+id+'/'+character['Expressions'][expression];
			} else {
				return '/resources/images/characters/'+id+'/'+character['Expressions']['neutral'];
			}
		} else if (image !== false) {
			return '/resources/images/'+image;
		} else {
			return 'resources/message.svg';
		}
	},
	Characters: {},
	LoadFiles: function() {
		var request = new XMLHttpRequest;
		
	    request.open('GET', 'resources/list.php', true);
	    request.onreadystatechange = function() {
			if (request.readyState == 4) {
				if (request.status == 200) {
					var result = request.responseText;
					try {
						result = JSON.parse(result);
						Handler.Files = result;
						console.log('Handler.Response: Loaded files');
						Handler.FilesLoaded();
					} catch(err) {
						console.log('Handler.Response: Unable to load files: '+err);
					}
				} else {
					console.log('Handler.Response: Unable to load files: '+request.statusText);
				}
			}
		};
	    request.setRequestHeader("Cache-Control", "no-cache");
	    request.send(null);
	},
	FilesLoaded: function() {
		// Load all characters
		if (typeof Handler.Files['characters'] != 'undefined') {
			for (var key in Handler.Files['characters']) {
				if (Handler.Files['characters'].hasOwnProperty(key)) {
					Handler.LoadCharacter(key);
				}
			}
		}

		Handler.DisplayResources();
	},
	DisplayResources: function() {
		var render = function(folder,icon,onc=function(){}) {
			var resources = document.createElement('div');
			for (var key in folder) {
				if (folder.hasOwnProperty(key)) {
					var name = key.substr(0,key.lastIndexOf('.'));
					var line = document.createElement('div');
					line.className = 'title_box';
					line.key = key;
					line.onclick = function() {
						onc(this.key);
					};
					line.innerHTML = '<img class="sidebaricon" src="resources/'+icon+'">'+name;
					resources.appendChild(line);
				}
			}
			return resources;
		}

		document.getElementById('sidebar_resources').appendChild(render(Handler.Files['places'],'place.svg',(key) => {Tabs.Open('place.htm?file='+key,'Script Editor','place.svg')}));
		document.getElementById('sidebar_resources').appendChild(render(Handler.Files['scripts'],'dialogue.svg',(key) => {Tabs.Open('script.htm?file='+key,'Script Editor','dialogue.svg')}));
		document.getElementById('sidebar_resources').appendChild(render(Handler.Files['characters'],'person.svg',(key) => {Tabs.Open('script.htm?file='+key,'Script Editor','person.svg')}));
	},
	Files: {}
}
window.addEventListener('load',Handler.Load);