class IDResolver{
	constructor(spritesheet = new SpriteSheet(), json = ''){
		this.Tiles = [];

		this.spritesheet = spritesheet;

		Chunk.prototype._IDResolver = this;

		if(typeof json === 'string'){
			this.json = json;
		}
	}

	draw(id, x, y, ctx){
		let tile = this.Tiles[id];
		if(tile){
			this.spritesheet.draw(
				tile.name,
				x*_TILESIZE,
				y*_TILESIZE,
				ctx
			);
			if(tile.func) tile.func();
		} else {
			this.spritesheet.draw(
				'noTexture',
				x*_TILESIZE,
				y*_TILESIZE,
				ctx
			);
		}
	}

	getTileType(id){
		let tile = this.Tiles[id];
		if(!tile) return undefined;
		return tile.type;
	}

	getTile(id){
		return this.Tiles[id];
	}

	getSpriteById(id){
		return (this.spritesheet.getSprite(this.Tiles.get(id)));
	}

	setId(id, tile = {name: 'noName', type: undefined}){
		if(typeof tile == 'string')
			tile = {name: tile, type: undefined}
		this.Tiles[id]=tile;
	}


	get json(){
		let str = JSON.stringify(this.Tiles);
		return str;
	}


	set json(json){
		let arr = JSON.parse(json);
		if(arr);
		arr.forEach((obj, id)=>{
			this.Tiles[id] = obj;
		})
	}
}