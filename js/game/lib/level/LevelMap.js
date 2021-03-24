class LevelMap{
	constructor(str){
		this.chunksPos = [];
		this.chunksNeg = [];

		this.chunksPos[0] = new ChunkColumn();

		if(typeof str == 'string')
			this.json = str;
	}

	get _firstChunk(){
		return this.chunksNeg.length-1;
	}

	get _lastChunk(){
		return this.chunksPos.length-1;
	}

	get leftBorder(){
		return -this.chunksNeg.length*_CHUNKPIXELS;
	}
	get rightBorder(){
		return -this.chunksPos.length*_CHUNKPIXELS;
	}
	get levelWidth(){
		return this.rightBorder - this.leftBorder;
	}

	heightAt(posX){
		let col = this.__getChunkColNoCreate(posX)
		if(col)
			return col.heightAt()*_CHUNKPIXELS;
		return 1000;
	}

	getTileType(x, y){
		let col = this.__getChunkColNoCreate(Math.floor(x/_CHUNKSIZE));
		if(!col) return undefined;
		x %= _CHUNKSIZE;
		if(x < 0) x += _CHUNKSIZE;
		return col.getTileType(x, y);
	}
	getTileId(x, y){
		let col = this.__getChunkColNoCreate(Math.floor(x/_CHUNKSIZE));
		if(!col) return undefined;
		x %= _CHUNKSIZE;
		if(x < 0) x += _CHUNKSIZE;
		return col.getTileId(x, y);
	}
	getTile(x, y){
		let col = this.__getChunkColNoCreate(Math.floor(x/_CHUNKSIZE));
		if(!col) return undefined;
		x %= _CHUNKSIZE;
		if(x < 0) x += _CHUNKSIZE;
		return col.getTile(x, y);
	}


	updateChunk(x, y, func){
		let col = this.__getChunkCol(Math.floor(x/(_CHUNKSIZE)));
		x %= _CHUNKSIZE;
		if(x < 0) x += _CHUNKSIZE;
		col.updateChunk(x, y, func);
	}

	draw(ctx = _ctx, camera = {pos: {x: 0, y: 0}, size: {x:250, y:120}}){
		for(let x = camera.drawFromX; x < camera.drawToX; x++){
			let col = this.__getChunkColNoCreate(x);
			if(col){
				col.draw(x, ctx, camera);
			}
		}
		this.loadChunks(camera);
	}

	_addChunckCol(x){
		let chunk = new ChunkColumn();
		if(x>=0){
			this.chunksPos.push(chunk);
			if(x == this._lastChunk) return chunk;
			else chunk = this._addChunckCol(x);
		} else {
			this.chunksNeg.push(chunk);
			if((-x-1) == this._firstChunk) return chunk;
			else chunk = this._addChunckCol(x);
		}
		return chunk;
	}

	__getChunkCol(posX){
		let col;
		if(posX<0){
			col = this.chunksNeg[-posX-1];
		} else {
			col = this.chunksPos[posX];
		}
		if(!col) col = this._addChunckCol(posX);
		return col;
	}
	__getChunkColNoCreate(posX){
		let col;
		if(posX<0){
			col = this.chunksNeg[-posX-1];
		} else {
			col = this.chunksPos[posX];
		}
		return col;
	}

	log(){
		console.log(this);
	}

	get json(){
		let str = JSON.stringify(this);
		str = str.replace(/\u005b0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0\u005d/g, '[]');
		str = str.replace(/,"chunksNeg":\u005b\u005d|,"chunksPos":\u005b{}\u005d|"chunksPos":\u005b\u005d|"grid":\u005b\u005d/g, '');
		return str.replace(/,"needRedraw":false|,"needRedraw":true|,"buffer":{},"bctx":{}|,"unloaded":false|,"unloaded":true/g, '');
	}
	set json(json){
		let tmp = this.draw;
		this.draw = () =>{};

		this.chunksPos = [];
		this.chunksNeg = [];
		let obj = JSON.parse(json);

		let loadStatus = 0;

		if(!obj.chunksPos) obj.chunksPos = [];
		setTimeout(()=>{
			obj.chunksPos.forEach((col, x)=>{
				this.chunksPos[x] = new ChunkColumn();

				if(!col.chunksPos) col.chunksPos = [];
				setTimeout(()=>{
					col.chunksPos.forEach((chunk, y)=>{
						this.chunksPos[x].chunksPos[y] = new Chunk();
						if(chunk.grid)
							this.chunksPos[x].chunksPos[y].grid = chunk.grid;
						this.chunksPos[x].chunksPos[y].needRedraw = true;
					});
				}, 0);

				if(!col.chunksNeg) col.chunksNeg = [];
				setTimeout(()=>{
					col.chunksNeg.forEach((chunk, y)=>{
						this.chunksPos[x].chunksNeg[y] = new Chunk();
						if(chunk.grid)
							this.chunksPos[x].chunksNeg[y].grid = chunk.grid;
						this.chunksPos[x].chunksNeg[y].needRedraw = true;
					});
				}, 0);
			});
				loadStatus++;
		}, 0);
		if(!obj.chunksNeg) obj.chunksNeg = [];
		setTimeout(()=>{
			obj.chunksNeg.forEach((col, x)=>{
				this.chunksNeg[x] = new ChunkColumn();

				if(!col.chunksPos) col.chunksPos = [];
				setTimeout(()=>{
					col.chunksPos.forEach((chunk, y)=>{
						this.chunksNeg[x].chunksPos[y] = new Chunk();
						if(chunk.grid)
							this.chunksNeg[x].chunksPos[y].grid = chunk.grid;
						this.chunksNeg[x].chunksPos[y].needRedraw = true;
					});
				}, 0);

				if(!col.chunksNeg) col.chunksNeg = [];
				setTimeout(()=>{
					col.chunksNeg.forEach((chunk, y)=>{
						this.chunksNeg[x].chunksNeg[y] = new Chunk();
						if(chunk.grid)
							this.chunksNeg[x].chunksNeg[y].grid = chunk.grid;
						this.chunksNeg[x].chunksNeg[y].needRedraw = true;
					});
				}, 0);
			});
				loadStatus++;
		}, 0);

		let loadWaiting = setInterval(()=>{
			if(loadStatus == 2){
				this.draw = tmp;
				return 'loaded';
				clearInterval(loadWaiting);
			}
		}, 1);
	}


	loadChunks(camera){
		let colLL = this.__getChunkColNoCreate(camera.drawFromX-1);
		if(colLL) colLL.load(camera.drawFromX-1);
		let colRL = this.__getChunkColNoCreate(camera.drawToX+1);
		if(colRL) colRL.load(camera.drawToX+1);

		let colLU = this.__getChunkColNoCreate(camera.drawFromX-2);
		if(colLU) colLU.unload(camera.drawFromX-2);
		let colRU = this.__getChunkColNoCreate(camera.drawToX+2);
		if(colRU) colRU.unload(camera.drawToX+2);
	}


	drawFrames(ctx, camera){
		ctx.strokeStyle = '#000';
		ctx.strokeRect(
			camera.pos.x % _CHUNKPIXELS + camera.deposX,
			camera.pos.y % _CHUNKPIXELS + camera.deposY,
			camera.size.x,
			camera.size.y
		);

		ctx.strokeStyle = '#f00';
		ctx.strokeRect(
			0, 0,
			camera.drawWidthX*_CHUNKPIXELS,
			camera.drawWidthY*_CHUNKPIXELS
		);

		ctx.strokeStyle = '#00f';
		ctx.beginPath();
		ctx.moveTo(
			15*_CHUNKPIXELS -camera.drawFromX*_CHUNKPIXELS,
			-camera.drawFromY*_CHUNKPIXELS,
		);
		ctx.lineTo(
			-15*_CHUNKPIXELS -camera.drawFromX*_CHUNKPIXELS,
			-camera.drawFromY*_CHUNKPIXELS,
		);
		ctx.moveTo(
			-camera.drawFromX*_CHUNKPIXELS,
			15*_CHUNKPIXELS -camera.drawFromY*_CHUNKPIXELS,
		);
		ctx.lineTo(
			-camera.drawFromX*_CHUNKPIXELS,
			-15*_CHUNKPIXELS -camera.drawFromY*_CHUNKPIXELS,
		);
		ctx.stroke();
		ctx.closePath();
	}

	drawPlayerDot(ctx, camera){
		ctx.fillStyle = '#F07F46';
		ctx.fillRect(
			camera.pos.x % _CHUNKPIXELS + camera.size.x/2   + camera.deposX - _TILESIZE,
			camera.pos.y % _CHUNKPIXELS + camera.size.y*2/3 + camera.deposY - _TILESIZE,
			_TILESIZE*2, _TILESIZE*3
		);
	}
}