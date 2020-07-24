Game.Items = {
	Open: function(box,text='A drawer...',sound="drawer-open.mp3") {
		if (typeof Game.Items.BoxIndex == "undefined" || Game.Items.BoxIndex == false) {
			console.log('Game.Items.Open: No boxes are loaded or box Index is undefined');
		} else if (typeof Game.Items.BoxIndex[box] == "undefined") {
			console.log('Game.Items.Open: Box Index "'+box+'" does not exist');
		} else {
			box = Game.Items.BoxIndex[box];
			if (box.length == 0 || (Game.Story.Boxes.hasOwnProperty(Game.Place.Current['id']+'__'+box) && Game.Story.Boxes[Game.Place.Current['id']+'__'+box])) {
				Game.Dialogue.Line({Who:"Me",Text:text,Sound:sound});
				Game.Dialogue.Line({Who:"Me",Text:"...looks like it's empty.",Sound:Game.Characters.Loaded['Me']['Sound']});
			} else {
				Game.Dialogue.Line({Who:"Me",Text:text,Sound:sound});
				Game.Dialogue.Line({Who:"Me",Text:"...looks like there's something inside it.",Sound:Game.Characters.Loaded['Me']['Sound']});
				box.forEach(element => {
					Game.Items.GetPlayerItem(element);
				});
				Game.Story.Boxes[Game.Place.Current['id']+'__'+box] = true;
			}
		}
	},
	Init: function() {
		Game.CSS.Load('items.css');

		Game.Sound.Load('Item.mp3');

		var box = new XMLHttpRequest;
	
		box.open('GET', 'resources/boxes.json', true);
		
		box.onreadystatechange = function() {
			if (box.readyState == 4) {
				if (box.status == 200) {
					var result = box.responseText;
					try {
						result = JSON.parse(result);
						Game.Items.BoxBase = result;
						Game.Items.BoxIndex = result;
						console.log('Game.Items [anonymous]: Box base index loaded');
					} catch(err) {
						console.log('Game.Items [anonymous]: Unable to load box base index (JSON parse): '+err);
					}
				} else {
					console.log('Game.Items [anonymous]: Unable to load box base index (AJAX request): '+box.statusText);
				}
			}
		};
		
		box.setRequestHeader("Cache-Control", "no-cache");
		box.send(null);

		var items = new XMLHttpRequest;
	
		items.open('GET', 'resources/items.json', true);
		
		items.onreadystatechange = function() {
			if (items.readyState == 4) {
				if (items.status == 200) {
					var result = items.responseText;
					try {
						result = JSON.parse(result);
						Game.Items.ItemsIndex = result;
						console.log('Game.Items [anonymous]: Items index loaded');
					} catch(err) {
						console.log('Game.Items [anonymous]: Unable to load items index (JSON parse): '+err);
					}
				} else {
					console.log('Game.Items [anonymous]: Unable to load items index (AJAX request): '+items.statusText);
				}
			}
		};
		
		items.setRequestHeader("Cache-Control", "no-cache");
		items.send(null);

		Game.When(function() {
			return !(typeof Game.Dialogue.Load == 'undefined');
		},function(r) {
			if (r) {
				Game.Dialogue.Load('Items.json');
			}
		})

		Game.Bar.Add('bar_items.svg','Items',function(){Game.Items.ShowPlayerItems();});
	},
	GetItem: function(item) {
		if (typeof item == 'string') {
			if (typeof Game.Items.ItemsIndex[item] != 'undefined') {
				return Object.assign({},Game.Items.ItemsIndex['default'],Game.Items.ItemsIndex[item],{id:item});
			} else {
				console.log('Game.Items.GetItem: Unrecognized item type "'+item+'" - returning default item');
				var obj = Object.assign({},Game.Items.ItemsIndex['default'],{id:item});
				return obj;
			}
		} else if (typeof item == 'object') {
			var obj = Object.assign({},Game.Items.ItemsIndex['default'],item);
			return obj;
		} else {
			console.log('Game.Items.GetItem: Invalid paramater passed - returning default item');
			return Game.Items.ItemsIndex['default'];
		}
	},
	ShowItemIndex: function() {
		var div = document.createElement('div');

		var header = document.createElement('div');
		header.className = 'ui_title font_title noselect';
		header.innerHTML = 'Items Index';
		div.appendChild(header);

		var subtitle = document.createElement('div');
		subtitle.className = 'ui_subtitle font_text noselect';
		subtitle.innerHTML = 'This is a list of all items currently loaded in the game.';
		div.appendChild(subtitle);

		var items = document.createElement('div');
		items.style.display = 'inline-block';
		items.style.width = '100%';
		for (var key in Game.Items.ItemsIndex) {
			if (!Game.Items.ItemsIndex.hasOwnProperty(key)) continue;

			var obj = Game.Items.ItemsIndex[key];

			var item = document.createElement('div');
			item.className = 'item_box';
			item.key = key;
			item.onclick = function() {
				Game.Sound.Play('click.mp3');
				Game.Items.ShowItem(this.key,true);
			}

			/*var quantity = document.createElement('div');
			quantity.innerHTML = 'x3';
			quantity.className = 'item_quantity noselect font_text';
			item.appendChild(quantity);*/
	
			var image = document.createElement('img');
			image.src = './resources/images/items/'+obj['image'];
			image.className = 'item_image';
			item.appendChild(image);

			var name = document.createElement('span');
			name.innerHTML = obj['name']+'<br><span class="noselect font_text" style="font-size:0.7em;">('+key+')</span>';
			name.className = 'font_text noselect';
			name.style.cursor = 'pointer';
			item.appendChild(name);

			items.appendChild(item);
		}
		div.appendChild(items);

		var button = document.createElement('div');
		button.className = 'ui_button font_text noselect';
		button.onclick = function() {
			Game.Sound.Play('click.mp3');
			Game.UI.Hide();
		};
		button.innerHTML = 'Close';
		div.appendChild(button);

		Game.UI.Show(div);
	},
	ShowItem: function(item,index=false) {
		var obj = Game.Items.GetItem(item);

		var div = document.createElement('div');

		var header = document.createElement('div');
		header.className = 'ui_title font_title noselect';
		header.innerHTML = obj['name'];
		div.appendChild(header);

		var subtitle = document.createElement('div');
		subtitle.className = 'ui_subtitle font_text noselect';
		subtitle.innerHTML = 'Item Details';
		div.appendChild(subtitle);

		var items = document.createElement('div');
		items.style.display = 'inline-block';
		items.style.width = '100%';

		var image = document.createElement('img');
		image.src = './resources/images/items/'+obj['image'];
		image.className = 'item_image_large';
		image.title = obj['id'];
		items.appendChild(image);

		var desc = document.createElement('div');
		desc.className = 'font_text ui_text';
		desc.innerHTML = obj['description']+'<br><br>Amount in inventory: '+Game.Items.GetPlayerItemQuantity(obj)+'<br>';
		items.appendChild(desc);

		if (obj.hasOwnProperty('buttons')) {
			obj['buttons'].forEach(function(b) {
				let c = document.createElement('div');
				c.className = 'ui_button font_text noselect';
				c.style.marginRight = '8px';
				c.style.marginLeft = '0px';
				c.style.float = 'none';
				c.style.display = 'inline-block';
				c.onclick = function() {
					Game.Sound.Play('click.mp3');
					try {
						eval(b['function']);
					} catch(e) {
						console.log('Game.Items.ShowItem [anonymous]: Error executing button function: '+e);
					}
				};
				c.innerHTML = b['text'];
				items.appendChild(c);
			});
		}

		div.appendChild(items);

		var button = document.createElement('div');
		button.className = 'ui_button font_text noselect';
		if (!index) {
			button.onclick = function() {
				Game.Sound.Play('click.mp3');
				Game.Items.ShowPlayerItems();
			};
		} else {
			button.onclick = function() {
				Game.Sound.Play('click.mp3');
				Game.Items.ShowItemIndex();
			};
		}
		button.innerHTML = 'Back';
		div.appendChild(button);

		Game.UI.Show(div);
	},
	ShowPlayerItems: function() {
		var div = document.createElement('div');

		var header = document.createElement('div');
		header.className = 'ui_title font_title noselect';
		header.innerHTML = 'Items';
		div.appendChild(header);

		var subtitle = document.createElement('div');
		subtitle.className = 'ui_subtitle font_text noselect';
		subtitle.innerHTML = Game.Story.Me.Name;
		div.appendChild(subtitle);

		var items = document.createElement('div');
		items.style.display = 'inline-block';
		items.style.width = '100%';
		items.className = 'font_text';
		
		if (Game.Story.Items.length < 1) {
			items.innerHTML = 'You don\'t have any items yet!';
		} else {
			var displayed = [];
			Game.Story.Items.forEach(key => {
				var obj = Game.Items.GetItem(key);
				if (displayed.indexOf(obj['id']) == -1) {
					displayed.push(obj['id']);


					var item = document.createElement('div');
					item.className = 'item_box';
					item.key = obj;
					item.onclick = function() {
						Game.Sound.Play('click.mp3');
						Game.Items.ShowItem(this.key);
					}
		
					var quantity_num = Game.Items.GetPlayerItemQuantity(obj);
					if (quantity_num > 1) {
						var quantity = document.createElement('div');
						quantity.innerHTML = 'x'+quantity_num;
						quantity.className = 'item_quantity noselect font_text';
						item.appendChild(quantity);
					}
			
					var image = document.createElement('img');
					image.src = './resources/images/items/'+obj['image'];
					image.className = 'item_image';
					item.appendChild(image);
		
					var name = document.createElement('span');
					name.innerHTML = obj['name'];
					name.className = 'font_text noselect';
					name.style.cursor = 'pointer';
					item.appendChild(name);
		
					items.appendChild(item);
					}
			});
		}
		div.appendChild(items);

		var button = document.createElement('div');
		button.className = 'ui_button font_text noselect';
		button.onclick = function() {
			Game.Sound.Play('click.mp3');
			Game.UI.Hide();
		};
		button.innerHTML = 'Close';
		div.appendChild(button);

		Game.UI.Show(div);
	},
	GetPlayerItemQuantity: function(item) {
		var obj = Game.Items.GetItem(item);
		var quantity = 0;

		Game.Story.Items.forEach(key => {
			var kobj = Game.Items.GetItem(key);
			if (kobj['id'] == obj['id']) quantity++;
		});

		return quantity;
	},
	GetPlayerItem: function(item,dialogue=true) {
		var obj = Game.Items.GetItem(item);
		var q = Game.Items.GetPlayerItemQuantity(item);
		var n = !(q > 0);
		Game.Story.Items.push(obj['id']);
		if (dialogue) {
			if (n) {
				Game.Dialogue.Speak({Who:'Item',Text:'You got a new item!',Color:'#888',Image:'items/'+obj['image'],Sound:"Item.mp3"});
				Game.Dialogue.Speak({Who:'Item',Text:obj['name']+' - '+obj['description'],Color:'#888',Image:'items/'+obj['image'],Sound:false});
				if (Game.Dialogue.LoadedScripts.hasOwnProperty('Items')) {
					if (Game.Dialogue.LoadedScripts['Items'].hasOwnProperty(obj['id'])) {
						Game.Dialogue.Play('Items.json',obj['id']);
					}
				}
			} else {
				Game.Dialogue.Speak({Who:'Item',Text:'You got another '+obj['name']+'! You now have '+(q+1)+'.',Color:'#888',Image:'items/'+obj['image'],Sound:"Item.mp3"});
			}
			if (!Game.Story.Tutorial['Items_Get']) {
				Game.Dialogue.Play('Tutorial.json','Items_Get');
				Game.Story['Tutorial']['Items_Get'] = true;
			}
		}
	},
	BoxIndex: {},
	BoxBase: {},
	ItemsIndex: {}
}
/*
	Example BoxIndex:
	BoxIndex: {
		'BoxA': ['item1','item2','item3'],
		'BoxB': []
	}
*/