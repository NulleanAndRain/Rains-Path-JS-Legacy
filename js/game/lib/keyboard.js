var _keyStates = new Map();
var _lastKey;

let setKeyboardEvents = (player, keyJump, keyLeft, keyRight, keyRun) =>{
	window.addEventListener('keydown', (event)=>{
		if(event.code==keyJump) {
			player.jump();
		}

		if(event.code==keyLeft){
			_lastKey = keyLeft;
			_keyStates.set(keyLeft, 'pressed');
		}

		if(event.code==keyRight){
			_lastKey = keyRight;
			_keyStates.set(keyRight, 'pressed');
		}

		if(event.code==keyRun){
			_keyStates.set(keyRun, 'pressed');
		}
	});

	window.addEventListener('keyup', (event)=>{
		if(event.code==keyLeft) {
			_keyStates.set(keyLeft, 'released');
		}

		if(event.code==keyRight) {
			_keyStates.set(keyRight, 'released');
		}

		if(event.code==keyRun){
			_keyStates.set(keyRun, 'released');
		}
	});

	keyboardFunc(player, keyLeft, keyRight, keyRun);
}

let keyboardFunc = (player, keyLeft, keyRight, keyRun) => {
	if(_keyStates.get(_lastKey)=='pressed'){
		if(_lastKey==keyLeft){
			player.moveLeft();
		}
		if(_lastKey==keyRight){
			player.moveRight();
		}
	} else if(_keyStates.get(_lastKey)=='released'){
		if(_lastKey==keyLeft){
			if(_keyStates.get(keyRight)=='pressed') player.moveRight();
			else player.stopMoving();
		}
		if(_lastKey==keyRight){
			if(_keyStates.get(keyLeft)=='pressed') player.moveLeft();
			else player.stopMoving();
		}
	}

	if(_keyStates.get(keyRun)=='pressed'){
		player.run();
	} else if(_keyStates.get(keyRun)=='released'){
		player.stopRun();
	}


	setTimeout(()=> keyboardFunc(player, keyLeft, keyRight, keyRun), 0);
}
