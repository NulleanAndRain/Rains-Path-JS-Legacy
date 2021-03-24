let loadSky = () =>{
	return new Promise(resolve=>{
		let Sky = document.createElement('canvas');

		Sky.width=_canvas.width;
		Sky.height=_canvas.height;

		let lnrSky = Sky
			.getContext('2d')
			.createLinearGradient(0, 0, 0, Sky.height);
		lnrSky.addColorStop(0,"#8FC2DB");
		lnrSky.addColorStop(0.8,"#94DBDB");
		Sky.getContext('2d').fillStyle = lnrSky;
		Sky.getContext('2d').fillRect(0,0,Sky.width,Sky.height);
		resolve(Sky);
	});
}

let loadTiles = () =>{
	return new Promise(resolve=>{
		let bgTiles = new SpriteSheet();
		bgTiles.defineMonocolorTile('air', 'transparent');

		bgTiles.defineMonocolorTile('shadow', '#000');

		bgTiles.addTiles('grass')
		.then(bgTiles=>bgTiles.addTiles('grassCorner', 2, 3))
		.then(bgTiles=>bgTiles.addBigSprites('grassOuter', 'textures/grassOuter.png', 10, 10, 2, 2))
		.then(bgTiles=>bgTiles.defineAtSpritesheet('grassOuter4', 6, 0, 8, 2))
		.then(bgTiles=>bgTiles.defineAtSpritesheet('grassOuter5', 0, 6, 2, 8))
		.then(bgTiles=>bgTiles.defineAtSpritesheet('grassOuter6', 18, 6, 2, 8))
		.then(bgTiles=>bgTiles.defineAtSpritesheet('grassOuter7', 6, 18, 8, 2))
		.then(bgTiles=>bgTiles.addSpriteFunc('grass', creategrassOuter, 5, 3))
		.then(bgTiles=>copyTile(bgTiles, '_patternSolid', 'air'))
		.then(bgTiles=>bgTiles.addTiles('dirt'))
		.then(bgTiles=>bgTiles.addTiles('stone'))
		.then(bgTiles=>bgTiles.addTiles('dirtToStone'))
		.then(bgTiles=>bgTiles.addTiles('cobble'))
		.then(bgTiles=>bgTiles
			.addBigSprites('campfire', 'textures/campfire.png', 8, 16, 8, 2))
		.then(bgTiles=>bgTiles.addSpriteFunc('campfire', createCampfireParticles, 8, 2))
		.then(bgTiles=>resolve(bgTiles));
	});
}

let copyTile = (tileset, copyTo, copyFrom) => {
	return new Promise(resolve=>{
		tileset.sprites.set(copyTo, (tileset.sprites.get(copyFrom)));
		resolve(tileset);
	});
}

let createFGTiles = (level, foregrounds, patterns, xOff=0, yOff=0) => {
	function applyRangeFG(tile, xStart, xLen, yStart, yLen) {
		const xEnd = xStart + xLen;
		const yEnd = yStart + yLen;
		for (let x = xStart; x < xEnd; ++x) {
			for (let y = yStart; y < yEnd; ++y) {
				if(tile.pattern){
					createFGTiles(
						level, 
						patterns[tile.pattern].tiles, 
						patterns, xOff+x, yOff+y);
				} else if(tile.animation){
					level.tiles.set(x+xOff, y+yOff, {
						animation: tile.animation,
						type: tile.type,
					});
				} else {
					level.tiles.set(x+xOff, y+yOff, {
						name: tile.tile,
						type: tile.type,
						sublevel: tile.sublevel,
					});
				}
			}
		}
	}

	foregrounds.forEach(foreground => {
		foreground.ranges.forEach(range => {
			if (range.length === 4) {
				const [xStart, xLen, yStart, yLen] = range;
				applyRangeFG(foreground, xStart, xLen, yStart, yLen);

			} else if (range.length === 3) {
				const [xStart, xLen, yStart] = range;
				applyRangeFG(foreground, xStart, xLen, yStart, 1);

			} else if (range.length === 2) {
				const [xStart, yStart] = range;
				applyRangeFG(foreground, xStart, 1, yStart, 1);
			}
		});
	});
}


let createBackingTiles = (level, backgrounds, patterns, xOff=0, yOff=0) => {
	 function applyRangeBacking(tile, xStart, xLen, yStart, yLen) {
		const xEnd = xStart + xLen;
		const yEnd = yStart + yLen;
		for (let x = xStart; x < xEnd; ++x) {
			for (let y = yStart; y < yEnd; ++y) {
				if(tile.pattern){
					createBackingTiles(
						level, 
						patterns[tile.pattern].tiles, 
						patterns, xOff+x, yOff+y);
				} else if(tile.animation){
					level.backing.set(x+xOff, y+yOff, {
						animation: tile.animation,
						type: tile.type,
					});
				} else {
					level.backing.set(x+xOff, y+yOff, {
						name: tile.tile,
						type: tile.type,
						sublevel: tile.sublevel,
					});
				}
			}
		}
	}

	backgrounds.forEach(background => {
		background.ranges.forEach(range => {
			if (range.length === 4) {
				const [xStart, xLen, yStart, yLen] = range;
				applyRangeBacking(background, xStart, xLen, yStart, yLen);

			} else if (range.length === 3) {
				const [xStart, xLen, yStart] = range;
				applyRangeBacking(background, xStart, xLen, yStart, 1);

			} else if (range.length === 2) {
				const [xStart, yStart] = range;
				applyRangeBacking(background, xStart, 1, yStart, 1);
			}
		});
	});
}

