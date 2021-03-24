class SpriteSheet{
	constructor(image=new Image(), width=_TILESIZE, height=_TILESIZE){
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
			}}
			this.sprites.set('no texture', buffer);
		}
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
			buffer = this.sprites.get('no texture');
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

	spriteSize(name){
		if(this.sprites.has(name)){
			const buffer = this.sprites.get(name);
			return {width: buffer.width, height: buffer.height};
		} else {
			return null;
		}
	}

	defineMonocolorTile(name, color){
		const buffer = document.createElement('canvas');
		buffer.width = this.width;
		buffer.height = this.height;
		buffer
			.getContext('2d')
			.fillStyle = color;
		buffer
			.getContext('2d')
			.fillRect(0, 0, this.width, this.height);
		this.sprites.set(name, buffer);
	}

	addTiles(name, folder='textures', horCount=5, vertCount=3){
	    return new Promise(resolve=>{
	        this.image.src = `./img/${folder}/${name}.png`;
	        this.image.onload = () => {
            	if(horCount==1&&vertCount==1){
                    this.define(`${name}`, 0, 0);
            	} else {
	            	for(let i=0; i<vertCount; i++){
		                for(let j=0; j<horCount; j++){
			                    this.define(`${name}${(i*5+j)}`, j, i);;
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
		                    this.define(`${state}${(i*5+j)}`, j, i);;
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

	renameSprite(oldName, newName){
		return new Promise(resolve=>{
			this.sprites.set(newName, this.sprites.get(oldName));
			this.sprites.delete(oldName);
			resolve(this);
		});
	}
};