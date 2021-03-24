class ChunkColumn{
	constructor(){
		this.chunksPos = [];
		this.chunksNeg = [];

		this.chunksPos[0] = new Chunk();

		this.unloaded = false;
	}

	get _firstChunk(){
		return this.chunksNeg.length-1;
	}

	get _lastChunk(){
		return this.chunksPos.length-1;
	}

	heightAt(){
		return this.chunksPos.length;
	}

	getTileType(x, y){
		let chunk = this.__getChunkNoCreate(Math.floor(y/_CHUNKSIZE));
		if(!chunk) return undefined;
		y %= _CHUNKSIZE;
		if(y < 0) y += _CHUNKSIZE;
		return chunk.getTileType(x, y);
	}
	getTileId(x, y){
		let chunk = this.__getChunkNoCreate(Math.floor(y/_CHUNKSIZE));
		if(!chunk) return undefined;
		y %= _CHUNKSIZE;
		if(y < 0) y += _CHUNKSIZE;
		return chunk.getTileId(x, y);
	}
	getTile(x, y){
		let chunk = this.__getChunkNoCreate(Math.floor(y/_CHUNKSIZE));
		if(!chunk) return undefined;
		y %= _CHUNKSIZE;
		if(y < 0) y += _CHUNKSIZE;
		return chunk.getTile(x, y);
	}

	_addChunck(y){
		let chunk = new Chunk();
		if(y>=0){
			this.chunksPos.push(chunk);
			if(y == this._lastChunk) return chunk;
			else chunk = this._addChunck(y);
		} else {
			this.chunksNeg.push(chunk);
			if((-y-1) == this._firstChunk) return chunk;
			else chunk = this._addChunck(y);
		}
		return chunk;
	}

	updateChunk(x, y, func){
		let chunk = this.__getChunk(Math.floor(y/(_CHUNKSIZE)));
		y %= _CHUNKSIZE;
		if(y < 0) y += _CHUNKSIZE;
		chunk.update(x, y, func);
	}

	draw(x, ctx = _ctx, camera = {pos: {x: 0, y: 0}, size: {x:250, y:120}}){
		this.unloaded = false;
		for(let y = camera.drawFromY; y < camera.drawToY; y++){
			let chunk = this.__getChunkNoCreate(y);
			if(chunk){
				chunk.draw(x, y, ctx, camera);
			}
		}
		this._unloadChunks(camera);
	}

	__getChunk(posY){
		let chunk;
		if(posY<0){
			chunk = this.chunksNeg[-posY-1];
		} else {
			chunk = this.chunksPos[posY];
		}
		if(!chunk) {
			chunk = this._addChunck(posY);
		}
		return chunk;
	}
	__getChunkNoCreate(posY){
		let chunk;
		if(posY<0){
			chunk = this.chunksNeg[-posY-1];
		} else {
			chunk = this.chunksPos[posY];
		}
		return chunk;
	}

	_unloadChunks(camera){
		let chunkTL = this.__getChunkNoCreate(camera.drawFromY-1);
		if(chunkTL) chunkTL.load();
		let chunkTU = this.__getChunkNoCreate(camera.drawFromY-2);
		if(chunkTU) chunkTU.unload();

		let chunkBL = this.__getChunkNoCreate(camera.drawToY+1);
		if(chunkBL) chunkBL.load();
		let chunkBU = this.__getChunkNoCreate(camera.drawToY+2);
		if(chunkBU) chunkBU.unload();
	}

	unload(x){
		if(this.unloaded){
			return;
		}
		this.unloaded = true;
		setTimeout(()=>{
			this.chunksNeg.forEach(chunk=>{
				chunk.unload(x);
			})
		}, 0);
		setTimeout(()=>{
			this.chunksPos.forEach(chunk=>{
				chunk.unload(x);
			})
		}, 0);
	}
	load(x){
		if(!this.unloaded) return;
		this.unloaded = false;
		setTimeout(()=>{
			this.chunksNeg.forEach(chunk=>{
				chunk.load(x);
			})
		}, 0);
		setTimeout(()=>{
			this.chunksPos.forEach(chunk=>{
				chunk.load(x);
			})
		}, 0);
	}
}