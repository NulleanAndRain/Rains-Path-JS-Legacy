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
			bctx.fillStyle = '#000';
			bctx.fillRect(0, 0, 2, 2);
			bctx.fillRect(2, 2, 2, 2);
			bctx.fillStyle = '#f0f';
			bctx.fillRect(0, 2, 2, 2);
			bctx.fillRect(2, 0, 2, 2);
			this.sprites.set('no texture', buffer);
		}
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

	defineMonocolorTile(name, color){
		return new Promise(resolve=>{
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

			resolve(this);
		});
	}
};