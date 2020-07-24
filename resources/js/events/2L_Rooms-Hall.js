Game[Game.JS.GetName('events/2L_Rooms-Hall.js')] = {
	Init: function() {},
	'Interact_Door_Storage': function() {
		if (Game['Events__Game']['Check_Keycard']('Green')) {
			Game.Dialogue.Play('Doors.json','2L_Storage_Enter');
		} else {
			Game.Dialogue.Play('Doors.json','Locked');
		}
	}
}