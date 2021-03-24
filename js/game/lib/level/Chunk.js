class Chunk{
	constructor(){
		this.grid = [];
		this.needRedraw = false;

		this.buffer = document.createElement('canvas');
		this.buffer.width = _CHUNKPIXELS;
		this.buffer.height = _CHUNKPIXELS;
		this.bctx = this.buffer.getContext('2d');
	}

	draw(x, y, ctx = _ctx, camera = {pos: {x: 0, y: 0}, size: {x:250, y:120}}){
		if(this.grid.length == 0){
			if(_chunkGrid)
				this.highlightInactive(x, y, ctx, camera);
			return;
		}
		if(this.needRedraw) this.redraw();
		if(this.buffer){
			if(_chunkGrid)
				this.highlightActive(x, y, ctx, camera);
			ctx.drawImage(
				this.buffer,
				(x - camera.drawFromX)*_CHUNKPIXELS,
				(y - camera.drawFromY)*_CHUNKPIXELS
			);
		} else {
			if(_chunkGrid)
				this.highlightInactive(x, y, ctx, camera);
		}
	}

	getTileType(x, y){
		if(this.grid.length == 0) return undefined;
		return this._IDResolver.getTileType(this.grid[y][x]);
	}
	getTileId(x, y){
		if(this.grid.length == 0) return undefined;
		return this.grid[y][x];
	}
	getTile(x, y){
		if(this.grid.length == 0) return undefined;
		return this._IDResolver.getTile(this.grid[y][x]);
	}

	redraw(){
		if(!this.buffer){
			this.buffer = document.createElement('canvas');
			this.buffer.width = _CHUNKPIXELS;
			this.buffer.height = _CHUNKPIXELS;
			this.bctx = this.buffer.getContext('2d');
		}

		if(this.grid.length == 0) this.__initChunk();

		this.bctx.clearRect(0, 0, this.buffer.width, this.buffer.height);
		for(let y=0; y<_CHUNKSIZE; y++){
			if(this.grid[y].length == 0) this.__initLine(y);
			for(let x=0; x<_CHUNKSIZE; x++){
				if(this.grid[y][x] == 0) continue;
				this._IDResolver.draw(
					this.grid[y][x],
					x, y,
					this.bctx);
			}
		}
		this.needRedraw = false;
	}

	update(x, y, func){
		if(this.grid.length == 0) this.__initChunk();
		func(x, y, this);
		this.needRedraw = true;

		if(typeof leveleditor !== 'undefined'){
			this.__removeCheck();
		}
	}

	unload(){
		this.buffer = undefined;
		this.bctx = undefined;
		this.needRedraw = true;
	}
	load(){
		this.redraw();
	}

	__initChunk(){
		for(let y=0; y<_CHUNKSIZE; y++){
			this.grid[y] = [];
			this.__initLine(y);
		}
	}

	__initLine(y){
		for(let x=0; x<_CHUNKSIZE; x++){
			this.grid[y][x] = 0;
		}
	}

	highlightActive(x, y, ctx, camera){
		ctx.strokeStyle = '#0FC';
		ctx.strokeRect(
			(x - camera.drawFromX)*_CHUNKPIXELS+1,
			(y - camera.drawFromY)*_CHUNKPIXELS+1,
			_CHUNKPIXELS-2,
			_CHUNKPIXELS-2
		);
	}

	highlightInactive(x, y, ctx, camera){
		ctx.strokeStyle = '#FCA';
		ctx.strokeRect(
			(x - camera.drawFromX)*_CHUNKPIXELS+1,
			(y - camera.drawFromY)*_CHUNKPIXELS+1,
			_CHUNKPIXELS-2,
			_CHUNKPIXELS-2
		);
	}

	__removeCheck(){
		let nulls = 0;
		this.grid.forEach(row =>{
			row.forEach(tile=>{
				if(tile == 0) nulls++;
			})
		});
		if(nulls != 256) return;

		this.grid = [];
		this.buffer = undefined;
		this.bctx = undefined;
		this.needRedraw = false;
	}
}