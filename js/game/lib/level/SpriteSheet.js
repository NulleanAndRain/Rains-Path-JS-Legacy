class SpriteSheet{
	constructor(width=_TILESIZE, height=_TILESIZE, image=new Image()){
		this.image = image;
		this.width = width;
		this.height = height;
		this.sprites = new Map();

		{
			let buffer = document.createElement('canvas');
			buffer.width = this.width;
			buffer.height = this.height;
			let bctx = buffer.getContext('2d');

			for(let x=0; x<this.width; x+=8){
				for(let y=0; y<this.height; y+=8){
					bctx.fillStyle = '#000';
					bctx.fillRect(x, y, 4, 4);
					bctx.fillRect((x+4), (y+4), 4, 4);
					bctx.fillStyle = '#f0f';
					bctx.fillRect(x, (y+4), 4, 4);
					bctx.fillRect((x+4), y, 4, 4);
				}
			}

			this.sprites.set('noTexture', buffer);
		}
	}

	getSprite(name){
		let buffer = this.sprites.get(name);
		return buffer;
	}

	defineAbs(name, posx, posy, width = this.width, height = this.height){
		const buffer = document.createElement('canvas');
		buffer.width = width;
		buffer.height = height;
		buffer
			.getContext('2d')
			.drawImage(
				this.image,
				posx, posy,
				width, height,
				0,0,
				width, height);
		this.sprites.set(name, buffer);
	}

	define(name, posx, posy){
		this.defineAbs(name, posx*this.width, posy*this.height, this.width, this.height);
	}

	draw(name, posx, posy, ctx=_ctx, extension=1){
		let buffer = this.sprites.get(name);
		if(buffer){
			ctx.drawImage(
				buffer,
				posx,
				posy,
				buffer.width*extension,
				buffer.height*extension);
		} else {
			buffer = this.sprites.get('noTexture');
			ctx.drawImage(
				buffer,
				posx,
				posy,
				buffer.width*extension,
				buffer.height*extension);
		}
	}

	drawTile(name, posx, posy, ctx=_ctx, extension=1){
		this.draw(name, posx*this.width, posy*this.height, ctx, extension);
	}

	drawSpritePart(name, posx, posy, sWidth, sHeight, sx=0, sy=0, ctx=_ctx, extension=1){
		let buffer = this.sprites.get(name);
		if(buffer){
			ctx.drawImage(
				buffer,
				sx, sy, sWidth, sHeight,
				posx,
				posy,
				sWidth*extension,
				sHeight*extension);
			this.execFunc(name, posx, posy, ctx, extension);
		} else {
			buffer = this.sprites.get('no texture');
			ctx.drawImage(
				buffer,
				0, 0, sWidth, sHeight,
				posx,
				posy,
				sWidth*extension,
				sHeight*extension);
		}
	}


	spriteSize(name){
		if(this.sprites.has(name)){
			const buffer = this.sprites.get(name);
			return {width: buffer.width, height: buffer.height};
		} else {
			// console.log('no texture', name, 'at', this.sprites);
			return {width: this.width, height: this.height};
		}
	}

	defineMonocolorTile(name, color, width = this.width, height = this.height){
		return new Promise(resolve=>{
			const buffer = document.createElement('canvas');
			buffer.width = width;
			buffer.height = height;
			buffer
				.getContext('2d')
				.fillStyle = color;
			buffer
				.getContext('2d')
				.fillRect(0, 0, this.width, this.height);
			this.sprites.set(name, buffer);

			resolve(this);
		});
	}

	addTiles(name, horCount=5, vertCount=3, folder='textures'){
		return new Promise(resolve=>{
			this.image.src = `./img/${folder}/${name}.png`;
			this.image.onload = () => {
				if(horCount==1&&vertCount==1){
					this.define(`${name}`, 0, 0);
				} else {
					for(let i=0; i<vertCount; i++){
						for(let j=0; j<horCount; j++){
							this.define(`${name}${(i*horCount+j)}`, j, i);;
						}
					}
				}
				resolve(this);
			}
		});
	}

	addSprites(entity, state, folder, horCount=5, vertCount=3){
		return new Promise(resolve=>{
			this.image.src = `./img/${folder}/${entity}/${state}.png`;
			this.image.onload = () => {
				if(horCount==1&&vertCount==1){
					this.define(`${state}`, 0, 0);
				} else {
					for(let i=0; i<vertCount; i++){
						for(let j=0; j<horCount; j++){
							this.define(`${state}${(i*horCount+j)}`, j, i);;
						}
					}
				}
				resolve(this);
			}
		});
	}

	addSpritePart(entity, name, folder, horCount=5, vertCount=3, width=this.width, height=this.height){
		return new Promise(resolve=>{
			this.image.src = `./img/${folder}/${entity}/parts/${name}.png`;
			this.image.onload = () => {
				if(horCount==1&&vertCount==1){
					this.defineAbs(`part${name}`, 0, 0, width, height);
				} else {
					for(let i=0; i<vertCount; i++){
						for(let j=0; j<horCount; j++){
							this.defineAbs(`part${name}${(i*horCount+j)}`, width*j, height*i, width, height);;
							// console.log(`added part${name}${(i*horCount+j)}`);
						}
					}
				}
				resolve(this);
			}
		});
	}

	addParticles(name, horCount=5, vertCount=3){
		return new Promise(resolve=>{
			this.image.src = `./img/particles/${name}.png`;
			this.image.onload = () => {
				if(horCount==1&&vertCount==1){
					this.define(`${name}`, 0, 0);
				} else {
					for(let i=0; i<vertCount; i++){
						for(let j=0; j<horCount; j++){
							this.define(`${name}${(i*horCount+j)}`, j, i);;
						}
					}
				}
				resolve(this);
			}
		});
	}

	addBigSprite(name, fullPath, width, height, posX=0, posY=0){
		return new Promise(resolve=>{
			this.image.src = `./img/${fullPath}`;
			this.image.onload = () => {
				this.defineAbs(name, posX, posY, width, height);
				resolve(this);
			}
		});
	}

	addBigSprites(name, fullPath, width, height, xCount=1, yCount=1){
		return new Promise(resolve=>{
			this.image.src = `./img/${fullPath}`;
			this.image.onload = () => {
				for(let y=0; y<yCount; y++){
					for(let x=0; x<xCount; x++){
						this.defineAbs(
							`${name}${(y*xCount+x)}`,
							width*x, height*y,
							width, height);
					}
				}
				resolve(this);
			}
		});
	}

	defineAtSpritesheet(name, posx, posy, width = this.width, height = this.height){
		return new Promise(resolve=>{
			this.defineAbs(
				`${name}`,
				posx, posy,
				width, height);
			resolve(this);
		});
	}

	renameSprite(oldName, newName){
		return new Promise(resolve=>{
			this.sprites.set(newName, this.sprites.get(oldName));
			this.sprites.delete(oldName);
			resolve(this);
		});
	}

	customLoad(func){
		return new Promise(resolve=>{
			func(this)
			.then(resolve);
		});
	}

	setNewImg(url){
		return new Promise(resolve=>{
			this.image.src = url;
			this.image.onload = () =>{
				resolve(this);
			}
		});
	}
};