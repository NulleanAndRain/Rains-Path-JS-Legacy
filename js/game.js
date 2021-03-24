var canvResize = 2;
const resizeConst = [942, 744, 602, 482];
const _TILESIZE = 8;
var canvWidth = resizeConst[2];

const alphaVer = 'v0.3.0.0 alpha';

//		settings
var _smoothing = false;		
var _collDebug = false;
var _bgBlur = true;

const buttonsClassic = ['Space', 'KeyA', 'KeyD', 'ShiftLeft', 'KeyE', 'KeyQ', 'KeyZ'];


var _canvas = document.createElement('canvas');
	_canvas.width=958;
	_canvas.height=445;
var _ctx = _canvas.getContext('2d');

window.onload = () =>{
	const screen = document.getElementById('screen');
	const context = screen.getContext('2d');

	document.getElementById('alphaVer').innerHTML = alphaVer;

	context.imageSmoothingEnabled = false;

	vertResize(screen);

	//game
	_ctx.imageSmoothingEnabled = _smoothing;	//tbd in settings

	//  const buttonsAlt = ['ArrowUp', 'ArrowLeft', 'ArrowRight'];

	const camera = new Camera(_canvas.width, _canvas.height);
	// const camera = new Camera(screen.width, screen.height);
	
	Promise.all([
		loadSky(),
		loadLevel(camera),
		loadLenaSprite(),
		loadBoxSprite(),
	]).then(([Sky, level, LenaSprites, boxSprites])=>{

		let Rain = new Player(LenaSprites, 128, 0);
		level.entities.add(Rain);

		let box = new Box(boxSprites, 240, 0);
		level.entities.add(box);


		let timer = new Timer(1000/144);
		timer.update = (deltaTime) => {
			level.update(deltaTime, camera);
			camera.move(Rain, level);
		}

		timer.drawFrame  = () => {
			_ctx.drawImage(Sky, 0, 0);
			level.drawFrame(camera);
		}

		timer.start();

		setKeyboardEvents(Rain, ...buttonsClassic);
		let intElems = setupScreenInterface(screen, context, timer);

		setPauseKey('Escape', 'Backquote', timer, intElems);

		drawContent(screen, context, Rain, camera);
	});
}

let setPauseKey = (keyPause, keyPauseAlt, timer, intElems) =>{
	window.addEventListener('keydown', (event)=>{
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