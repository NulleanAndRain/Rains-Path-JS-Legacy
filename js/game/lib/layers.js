function createForegroundLayer(level, sprites, cameraSize) {
    const tiles = level.tiles;
    const resolver = level.tileCollider.tiles;

    const buffer = document.createElement('canvas');
    buffer.width = cameraSize.x+_TILESIZE;
    buffer.height = cameraSize.y+_TILESIZE;


    const context = buffer.getContext('2d');

    function redraw(drawFromX, drawToX, drawFromY)  {
        context.clearRect(0, 0, buffer.width, buffer.height);

        for (let x = drawFromX; x <= drawToX; x++) {
            const col = tiles.grid[x];
            if (col) {
                col.forEach((tile, y) => {
                    if(tile.animation){
                        let currAnim = level.animations[tile.animation];
                        let frame = Math.floor(level.globalTime/75)
                            %currAnim.frames.length;
                        sprites.drawTile(
                            currAnim.frames[frame],
                            x - drawFromX,
                            y - drawFromY,
                            context);
                        
                    } else {
                        sprites.drawTile(
                            tile.name,
                            x - drawFromX,
                            y - drawFromY,
                            context);
                    }
                });
            }
        }
    }

    return function drawForegroundLayer(camera, context) {
        const drawWidth = resolver.toIndex(camera.size.x);
        const drawFromX = resolver.toIndex(camera.pos.x);
        const drawToX = drawFromX + drawWidth;

        let drawFromY = resolver.toIndex(camera.pos.y);
        if(camera.pos.y<0) drawFromY++;

        redraw(drawFromX, drawToX, drawFromY);

        context.drawImage(buffer,
            -camera.pos.x % _TILESIZE,
            -camera.pos.y % _TILESIZE);
    };
}

function createBackgroundLayer(level, sprites, cameraSize) {
    const tiles = level.backing;
    const resolver = level.tileCollider.tiles;

    const buffer = document.createElement('canvas');
    buffer.width = cameraSize.x+_TILESIZE;
    buffer.height = cameraSize.y+_TILESIZE;


    const context = buffer.getContext('2d');

    function redraw(drawFromX, drawToX, drawFromY)  {
        context.clearRect(0, 0, buffer.width, buffer.height);

        for (let x = drawFromX; x <= drawToX; x++) {
            const col = tiles.grid[x];
            if (col) {
                col.forEach((tile, y) => {
                    if(tile.animation) {
                        let currAnim = level.animations[tile.animation];
                        let frame = Math.floor(level.globalTime/75)
                            %currAnim.frames.length;
                        sprites.drawTile(
                            currAnim.frames[frame],
                            x - drawFromX,
                            y - drawFromY,
                            context);
                    } else {
                        sprites.drawTile(
                            tile.name,
                            x - drawFromX,
                            y - drawFromY,
                            context);
                    }
                });
            }
        }
    }

    return function drawBackgroundLayer(camera, context) {
        const drawWidth = resolver.toIndex(camera.size.x);
        const drawFromX = resolver.toIndex(camera.pos.x);
        const drawToX = drawFromX + drawWidth;

        let drawFromY = resolver.toIndex(camera.pos.y);
        if(camera.pos.y<0) drawFromY++;

        redraw(drawFromX, drawToX, drawFromY);

        if(_bgBlur)
            context.filter = 'brightness(95%) blur(0.6px)';
        else
            context.filter = 'brightness(95%)';

        _ctx.imageSmoothingEnabled = _smoothing;
        context.drawImage(buffer,
            -camera.pos.x % _TILESIZE+2,
            -camera.pos.y % _TILESIZE-2);
        context.filter = 'none';
    };
}

function createBGLayer(level, sprites, cameraSize) {
    const tiles = level.bg;
    const resolver = level.tileCollider.tiles;

    const buffer = document.createElement('canvas');
    buffer.width = cameraSize.x+_TILESIZE*2;
    buffer.height = cameraSize.y+_TILESIZE*2;


    const context = buffer.getContext('2d');


    function redrawBG(drawFromX, drawToX, drawFromY, drawToY)  {
        context.clearRect(0, 0, buffer.width, buffer.height);

        for (let x = drawFromX; x <= drawToX; x++) {
            const col = tiles.grid[x];
            if (col) {
                col.forEach((tile, y) => {
                    // if(y<drawFromY || y>drawToY) return;
                    if(tile.animation){
                        let currAnim = level.animations[tile.animation];
                        let frame = Math.floor(level.globalTime/75)
                            %currAnim.frames.length;
                        sprites.drawTile(
                            currAnim.frames[frame],
                            (x - drawFromX)*2,
                            (y - drawFromY)*2,
                            context, 2);
                    } else {
                        sprites.drawTile(
                            tile.name,
                            (x - drawFromX)*2,
                            (y - drawFromY)*2,
                            context, 2);
                    }
                });
            }
        }
    }

    return function drawBGLayer(camera, context) {
        const xMarg = 1/32;
        const yMarg = 1/16;

        const drawWidth = resolver.toIndex(camera.size.x);
        const drawFromX = resolver.toIndex((camera.pos.x)*xMarg);
        const drawToX = drawFromX + drawWidth;

        const drawHeight = resolver.toIndex(camera.size.y); 
        const drawFromY = resolver.toIndex(camera.pos.y*yMarg);
        const drawToY = drawFromY + drawHeight;

        redrawBG(drawFromX, drawToX, drawFromY, drawToY);

        context.filter = 'brightness(110%) blur(2px)';
        context.imageSmoothingEnabled = true;


            context.drawImage(buffer,
                (-(camera.pos.x*xMarg)%_TILESIZE*2),
                (_canvas.height/2-(camera.pos.y*yMarg) % _TILESIZE*2));

        context.filter = 'none';
        context.imageSmoothingEnabled = _smoothing;
    };
}

// function createSpriteLayer(entities, width = 64, height = 64) {
//     const spriteBuffer = document.createElement('canvas');
//     spriteBuffer.width = width;
//     spriteBuffer.height = height;
//     const spriteBufferContext = spriteBuffer.getContext('2d');

//     return function drawSpriteLayer(camera, context) {
//         entities.forEach(entity => {
//             entity.draw(camera, spriteBufferContext);
        
//             spriteBufferContext.clearRect(0, 0, width, height);

//             entity.draw(spriteBufferContext);

//             context.drawImage(
//                 spriteBuffer,
//                 entity.pos.x - camera.pos.x,
//                 entity.pos.y - camera.pos.y);
//         });
//     }
// }
