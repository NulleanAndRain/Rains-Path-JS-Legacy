//bgLoad, vertResize, drawBg from lib/bgLoad.js
//hideElem, showElem, bottomButtonsEvents from lib/elemHiding.js
//selectButton, unselectButton from lib/buttonSelect.js

window.onload = () => {
	bgLoad("./img/mainMenuBgLineart.png");			//animated pixel art tbd here

	portraitWarning();
	menuButtons();
	bottomButtonsEvents('menu_container');
	transparentInterface('menu_container');
}

let portraitWarning = () => {
	const portraitOrient = document.getElementById('portraitOrient');
	const portraitOk = document.getElementById('portraitOk');

	portraitOk.onclick = () =>{
		hideElem(portraitOrient);
	}
}

let menuButtons = () =>{
	const gameTab		= document.getElementById('game-tab');		//tabs
	const settingsTab = document.getElementById('settings-tab');
	const helpTab		= document.getElementById('help-tab');
	const aboutTab	= document.getElementById('about-tab');

	const gameNavButton		= document.getElementById('gameNavButton'); //navigation buttons
	const settingsNavButton	= document.getElementById('settingsNavButton');
	const helpNavButton		= document.getElementById('helpNavButton');
	const aboutNavButton		= document.getElementById('aboutNavButton')


	const tabs = document.getElementsByClassName('menu-tab');
	const navButtons = document.getElementsByClassName('nav_button');


	gameNavButton.onclick = () =>{
		if(!gameNavButton.classList.contains('nav_button__selected')){
			for(let elem of tabs)		hideElem(elem);
			for(let elem of navButtons)	unselectButton(elem);

			showElem(gameTab);
			selectButton(gameNavButton);
		}
	}
	settingsNavButton.onclick = () =>{
		if(!settingsNavButton.classList.contains('nav_button__selected')){
			for(let elem of tabs)		hideElem(elem);
			for(let elem of navButtons)	unselectButton(elem);

			showElem(settingsTab);
			selectButton(settingsNavButton);
		}
	}
	helpNavButton.onclick = () =>{
		if(!helpNavButton.classList.contains('nav_button__selected')){
			for(let elem of tabs)		hideElem(elem);
			for(let elem of navButtons)	unselectButton(elem);

			showElem(helpTab);
			selectButton(helpNavButton);
		}
	}
	aboutNavButton.onclick = () =>{
		if(!aboutNavButton.classList.contains('nav_button__selected')){
			for(let elem of tabs)		hideElem(elem);
			for(let elem of navButtons)	unselectButton(elem);

			showElem(aboutTab);
			selectButton(aboutNavButton);
		}
	}

	//settings

	const setting_smoothing = document.getElementById('setting_smoothing');
	const setting_smoothing_slider = document.getElementById('setting_smoothing_slider');

	if(localStorage.getItem('setting_smoothing')){
		setting_smoothing_slider.classList.add('setting_checkbox_slider__active');
	}

	setting_smoothing.onclick = () =>{
		if(setting_smoothing_slider.classList.contains('setting_checkbox_slider__active')){
			setting_smoothing_slider.classList.remove('setting_checkbox_slider__active');
			localStorage.removeItem('setting_smoothing');
		} else {
			setting_smoothing_slider.classList.add('setting_checkbox_slider__active');
			localStorage.setItem('setting_smoothing', true);
		}
	}

	const setting_debug = document.getElementById('setting_debug');
	const setting_debug_slider = document.getElementById('setting_debug_slider');

	if(localStorage.getItem('setting_debug')){
		setting_debug_slider.classList.add('setting_checkbox_slider__active');
	}

	setting_debug.onclick = () =>{
		if(setting_debug_slider.classList.contains('setting_checkbox_slider__active')){
			setting_debug_slider.classList.remove('setting_checkbox_slider__active');
			localStorage.removeItem('setting_debug');
		} else {
			setting_debug_slider.classList.add('setting_checkbox_slider__active');
			localStorage.setItem('setting_debug', true);
		}
	}

	const setting_bgBlur = document.getElementById('setting_bgBlur');
	const setting_bgBlur_slider = document.getElementById('setting_bgBlur_slider');

	if(localStorage.getItem('setting_bgBlur')){
		setting_bgBlur_slider.classList.remove('setting_checkbox_slider__active');
	}

	setting_bgBlur.onclick = () =>{
		if(setting_bgBlur_slider.classList.contains('setting_checkbox_slider__active')){
			setting_bgBlur_slider.classList.remove('setting_checkbox_slider__active');
			localStorage.setItem('setting_bgBlur', true);
		} else {
			setting_bgBlur_slider.classList.add('setting_checkbox_slider__active');
			localStorage.removeItem('setting_bgBlur');
		}
	}

	const setting_pauseIco = document.getElementById('setting_pauseIco');
	const setting_pauseIco_slider = document.getElementById('setting_pauseIco_slider');

	if(localStorage.getItem('setting_pauseIcoOff')){
		setting_pauseIco_slider.classList.remove('setting_checkbox_slider__active');
	}

	setting_pauseIco.onclick = () => {
		if(setting_pauseIco_slider.classList.contains('setting_checkbox_slider__active')){
			setting_pauseIco_slider.classList.remove('setting_checkbox_slider__active');
			localStorage.setItem('setting_pauseIcoOff', true);
		} else {
			setting_pauseIco_slider.classList.add('setting_checkbox_slider__active');
			localStorage.removeItem('setting_pauseIcoOff');
		}
	}


	const setting_mobile_ScreenTouchStop = document.getElementById('setting_mobile_ScreenTouchStop');
	const setting_mobile_ScreenTouchStop_slider = document.getElementById('setting_mobile_ScreenTouchStop_slider');

	if(localStorage.getItem('setting_mobile_ScreenTouchStop')){
		setting_mobile_ScreenTouchStop_slider.classList.remove('setting_checkbox_slider__active');
	}

	setting_mobile_ScreenTouchStop.onclick = () => {
		if(setting_mobile_ScreenTouchStop_slider.classList.contains('setting_checkbox_slider__active')){
			setting_mobile_ScreenTouchStop_slider.classList.remove('setting_checkbox_slider__active');
			localStorage.setItem('setting_mobile_ScreenTouchStop', true);
		} else {
			setting_mobile_ScreenTouchStop_slider.classList.add('setting_checkbox_slider__active');
			localStorage.removeItem('setting_mobile_ScreenTouchStop');
		}
	}

//mobile
//_user var from ../css/ie.js
if(_user.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/)){
	setting_mobile_ScreenTouchStop.classList.remove('hidden');
	setting_mobile_ScreenTouchStop.style.position = "relative";

	const botButtons = document.getElementsByClassName('bot-button-wrapper');
	botButtons.item(0).style.fontSize = '1.5em';

	const helpPC = document.getElementById('helpPC');
	const helpMobile = document.getElementById('helpMobile');
	helpPC.classList.add('hidden');
	helpMobile.classList.remove('hidden');
}

	const settingsReset = document.getElementById('settingsReset');
	settingsReset.onclick = () =>{
		setting_smoothing_slider.classList.remove('setting_checkbox_slider__active');
		localStorage.removeItem('setting_smoothing');

		setting_debug_slider.classList.remove('setting_checkbox_slider__active');
		localStorage.removeItem('setting_debug');

		setting_bgBlur_slider.classList.add('setting_checkbox_slider__active');
		localStorage.removeItem('setting_bgBlur');

		setting_pauseIco_slider.classList.add('setting_checkbox_slider__active');
		localStorage.removeItem('setting_pauseIcoOff');

		setting_mobile_ScreenTouchStop_slider.classList.add('setting_checkbox_slider__active');
		localStorage.removeItem('setting_mobile_ScreenTouchStop');
	}
}