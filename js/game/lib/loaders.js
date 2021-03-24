let loadSky = () =>{
	return new Promise(resolve=>{
		let Sky = document.createElement('canvas');

		Sky.width=_canvas.width;
		Sky.height=_canvas.height;

		let lnrSky = Sky
            .getContext('2d')
            .createLinearGradient(0,0,0,Sky.height);
		lnrSky.addColorStop(0,"#8FC2DB");
		lnrSky.addColorStop(0.8,"#94DBDB");
		Sky.getContext('2d').fillStyle = lnrSky;
		Sky.getContext('2d').fillRect(0,0,Sky.width,Sky.height);
		resolve(Sky);
	});
}

let loadTiles = () =>{
	return new Promise(resolve=>{
		let bgTiles = new SpriteSheet(new Image());
        bgTiles.defineMonocolorTile('air', 'transparent');

        bgTiles.defineMonocolorTile('shadow', '#000');

        bgTiles.addTiles('grass')
        .then(bgTiles=>copyTile(bgTiles, '_patternSolid', 'air'))
        .then(bgTiles=>bgTiles.addTiles('dirt'))
        .then(bgTiles=>copyTile(bgTiles, 'dirt6', 'grass6'))
        .then(bgTiles=>bgTiles.addTiles('stone'))
        .then(bgTiles=>bgTiles.addTiles('dirtToStone'))
        .then(bgTiles=>bgTiles.addTiles('cobble'))
        .then(bgTiles=>bgTiles.addTiles('animTest', 'textures', 6, 1))
        .then(bgTiles=>bgTiles
            .addBigSprites('grassCube', 'textures/grass.png', 8, 24, 3, 1))
        .then(bgTiles=>bgTiles
            .addBigSprites('campfire', 'textures/campfire.png', 8, 16, 8, 2))
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
    function applyRangeFG(background, xStart, xLen, yStart, yLen) {
        const xEnd = xStart + xLen;
        const yEnd = yStart + yLen;
        for (let x = xStart; x < xEnd; ++x) {
            for (let y = yStart; y < yEnd; ++y) {
                if(background.pattern){
                    createFGTiles(
                        level, 
                        patterns[background.pattern].tiles, 
                        patterns, xOff+x, yOff+y);
                } else if(background.animation){
                    level.tiles.set(x+xOff, y+yOff, {
                        animation: background.animation,
                        type: background.type,
                    });
                } else {
                    level.tiles.set(x+xOff, y+yOff, {
                        name: background.tile,
                        type: background.type,
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
     function applyRangeBacking(background, xStart, xLen, yStart, yLen) {
        const xEnd = xStart + xLen;
        const yEnd = yStart + yLen;
        for (let x = xStart; x < xEnd; ++x) {
            for (let y = yStart; y < yEnd; ++y) {
                if(background.pattern){
                    createBackingTiles(
                        level, 
                        patterns[background.pattern].tiles, 
                        patterns, xOff+x, yOff+y);
                } else if(background.animation){
                    level.backing.set(x+xOff, y+yOff, {
                        animation: background.animation,
                        type: background.type,
                    });
                } else {
                    level.backing.set(x+xOff, y+yOff, {
                        name: background.tile,
                        type: background.type,
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
    function applyRangeBG(background, xStart, xLen, yStart, yLen) {
        const xEnd = xStart + xLen;
        const yEnd = yStart + yLen;
        for (let x = xStart; x < xEnd; ++x) {
            for (let y = yStart; y < yEnd; ++y) {
                if(background.pattern){
                    createBG(
                        level, 
                        patterns[background.pattern].tiles, 
                        patterns, xOff+x, yOff+y);
                } else if(background.animation){
                    level.bg.set(x+xOff, y+yOff, {
                        animation: background.animation,
                        type: background.type,
                    });
                } else {
                    level.bg.set(x+xOff, y+yOff, {
                        name: background.tile,
                        type: background.type,
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
        let LenaSprites = new SpriteSheet(new Image(), 16, 24);

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
        .then(LenaSprites=>resolve(LenaSprites));
    });
}

let loadBoxSprite = () =>{
    return new Promise(resolve=>{
        let sprites = new Image();
        sprites.src = './img/sprites/Box/Idle.png';
        sprites.onload = () =>{
            let BoxSprite = new SpriteSheet(sprites, 16, 16);
            BoxSprite.define('Idle', 0, 0);
            resolve(BoxSprite);
        }
    });
}

function loadLevel(camera) {
    return Promise.all([
        loadLevelJSON(),
        loadTiles()
    ])
    .then(([levelSpec, sprites]) => {
        const level = new Level();


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

        level.animations = levelSpec.animations;

        return level;
    });
}