let createBG = (level, bg, patterns, xOff=0, yOff=0) => {
	function applyRangeBG(tile, xStart, xLen, yStart, yLen) {
		const xEnd = xStart + xLen;
		const yEnd = yStart + yLen;
		for (let x = xStart; x < xEnd; ++x) {
			for (let y = yStart; y < yEnd; ++y) {
				if(tile.pattern){
					createBG(
						level, 
						patterns[tile.pattern].tiles, 
						patterns, xOff+x, yOff+y);
				} else if(tile.animation){
					level.bg.set(x+xOff, y+yOff, {
						animation: tile.animation,
						type: tile.type,
					});
				} else {
					level.bg.set(x+xOff, y+yOff, {
						name: tile.tile,
						type: tile.type,
						sublevel: tile.sublevel,
					});
				}
			}
		}
	}

	bg.forEach(bg => {
		bg.ranges.forEach(range => {
			if (range.length === 4) {
				const [xStart, xLen, yStart, yLen] = range;
				applyRangeBG(bg, xStart, xLen, yStart, yLen);

			} else if (range.length === 3) {
				const [xStart, xLen, yStart] = range;
				applyRangeBG(bg, xStart, xLen, yStart, 1);

			} else if (range.length === 2) {
				const [xStart, yStart] = range;
				applyRangeBG(bg, xStart, 1, yStart, 1);
			}
		});
	});
}

let loadLevelJSON = () =>{
	return new Promise(resolve=>{ //tbd with json later
		resolve(_loadLevel1());
	}
	);
}

let loadLenaSprite = () =>{
	return new Promise(resolve=>{
		let LenaSprites = new SpriteSheet(16, 24);

		LenaSprites.addSprites('Lena', 'IdleRight', 'sprites', 4, 1)
			.then(LenaSprites=>LenaSprites
				.addSprites('Lena','IdleLeft', 'sprites', 4, 1))
			.then(LenaSprites=>LenaSprites
				.addSprites('Lena','RunRight', 'sprites', 4, 1))
			.then(LenaSprites=>LenaSprites
				.addSprites('Lena','RunLeft', 'sprites', 4, 1))
			.then(LenaSprites=>LenaSprites
				.addSprites('Lena','JumpRightUp', 'sprites', 4, 1))
			.then(LenaSprites=>LenaSprites
				.addSprites('Lena','JumpRightDown', 'sprites', 4, 1))
			.then(LenaSprites=>LenaSprites
				.addSprites('Lena','JumpLeftUp', 'sprites', 4, 1))
			.then(LenaSprites=>LenaSprites
				.addSprites('Lena','JumpLeftDown', 'sprites', 4, 1))
			.then(LenaSprites=>LenaSprites
				.addSprites('Lena','Confused', 'sprites', 1, 1))
			// attack sprites
			.then(LenaSprites=>LenaSprites
				.addSprites('Lena','AttackIdleRight', 'sprites', 5, 1))
			.then(LenaSprites=>LenaSprites
				.addSpritePart('Lena', 'racketR', 'sprites', 1, 5, 20, 12))
			.then(LenaSprites=>LenaSprites
				.addSpritePart('Lena', 'racketL', 'sprites', 1, 4, 16, 8))
			.then(LenaSprites=>resolve(LenaSprites));
	});
}

let loadBoxSprite = () =>{
	return new Promise(resolve=>{
		let BoxSprite = new SpriteSheet(16, 16);
		BoxSprite.addSprites('Box', 'Idle', 'sprites', 1, 1)
			.then(BoxSprite=>resolve(BoxSprite));
	});
}

let loadParticles = () => {
	return new Promise(resolve=>{
		let particles = new SpriteSheet(8, 8);
		particles.addParticles('bizarre', 1, 1)
			.then(particles=>resolve(particles));
	});
}

function loadLevel(camera) {
	return Promise.all([
		loadLevelJSON(),
		loadTiles(),
		loadParticles()
	])
	.then(([levelSpec, sprites, particles]) => {
		const level = new Level();

		sprites.execFunc = (spriteName, posx, posy, ctx=_ctx, extension = 1) =>{
			let func = sprites.spriteFunctions.get(spriteName);
			if(!func) return;
			func(camera, posx, posy, ctx, extension);
		}


		createFGTiles(level, levelSpec.foregrounds, levelSpec.patterns);
		createBackingTiles(level, levelSpec.backgrounds,levelSpec.patterns);
		createBG(level, levelSpec.bg, levelSpec.patterns);

		const bg = createBGLayer(level, sprites, camera.size);
		level.comp.layers.push(bg);

		const backgroundLayer = createBackgroundLayer(
			level, sprites, camera.size);
		level.comp.layers.push(backgroundLayer);

		const foregroundLayer = createForegroundLayer(
			level, sprites, camera.size);
		level.comp.layers.push(foregroundLayer);

		setupParticleFactories(level, particles);
		setupEntityFactories(level);

		level.animations = levelSpec.animations;

		return level;
	});
}