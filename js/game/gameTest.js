var _canvas = document.createElement('canvas');
var _ctx = _canvas.getContext('2d');

var _smoothing = true;		//tbd in settings
var _collDebug = false;

const __TEST_AREA = true;

const buttonsClassic = ['Space', 'KeyA', 'KeyD', 'ShiftLeft'];

const _TILESIZE = 8;

window.onload = () =>{
	// let canvas = document.getElementById('screen');
	// 	_canvas.width=canvas.width;
	// 	_canvas.height=canvas.height;
	// let context = canvas.getContext('2d');

	_canvas = document.getElementById('screen');
	_ctx = _canvas.getContext('2d');

	_ctx.imageSmoothingEnabled = _smoothing;	//tbd in settings

	//  const buttonsAlt = ['ArrowUp', 'ArrowLeft', 'ArrowRight'];

	const camera = new Camera(_canvas.width, _canvas.height);
	
	Promise.all([
		loadSky(),
		// loadMarioSprite(),
		loadLevel(camera),
		loadLenaSprite(),
	]).then(([Sky, level, LenaSprites])=>{

		let Rain = new Entity(LenaSprites, 128, 0);

		Rain.setOffset(4, 4, 2);

		level.entities.add(Rain);

		let timer = new Timer(1000/250);
		timer.update = (deltaTime) => {
			_ctx.drawImage(Sky, 0, 0);
			level.update(deltaTime, camera);
			camera.move(Rain, level);

			if(!Rain.respTimed){
				if(Rain.pos.x<-Rain.offset.left){
					Rain.stopMoving();
					Rain.pos.x=-Rain.offset.left;
				}

				if(Rain.pos.x>camera.pos.x+camera.size.x-Rain.spritesheet.width+Rain.offset.right){
					Rain.stopMoving();
					Rain.pos.x=camera.pos.x+camera.size.x-Rain.spritesheet.width+Rain.offset.right;
				}

				if(camera.underMap){
					if(!Rain.respTimed){
						Rain.respTimed = true;
						setTimeout(() => {
							console.log('Rain выпала из мира');
							Rain.pos.x=32;
							Rain.pos.y-0;
							Rain.stopMoving();
							Rain.land(0);
							camera.pos.x=0;
							camera.underMap=false;
							Rain.respTimed = false
						}, 1000);
					}
				}
			}

			// context.drawImage(_canvas,
			// 	(canvas.width-_canvas.width)/2,
			// 	(canvas.height-_canvas.height)/2);
		}
		timer.start();

		setKeyboardEvents(Rain, ...buttonsClassic);
		setPauseKey('Escape', timer);

		setupMouseControl(_canvas, Rain, camera);
	});
}


let setPauseKey = (keyPause, timer) =>{
	window.addEventListener('keydown', (event)=>{
		if(event.code==keyPause){
			if(timer.isPaused) timer.continue();
			else timer.pause();
		}
	});
}