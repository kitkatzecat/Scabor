Game.Story = {};
(function() {
	var request = new XMLHttpRequest;
	
	request.open('GET', 'resources/story.json', true);
	
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			if (request.status == 200) {
				var result = request.responseText;
				try {
					result = JSON.parse(result);
					Game.Story = result;
					console.log('Game.Story [anonymous]: Story loaded');
				} catch(err) {
					console.log('Game.Story [anonymous]: Unable to load story (JSON parse): '+err);
				}
			} else {
				console.log('Game.Story [anonymous]: Unable to load story (AJAX request): '+request.statusText);
			}
		}
	};
	
	request.setRequestHeader("Cache-Control", "no-cache");
	request.send(null);
})();