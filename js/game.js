var canvResize
if(!localStorage.getItem('canvResize')){
	canvResize = 2;
	localStorage.setItem('canvResize', canvResize);
} else {
	canvResize = localStorage.getItem('canvResize');
}

const resizeConst = [942, 744, 602, 482];
const _TILESIZE = 8;
const _CHUNKSIZE = 16;
const _CHUNKPIXELS = _TILESIZE*_CHUNKSIZE;
var canvWidth = resizeConst[canvResize];
var _canvHeight = 1;

const alphaVer = 'v0.4.1.2 alpha';

var healthNum;
var healthLine;

//		settings
var _smoothing = false;
var _bgBlur = true;
var _autojump = true;
var _shadowsEnabled = false;
var _chunkGrid = false;

const _respawnTime = 1000;

const buttonsClassic = ['Space', 'KeyA', 'KeyD', 'ShiftLeft', 'KeyE', 'KeyQ', 'KeyZ'];


//debug
var _collDebug = false;
var _frametimeDebug = false;


var _canvas = document.createElement('canvas');
	_canvas.width  = 958 + 2*_CHUNKPIXELS;
	_canvas.height = 445 + 2*_CHUNKPIXELS;
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

		let pos = level.respswn;
		let Rain = new Player(LenaSprites, pos.x, pos.y);
		level.entities.add(Rain);

		window.Rain = Rain;

		let box = new Box(boxSprites, 40, 0);
		level.entities.add(box);

		let splashes = new Set();

		camera.getLevel = () =>{
			return level;
		}
		camera.createSubcamera();

		let timer = new Timer(1000/144);
		timer.update = (deltaTime) => {
			level.update(deltaTime, camera);

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
		
		setupScreenSplash(splashes);
		drawContent(screen, context, Rain, camera, splashes, level);
	});
}


if(localStorage.getItem('_collision_debug')){
	_collDebug = true;
}
window.toggle_collDebug = () =>{
	if(_collDebug){
		_collDebug = false;
		localStorage.removeItem('_collision_debug');
		return 'collision debug disabled';
	}
	else{
		_collDebug = true;
		localStorage.setItem('_collision_debug', true);
		return 'collision debug enabled';
	}
}

if(localStorage.getItem('_frametime_debug')){
	_frametimeDebug = true;
}
window.toggle_framerate = () =>{
	if(_frametimeDebug){
		_frametimeDebug = false;
		localStorage.removeItem('_frametime_debug');
		return 'framerate disabled';
	}
	else{
		_frametimeDebug = true;
		localStorage.setItem('_frametime_debug', true);
	}
}


if(localStorage.getItem('_chunkGrid'))
	_chunkGrid = true;
window.toggle_chunkGrid = () =>{
	if(_chunkGrid){
		_chunkGrid = false;
		localStorage.removeItem('_chunkGrid');
	} else {
		_chunkGrid = true;
		localStorage.setItem('_chunkGrid', true);
	}
}
