var canvResize = 2;
const resizeConst = [942, 744, 602, 482];
const _TILESIZE = 8;
var canvWidth = resizeConst[canvResize];
var _canvHeight = 1;

const alphaVer = 'v0.3.5.1 alpha';


var healthNum;
var healthLine;

//		settings
var _smoothing = false;
var _bgBlur = true;
var _autojump = true;
var _shadowsEnabled = false;

const _respawnTime = 10000;

const buttonsClassic = ['Space', 'KeyA', 'KeyD', 'ShiftLeft', 'KeyE', 'KeyQ', 'KeyZ'];


//debug
var _collDebug = false;
var _frametime = 0;
var _frametimeDebug = false;

var _canvas = document.createElement('canvas');
	_canvas.width=958;
	_canvas.height=445;
var _ctx = _canvas.getContext('2d');

window.onload = () =>{
	const screen = document.getElementById('screen');
	const context = screen.getContext('2d');

	healthNum = document.getElementById('healthNum');
	healthLine = document.getElementById('healthLine');

	document.getElementById('alphaVer').innerHTML = alphaVer;

	context.imageSmoothingEnabled = false;

	vertResize(screen);

	//game
	_ctx.imageSmoothingEnabled = _smoothing;

	//  const buttonsAlt = ['ArrowUp', 'ArrowLeft', 'ArrowRight'];

	const camera = new Camera(_canvas.width, _canvas.height);
	
	Promise.all([
		loadLevel(camera),
		loadLenaSprite(),
		loadBoxSprite(),
	]).then(([level, LenaSprites, boxSprites])=>{

		let Rain = new Player(LenaSprites, 128, 0);
		level.entities.add(Rain);

		let box = new Box(boxSprites, 240, 0);
		level.entities.add(box);

		let splashes = new Set();


		let timer = new Timer(1000/144);
		timer.update = (deltaTime) => {
			level.update(deltaTime, camera);
			camera.move(Rain, level);

			splashes.forEach(splash =>{
				splash.update(deltaTime);
			})
		}

		timer.drawFrame  = () => {
			level.drawFrame(camera);
		}

		timer.start();

		setKeyboardEvents(Rain, timer, ...buttonsClassic);
		let intElems = setupScreenInterface(screen, context, timer);

		setPauseKey('Escape', 'Backquote', timer, intElems);

		drawContent(screen, context, Rain, camera, splashes);

		setupScreenSplash(splashes);
	});
}

if(localStorage.getItem('setting_debug')){
	_collDebug = true;
}
window.toggle_collDebug = () =>{
	if(_collDebug){
		_collDebug = false;
		localStorage.removeItem('setting_debug');
		return 'collision debug disabled';
	}
	else{
		_collDebug = true;
		localStorage.setItem('setting_debug', true);
		return 'collision debug enabled';
	}
}