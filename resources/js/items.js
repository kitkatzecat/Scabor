Game.Items = {
	Open: function(box,text='A drawer...') {
		if (typeof Game.Items.BoxIndex == "undefined" || Game.Items.BoxIndex == false) {
			console.log('Game.Items.Open: No boxes are loaded or box Index is undefined');
		} else if (typeof Game.Items.BoxIndex[box] == "undefined") {
			console.log('Game.Items.Open: Box Index "'+box+'" does not exist');
		} else {
			box = Game.Items.BoxIndex[box];
			if (box.length == 0) {
				Game.Dialogue.Line({Who:"Me",Text:text});
				Game.Dialogue.Line({Who:"Me",Text:"...looks like it's empty."});
			} else {
				Game.Dialogue.Line({Who:"Me",Text:text});
				Game.Dialogue.Line({Who:"Me",Text:"...looks like there are "+box.length+" items in it. [INDEV]"});
			}
		}
	},
	Init: function() {
		Game.CSS.Load('items.css');

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
	},
	GetItem: function(item) {
		if (typeof item == 'string') {
			if (typeof Game.Items.ItemsIndex[item] != 'undefined') {
				return Object.assign(Game.Items.ItemsIndex['default'],Game.Items.ItemsIndex[item]);
			} else {
				console.log('Game.Items.GetItem: Unrecognized item type "'+item+'" - returning default item');
				return Game.Items.ItemsIndex['default'];
			}
		} else if (typeof item == 'object') {
			return Object.assign(Game.Items.ItemsIndex['default'],item);
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
			item.onclick = function() {
				Game.Sound.Play('click.mp3');
			}

			var quantity = document.createElement('div');
			quantity.innerHTML = 'x3';
			quantity.className = 'item_quantity noselect font_text';
			item.appendChild(quantity);
	
			var image = document.createElement('img');
			image.src = './resources/images/items/'+obj['image'];
			image.className = 'item_image';
			item.appendChild(image);

			var name = document.createElement('span');
			name.innerHTML = obj['name']+'<br><span class="noselect font_text" style="font-size:0.7em;">('+key+')</span>';
			name.className = 'font_text noselect';
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
		button.innerHTML = 'Close'
		div.appendChild(button);

		Game.UI.Show(div);
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