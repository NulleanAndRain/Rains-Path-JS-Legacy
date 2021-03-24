var _keyStates = new Map();
var _lastKey;

let setKeyboardEvents = (player, timer, keyJump, keyLeft, keyRight, keyRun, keyAttack, keySkill, keyTestEvent) =>{
	window.addEventListener('keydown', event=>{
		if(timer.isPaused) return;
		if(player.isDowned){
			_keyStates.lenght = 0;
			_lastKey = null;
			return;
		}
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
			player.run();
		}

		if(event.code==keyAttack){
			player.attack();
		}
		if(event.code==keySkill){
			player.skill();
		}


		if(event.code==keyTestEvent){
			player.buttonTestEvent();
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
			player.stopRun();
		}
	});

	keyboardFunc(player, keyLeft, keyRight, timer);
}

let keyboardFunc = (player, keyLeft, keyRight, timer) => {
	if(player.isDowned){
		setTimeout(()=> keyboardFunc(player, keyLeft, keyRight, timer), 0);
		return;
	}

	if(_keyStates.get(_lastKey)=='pressed'){
		if(_lastKey==keyLeft){
			player.moveLeft(timer.deltaTime);
		}
		if(_lastKey==keyRight){
			player.moveRight(timer.deltaTime);
		}
	} else if(_keyStates.get(_lastKey)=='released'){
		if(_lastKey==keyLeft){
			if(_keyStates.get(keyRight)=='pressed'){
				_lastKey = keyRight;
				player.moveRight(timer.deltaTime);
			}
			else player.stopMoving();
		}
		if(_lastKey==keyRight){
			if(_keyStates.get(keyLeft)=='pressed'){
				_lastKey = keyLeft;
				player.moveLeft(timer.deltaTime);
			}
			else player.stopMoving();
		}
	}
	setTimeout(()=> keyboardFunc(player, keyLeft, keyRight, timer), 0);
}

let setPauseKey = (keyPause, keyPauseAlt, timer, intElems) =>{
	window.addEventListener('keydown', event=>{
		if(event.code==keyPause || event.code==keyPauseAlt){
			if(timer.isPaused) {
				intElems._func_Hide();
				timer.continue();
			}
			else{
				intElems._func_Show();
				timer.pause();
			}
		}
	});
}