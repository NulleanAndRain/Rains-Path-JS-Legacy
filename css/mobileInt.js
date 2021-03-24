//_user var from ../css/ie.js
if(_user.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/)){

// settings

	const setting_mobile_ScreenTouchStop = document.getElementById('setting_mobile_ScreenTouchStop');

	setting_mobile_ScreenTouchStop.classList.remove('hidden');
	setting_mobile_ScreenTouchStop.style.position = "relative";


	//

	const mobileInt = document.getElementById('mobileInt');
	mobileInt.classList.remove('hidden');

	const mobileButtonLeft = document.getElementById('mobileButtonLeft');
	const mobileButtonRight = document.getElementById('mobileButtonRight');
	const mobileButtonJump = document.getElementById('mobileButtonJump');
	const mobileButtonShift = document.getElementById('mobileButtonShift');
	

	setKeyboardEvents = (player, keyJump, keyLeft, keyRight, keyRun) =>{
		mobileButtonJump.onclick = () => {
			player.jump();
		}

		mobileButtonLeft.onclick = () => {
			if(player.onMove && player.movement.left){
				_keyStates.set(keyLeft, 'released');
				_keyStates.set(keyRight, 'released');
			} else {
				_lastKey = keyLeft;
				_keyStates.set(keyLeft, 'pressed');
			}
		}

		mobileButtonRight.onclick = () => {
			if(player.onMove && player.movement.right){
				_keyStates.set(keyLeft, 'released');
				_keyStates.set(keyRight, 'released');
			} else {
				_lastKey = keyRight;
				_keyStates.set(keyRight, 'pressed');
			}
		}

		mobileButtonShift.onclick = () => {
			if(mobileButtonShift.classList.contains('mobile-button-shift_active')){
				_keyStates.set(keyRun, 'released');
				mobileButtonShift.classList.remove('mobile-button-shift_active');
			} else {
				_keyStates.set(keyRun, 'pressed');
				mobileButtonShift.classList.add('mobile-button-shift_active');
			}
		}

		mobileInt.onclick = cursor => {
			if( !mobileButtonLeft.contains(cursor.target) &&
				!mobileButtonRight.contains(cursor.target) &&
				!mobileButtonJump.contains(cursor.target) &&
				!mobileButtonShift.contains(cursor.target)){
				_keyStates.set(keyLeft, 'released');
				_keyStates.set(keyRight, 'released');
			}
		}

		keyboardFunc(player, keyLeft, keyRight, keyRun);

		__ScreenStopRestoreFunc = __createScreenStopRestoreFunc(keyLeft, keyRight);
	}
	__collisionStops = false;

	const botButtons = document.getElementsByClassName('bot-button-wrapper');
	botButtons.item(0).style.fontSize = '1.5em';

	const sizing = document.getElementsByClassName('sizing');
	sizing.item(0).style.fontSize = '2.5em';
}

var __ScreenStopRestoreFunc;

var __createScreenStopRestoreFunc = (keyLeft, keyRight) => {
	const mobileButtonLeft = document.getElementById('mobileButtonLeft');
	const mobileButtonRight = document.getElementById('mobileButtonRight');
	const mobileButtonJump = document.getElementById('mobileButtonJump');
	const mobileButtonShift = document.getElementById('mobileButtonShift');

	let __restore = () => {
		const mobileInt = document.getElementById('mobileInt');
		mobileInt.onclick = cursor => {
			if( !mobileButtonLeft.contains(cursor.target) &&
				!mobileButtonRight.contains(cursor.target) &&
				!mobileButtonJump.contains(cursor.target) &&
				!mobileButtonShift.contains(cursor.target)){
				_keyStates.set(keyLeft, 'released');
				_keyStates.set(keyRight, 'released');
			}
		}
	};
	return __restore;
}