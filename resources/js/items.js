Game.Items = {
	Open: function(box,text='A drawer...') {
		if (typeof Game.Items.Index == "undefined" || Game.Items.Index == false) {
			console.log('Game.Items.Open: No boxes are loaded or box index is undefined');
		} else if (typeof Game.Items.Index[box] == "undefined") {
			console.log('Game.Items.Open: Box index "'+box+'" does not exist');
		} else {
			box = Game.Items.Index[box];
			if (box.length == 0) {
				Game.Dialogue.Line({Who:"Me",Text:text});
				Game.Dialogue.Line({Who:"Me",Text:"...looks like it's empty."});
			} else {
				Game.Dialogue.Line({Who:"Me",Text:text});
				Game.Dialogue.Line({Who:"Me",Text:"...looks like there are "+box.length+" items in it. [INDEV]"});
			}
		}
	},
	Index: false
}
/*
	Example index:
	Index: {
		'BoxA': ['item1','item2','item3'],
		'BoxB': []
	}
*/