class IDResolver{
	constructor(spritesheet = new SpriteSheet(), json, colorsJson){
		this.Tiles = [];
		this.tileColors = new Map();

		this.spritesheet = spritesheet;

		Chunk.prototype._IDResolver = this;

		if(typeof json === 'string'){
			this.json = json;
		}

		if(typeof colorsJson === 'string'){
			this.colorsJson = colorsJson;
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

	setId(id, tile = {name: 'noName', type: undefined}, color = 'transparent'){
		if(typeof tile == 'string')
			tile = {name: tile, type: undefined}
		this.Tiles[id]=tile;

		this.tileColors.set(tile.name, color);

		this.spritesheet.defineMonocolorTile(tile.name, color);
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

	get colorsJson(){
		let str = '[';
		this.tileColors.forEach((value, key)=>{
			str += `{"k":"${key}","v":"${value}"},`;
		});
		str = str.slice(0, -1);
		str += ']';
		return str;
	}

	set colorsJson(json){
		let arr = JSON.parse(json);
		if(arr)
		arr.forEach(obj=>{
			this.tileColors.set(obj.k, obj.v);

			this.spritesheet.defineMonocolorTile(obj.k, obj.v);
		});

		this.Tiles.values().next();

		for(let id = 1; id < this.Tiles.length; id++){
			let tile = this.Tiles[id];
			addTileFromJSON(tile.name, this.tileColors.get(tile.name));
		}
	}
}