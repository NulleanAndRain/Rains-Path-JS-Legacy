class Compositor {
	constructor() {
		this.layers = [];

		this.shadowLayer = document.createElement('canvas');
		this.shadowLayer.width = _canvas.width+_TILESIZE;
		this.shadowLayer.height = _canvas.height+_TILESIZE;
		this.shctx = this.shadowLayer.getContext('2d');

		this.shctx.fillStyle = 'rgb(0, 0, 0, 0.1)'

		this.shadowLevels = [];

		this.shadowRadius = 3;
		this.shadowRadiusSqr = this.shadowRadius*this.shadowRadius

		this.lightSourcesLayer = [];
	}

	createShadows(camera, fgLayer, bgLayer, lightSources){
		this.fctx.clearRect(0, 0, this.frontLayer.width, this.frontLayer.height);
		// this.shadowLevels = [];

		this.shctx.clearRect(0, 0, this.shadowLayer.width, this.shadowLayer.height);

		let drawFromX = Math.floor(camera.pos.x/_TILESIZE);
		let width = Math.floor((camera.size.x)/_TILESIZE)+1;
		let drawFromY = Math.floor(camera.pos.y/_TILESIZE);
		if(camera.pos.y<0) drawFromY++;

		for(let x = drawFromX; x<width; x++){
			const col = fgLayer.grid[x];
			if (col) {
				this.shadowLevels[x] = [];
				col.forEach((tile, y) => {
					if(!tile){
						this.shadowLevels[x][y] = 0;
					} else if(tile.type == 'solid'){
						this.shadowLevels[x][y] = 255;
						return;
					} else {
						this.shadowLevels[x][y] = 0;
					}
				});
			}
		}
		for(let x = drawFromX; x<width; x++){
			const col = this.shadowLevels[x];
			if (col) {
				col.forEach((level, y) => {
					if(!level){
						this.shadowLevels[x][y] = 250;
					} 
				});
			}
		}
/*
		for(let x = drawFromX; x<width; x++){
			let col = this.shadowLevels[x];
			if(col){
				col.forEach((shadowLevel, y) => {
					if(shadowLevel != 0) return;
					this.lightInRadius(x, y);
				});
			}
		}*/

		for(let x = drawFromX; x<width; x++){
			let col = this.shadowLevels[x];
			if(col){
				col.forEach((shadowLevel, y) => {
					if(shadowLevel <= 15) return;
					this.shctx.fillStyle = `rgba(0,0,0,${shadowLevel/384})`;
					this.shctx.fillRect(
						x*_TILESIZE,
						(y-drawFromY)*_TILESIZE,
						_TILESIZE,
						_TILESIZE
					);
				});
			}
		}
	}

	lightInRadius(x, y){
		// if(this.shadowLevels[x][y] == undefined)
			// this.shadowLevels[x][y] = 0;

		let borderLeft = x - this.shadowRadius;
		if(borderLeft < 0)
			borderLeft = 0;

		let borderRight = x + this.shadowRadius;
		if(borderRight > Math.floor((_canvas.width)/_TILESIZE)+1)
			borderRight = Math.floor((_canvas.width)/_TILESIZE)+1;

		let borderTop = y - this.shadowRadius;
		if(borderTop < 0)
			borderTop = 0;

		let borderBot = y + this.shadowRadius;
		if(borderBot > Math.floor((_canvas.height)/_TILESIZE)+1)
			borderBot = Math.floor((_canvas.height)/_TILESIZE)+1;

		for(let dx = borderLeft; dx <= borderRight; dx++){
			if(!this.shadowLevels[dx]) continue;
			for(let dy = borderTop; dy <= borderBot; dy++){
				if(dx == x && dy == y) continue;
				if(this.shadowLevels[dx][dy] == 0){
					continue;
				}
				// 	console.log(dx, dy);
				let rx = (x - dx);
				let ry = (y - dy);
				let rad = rx*rx + ry*ry;
				if(rad <= this.shadowRadiusSqr){
				if(this.shadowLevels[dx][dy] == undefined){
					this.shadowLevels[dx][dy] = 0;
					continue;
				}
					// console.log(this.shadowLevels[dx][dy]);
					this.shadowLevels[dx][dy] -= 32*(
						(this.shadowRadiusSqr-rad)/this.shadowRadiusSqr);
					if(this.shadowLevels[dx][dy] <= 0){
						this.shadowLevels[dx][dy] = 1;
					}
					if(this.shadowLevels[dx][dy] >= 255){
						this.shadowLevels[dx][dy] = 255;
						// console.log(dx, dy);
					}
				}
			}
		}
	}

	draw(camera, ctx=_ctx) {
		ctx.clearRect(0, 0, _canvas.width, _canvas.height);

		this.layers.forEach(layer => {
			layer(camera, ctx);
		});


		if(!_shadowsEnabled) return;

		ctx.drawImage(
			this.shadowLayer,
			-camera.pos.x%_TILESIZE,
			-camera.pos.y%_TILESIZE);

		this.lightSourcesLayer.forEach(layer => {
			layer(camera, ctx);
		});
	}
}
