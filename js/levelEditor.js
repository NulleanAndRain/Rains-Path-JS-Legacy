var screen;
var _ctx;

var currID = -1;
var currIDHasFunc = false;
window.setcurrID = (id) => {
	currID = id;
}

const _TILESIZE = 4;
const _CHUNKSIZE = 16;
const _CHUNKPIXELS = _TILESIZE*_CHUNKSIZE;

var _chunkGrid = false;
if(localStorage.getItem('_chunkGrid'))
	_chunkGrid = true;

const _buffer = document.createElement('canvas');
const _bctx = _buffer.getContext('2d');
_bctx.imageSmoothingEnabled = false;


var __drawLayer = 'front';

const leveleditor = '0.1';


window.onload = () =>{
	screen = document.getElementById('screen');
	_ctx = screen.getContext('2d');

	_ctx.imageSmoothingEnabled = false;
	screen.width  = screen.clientWidth/2;
	screen.height = screen.clientHeight/2;


	const camScreen = document.getElementById('screenAlt');
	const sctx = camScreen.getContext('2d');

	sctx.imageSmoothingEnabled = false;

	camScreen.width  = camScreen.clientWidth;
	camScreen.height = camScreen.clientHeight;

	_buffer.width  = screen.width + _CHUNKPIXELS;
	_buffer.height = screen.height + _CHUNKPIXELS;


	let spritesheet = new SpriteSheet();
	var _IDResolver = new IDResolver(spritesheet, TileIDsJSON, TileColorsJSON);

	spritesheet.defineMonocolorTile('air', 'transparent')
		// .then(spritesheet=>spritesheet.defineMonocolorTile('grass', '#1AB53E'))
		// .then(spritesheet=>spritesheet.defineMonocolorTile('dirt', '#A96423'))
		// .then(spritesheet=>spritesheet.defineMonocolorTile('stone', '#6D6E6A'))
		.then(spritesheet=>{

		// _IDResolver.setId(0, {name: 'air',		type: 'air'});
		// _IDResolver.setId(1, {name: 'grass',	type: 'solid'});
		// _IDResolver.setId(2, {name: 'dirt',		type: 'solid'});
		// _IDResolver.setId(3, {name: 'stone',	type: 'solid'});

		let levelMap 	 = new LevelMap(levelFGJSON);
		let levelMapBack = new LevelMap(levelBackJSON);
		let levelMapBG   = new LevelMap(levelBGJSON);


		clearScreens = () =>{
			_ctx.clearRect(0, 0, screen.width, screen.height);
			sctx.clearRect(0, 0, camScreen.width, camScreen.height);
		}


		let camera = new Camera(camScreen.width, camScreen.height);
		camera.createSubcamera();

		camera.pos.x = -camScreen.width/2;
		camera.pos.y = -camScreen.height*2/3;


		window.addEventListener('keydown', e=>{
			if(e.code == 'KeyQ'){
				// console.log(_IDResolver.spritesheet.sprites);
				console.log(_IDResolver.json);
			}
			if(e.code == 'Tab'){
				console.log(_IDResolver.colorsJson);
			}
		})

		draw(levelMap, levelMapBack, levelMapBG, _ctx, sctx, camera);

		setCvsDrawing(screen, levelMap, levelMapBack, levelMapBG, camera);
		setInt(_IDResolver);

	});
}

let clearScreens = () =>{}