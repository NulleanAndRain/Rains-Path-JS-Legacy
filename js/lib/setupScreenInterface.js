let setupScreenInterface = (canvas, context, timer) => {
	let intElems = {
		timer: {}
	};

	let setGameInterface = (timer) =>{
		document.getElementsByTagName('body')[0].addEventListener('contextmenu', e => {
			e.preventDefault();
		});
		const interface=document.getElementById('pause_bg');
		bottomButtonsEvents();
		transparentInterface('pause_container')

		const hide_button = document.getElementById('hide_button');
		const show_button = document.getElementById('show_button');

		const pauseIco = document.getElementById('pauseIco');

		let _func_Hide_noP = () =>{
			hideElem(interface);
			hideElem(hide_button);
			showElem(show_button);
		}
		hide_button.onclick = () =>{
			_func_Hide_noP();
			show_button.classList.remove('transition03s');
			show_button.classList.add('bot-button__hover');
			show_button.focus();
			show_button.classList.add('transition03s');
		}


		const continueButton = document.getElementById('continueButton');

	let _func_Hide = () => {
			_func_Hide_noP();
			hideElem(pauseIco);
			timer.continue();
		}
		continueButton.onclick = () => {
			_func_Hide();
		}

	intElems._func_Hide = _func_Hide;

		let _func_Show = () =>{
			showElem(interface);
			showElem(pauseIco);
			hideElem(show_button);
			showElem(hide_button);
			timer.pause();
		}
		show_button.onclick = () => {
			_func_Show();
			hide_button.classList.remove('transition03s');
			hide_button.classList.add('bot-button__hover');
			hide_button.focus();
			hide_button.classList.add('transition03s');
		}

	intElems._func_Show = _func_Show;




		const pauseMenu = document.getElementById('pauseMenu');
		const pauseSettings = document.getElementById('pauseSettings');

		const settingsButton = document.getElementById('settingsButton');
		settingsButton.onclick = () => {
			hideElem(pauseMenu);
			showElem(pauseSettings);
		}

		const pauseSettingsBack = document.getElementById('pauseSettingsBack');
		pauseSettingsBack.onclick = () => {
			hideElem(pauseSettings);
			showElem(pauseMenu);
		}

		const restartButton = document.getElementById('restartButton');

		restartButton.onclick = () => {
			if(!localStorage.getItem('autosave')){}
			else localStorage.removeItem('autosave');
			document.location.reload();
		}

		// settings

		const setting_smoothing = document.getElementById('setting_smoothing');
		const setting_smoothing_slider = document.getElementById('setting_smoothing_slider');

		if(localStorage.getItem('setting_smoothing')){
			setting_smoothing_slider.classList.add('setting_checkbox_slider__active');
			_smoothing=true;
			_ctx.imageSmoothingEnabled = _smoothing;
		}

		setting_smoothing.onclick = () =>{
			if(localStorage.getItem('setting_smoothing')){
				setting_smoothing_slider.classList.remove('setting_checkbox_slider__active');
				_smoothing=false;
				localStorage.removeItem('setting_smoothing');
			} else {
				setting_smoothing_slider.classList.add('setting_checkbox_slider__active');
				_smoothing=true;
				localStorage.setItem('setting_smoothing', true);
			}
			_ctx.imageSmoothingEnabled = _smoothing;
		}

		const setting_autojump = document.getElementById('setting_autojump');
		const setting_autojump_slider = document.getElementById('setting_autojump_slider');

		if(localStorage.getItem('setting_autojump')){
			setting_autojump_slider.classList.remove('setting_checkbox_slider__active');
			_autojump = false;
		}

		setting_autojump.onclick = () =>{
			if(localStorage.getItem('setting_autojump')){
				setting_autojump_slider.classList.add('setting_checkbox_slider__active');
				_autojump = true;
				localStorage.removeItem('setting_autojump');
			} else {
				setting_autojump_slider.classList.remove('setting_checkbox_slider__active');
				_autojump = false;
				localStorage.setItem('setting_autojump', true);
			}
		}

		const setting_bgBlur = document.getElementById('setting_bgBlur');
		const setting_bgBlur_slider = document.getElementById('setting_bgBlur_slider');

		if(localStorage.getItem('setting_bgBlur')){
			setting_bgBlur_slider.classList.remove('setting_checkbox_slider__active');
			_bgBlur = false;
		}

		setting_bgBlur.onclick = () =>{
			if(!localStorage.getItem('setting_bgBlur')){
				setting_bgBlur_slider.classList.remove('setting_checkbox_slider__active');
				_bgBlur = false;
				localStorage.setItem('setting_bgBlur', true);
			} else {
				setting_bgBlur_slider.classList.add('setting_checkbox_slider__active');
				_bgBlur = true;
				localStorage.removeItem('setting_bgBlur');
			}
		}


		const _pauseIcoIMG = document.getElementById('_pauseIcoIMG');

		const setting_pauseIco = document.getElementById('setting_pauseIco');
		const setting_pauseIco_slider = document.getElementById('setting_pauseIco_slider');

		if(localStorage.getItem('setting_pauseIcoOff')){
			_pauseIcoIMG.classList.add('hidden');
			setting_pauseIco_slider.classList.remove('setting_checkbox_slider__active');
		}

		setting_pauseIco.onclick = () => {
			if(!localStorage.getItem('setting_pauseIcoOff')){
				_pauseIcoIMG.classList.add('hidden');
				setting_pauseIco_slider.classList.remove('setting_checkbox_slider__active');
				localStorage.setItem('setting_pauseIcoOff', true);
			} else {
				_pauseIcoIMG.classList.remove('hidden');
				setting_pauseIco_slider.classList.add('setting_checkbox_slider__active');
				localStorage.removeItem('setting_pauseIcoOff');
			}
		}


		const setting_mobile_ScreenTouchStop = document.getElementById('setting_mobile_ScreenTouchStop');
		const setting_mobile_ScreenTouchStop_slider = document.getElementById('setting_mobile_ScreenTouchStop_slider');
		const mobileInt = document.getElementById('mobileInt');

		if(localStorage.getItem('setting_mobile_ScreenTouchStop')){
			mobileInt.onclick = () => {};
			setting_mobile_ScreenTouchStop_slider.classList.remove('setting_checkbox_slider__active');
		}

		setting_mobile_ScreenTouchStop.onclick = () => {
			if(setting_mobile_ScreenTouchStop_slider.classList.contains('setting_checkbox_slider__active')){
				setting_mobile_ScreenTouchStop_slider.classList.remove('setting_checkbox_slider__active');
				mobileInt.onclick = () => {};
				localStorage.setItem('setting_mobile_ScreenTouchStop', true);
			} else {
				setting_mobile_ScreenTouchStop_slider.classList.add('setting_checkbox_slider__active');
				__ScreenStopRestoreFunc();
				localStorage.removeItem('setting_mobile_ScreenTouchStop');
			}
		}


		const settingsReset = document.getElementById('settingsReset');
		settingsReset.onclick = () =>{
			setting_smoothing_slider.classList.remove('setting_checkbox_slider__active');
			_smoothing=false;
			_ctx.imageSmoothingEnabled = _smoothing;
			localStorage.removeItem('setting_smoothing');

			localStorage.removeItem('setting_debug');
			_collDebug = false;
			
			setting_autojump_slider.classList.add('setting_checkbox_slider__active');
			_autojump = true;
			localStorage.removeItem('setting_autojump');

			setting_bgBlur_slider.classList.add('setting_checkbox_slider__active');
			_bgBlur = true;
			localStorage.removeItem('setting_bgBlur');

			setting_pauseIco_slider.classList.add('setting_checkbox_slider__active');
			_pauseIcoIMG.classList.remove('hidden');
			localStorage.removeItem('setting_pauseIcoOff');

			setting_mobile_ScreenTouchStop_slider.classList.add('setting_checkbox_slider__active');
			localStorage.removeItem('setting_mobile_ScreenTouchStop');
			if(!setting_mobile_ScreenTouchStop.classList.contains('hidden')){
				__ScreenStopRestoreFunc();
			}
		}

		const fullscreen = document.getElementById('fullscreen');
		fullscreen.onclick = toggleFullscreen;


		//		health 
	//tbd later

		const healthBar = document.getElementById('healthBar');
		const healthLine = document.getElementById('healthLine');
		const healthNum = document.getElementById('healthNum');

	intElems.healthBar = {healthLine, healthNum};

		healthBar.onmouseover = () => {
			healthLine.classList.add('healthLine_bright');
			healthNum.classList.add('healthNum_bright');
		}
		healthBar.onmouseout = () => {
			healthLine.classList.remove('healthLine_bright');
			healthNum.classList.remove('healthNum_bright');
		}

		//sizing

		const sizing__topLine = document.getElementById('sizing__topLine');
		const zoomSize = document.getElementById('zoomSize');
		sizing__topLine.onmouseover = () => {
			zoomSize.classList.add('zoomSize_active');
		}
		sizing__topLine.onmouseout = () => {
			zoomSize.classList.remove('zoomSize_active');
		}
	}

	let toggleFullscreen = () =>{
		if(document.fullscreenElement) document.exitFullscreen(); 
		else document.documentElement.requestFullscreen();
	}

	let setSizingButtons = (canvas, context) =>{
		const currSize = document.getElementById('currSize');
		
		const zoomIn = document.getElementById('zoomIn');
		zoomIn.onclick = () => {
			if(canvResize<3){
				canvResize++;
				currSize.innerHTML = `Приближение: ${canvResize}`;
				resizeAnim(resizeConst[canvResize], canvas, context);
				resetButtons();
				setTimeout(()=>setSizingButtons(canvas, context), 505);
			}
		}

		const zoomOut = document.getElementById('zoomOut');
		zoomOut.onclick = () => {
			if(canvResize>0){
				canvResize--;
				currSize.innerHTML = `Приближение: ${canvResize}`;
				resizeAnim(resizeConst[canvResize], canvas, context);
				resetButtons();
				setTimeout(()=>setSizingButtons(canvas, context), 505);
			}
		}

		const zoomReset = document.getElementById('zoomReset');
		zoomReset.onclick = () => {
			if(canvResize!=2){
				canvResize=2;
				currSize.innerHTML = `Приближение: ${canvResize}`;
				resizeAnim(resizeConst[canvResize], canvas, context);
				resetButtons();
				setTimeout(()=>setSizingButtons(canvas, context), 505);
			}
		}

		window.addEventListener('keydown', e=>{
			if(e.key=='-'||e.key=='_'){
				zoomOut.onclick();
			}

			if(e.key=='+'||e.key=='='){
				zoomIn.onclick();
			}

			if(e.key=='Backspace'){
				zoomReset.onclick();
			}
		});
	}

	let resetButtons = () =>{
		const zoomIn = document.getElementById('zoomIn');
		zoomIn.onclick = () => {}

		const zoomOut = document.getElementById('zoomOut');
		zoomOut.onclick = () => {}

		const zoomReset = document.getElementById('zoomReset');
		zoomReset.onclick = () => {}
	}


	setSizingButtons(canvas, context);
	setGameInterface(timer);

	return intElems;
}