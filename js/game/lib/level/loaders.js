let loadSky = () =>{
	return new Promise(resolve=>{
		let sky = document.createElement('canvas');

		sky.width=_canvas.width;
		sky.height=_canvas.height;

		let lnrSky = sky
			.getContext('2d')
			.createLinearGradient(0, 0, 0, sky.height);
		lnrSky.addColorStop(0,"#8FC2DB");
		lnrSky.addColorStop(0.8,"#94DBDB");
		sky.getContext('2d').fillStyle = lnrSky;
		sky.getContext('2d').fillRect(0,0,sky.width,sky.height);

		resolve(sky);
	});
}

let loadTiles = () =>{
	return new Promise(resolve=>{
		let bgTiles = new SpriteSheet();
		bgTiles.defineMonocolorTile('air', 'transparent');

		bgTiles.defineMonocolorTile('shadow', '#000');

		bgTiles.addTiles('grass')
		.then(bgTiles=>bgTiles.addTiles('grassCorner', 2, 3))
		.then(bgTiles=>bgTiles.customLoad(loadGrassOuters))
		.then(bgTiles=>bgTiles.addTiles('dirt'))
		.then(bgTiles=>bgTiles.addTiles('stone'))
		.then(bgTiles=>bgTiles.addTiles('dirtToStone'))
		.then(bgTiles=>bgTiles.addTiles('cobble'))
		.then(bgTiles=>resolve(bgTiles));
	});
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
				.addSprites('Lena','AttackIdleLeft', 'sprites', 5, 1))
			.then(LenaSprites=>LenaSprites
				.addSpritePart('Lena', 'racketR', 'sprites', 1, 5, 20, 12))
			.then(LenaSprites=>LenaSprites
				.addSpritePart('Lena', 'racketL', 'sprites', 1, 5, 20, 12))
			.then(LenaSprites=>LenaSprites
				.addBigSprite('kunai', 'sprites/Lena/parts/kunai.png', 8, 3))
			.then(LenaSprites=>LenaSprites
				.addSprites('Lena', 'Downed', 'sprites', 1, 1))
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

let loadTileEntities = (level, factories, json) =>{
	let arr = JSON.parse(json);
	arr.forEach(tile =>{
		let f = factories.get(tile.name);
		tile.positions.forEach(([x,y])=>{
			// console.log(x, y);
			f(x, y);
		})
	})
}

function loadLevel(camera) {
	return Promise.all([
		loadTiles(),
		loadParticles(),
		loadSky(),
	])
	.then(([sprites, particles, sky]) => {
		var _IDResolver = new IDResolver(sprites, TileIDsJSON);

		let levelMapFG 	 = new LevelMap(levelFGJSON);
		let levelMapBack = new LevelMap(levelBackJSON);
		let levelMapBG   = new LevelMap(levelBGJSON);

		const level = new Level(levelMapFG, levelMapBack, levelMapBG, sky);


		sprites.execFunc = (spriteName, posx, posy, ctx=_ctx, extension = 1) =>{
			let func = sprites.spriteFunctions.get(spriteName);
			if(!func) return;
			func(camera, posx, posy, ctx, extension);
		}

		setupParticleFactories(level, particles);
		setupEntityFactories(level);
		let tileFactories = setupTileEntityFactories(level);

		loadTileEntities(level, tileFactories, TileEntitiesJSON);

		// createCampfire(16, 9);

		return level;
	});
}