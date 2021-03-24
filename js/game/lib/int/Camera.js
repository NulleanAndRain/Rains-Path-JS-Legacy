class Camera {
	constructor(width=640, heigth=360) {
		this.pos = new Vect2(0, 0);
		this.size = new Vect2(width, heigth);
		this.subcamera = undefined;
	}

	createSubcamera(){
		this.subcamera = new Camera(this.size.x/2, this.size.y/2);
		this.subcamera.isSubcamera = true;
	}

	getLevel(){}

	move(player){
		if(player.isDowned){
			return;
		}

		let level = this.getLevel();

		this.pos.x = player.pos.x + player.spritesheet.width/2 - this.size.x/2;
		if(this.size.x < level.width){
			if(this.pos.x < level.leftBorder){
				this.pos.x = level.leftBorder;
			}
			if(this.pos.x > level.rightBorder - this.size.x){
				this.pos.x = level.rightBorder - this.size.x;
			}
		}

		this.pos.y = player.pos.y-this.size.y*3/5 + 4;
	}

	update(){
		this.drawFromX = Math.floor(this.pos.x/_CHUNKPIXELS);
		this.deposX = 0;
		if(this.drawFromX < 0 && this.pos.x % _CHUNKPIXELS != 0){
			this.deposX = _CHUNKPIXELS;
		}
		this.drawToX = Math.ceil((this.pos.x + this.size.x + this.deposX)/_CHUNKPIXELS)+2;

		this.drawFromY = Math.floor(this.pos.y/(_CHUNKPIXELS));
		this.drawToY = Math.ceil((this.pos.y + this.size.y + this.deposY)/(_CHUNKPIXELS))+4;
		this.deposY = _CHUNKPIXELS;
		if(this.drawFromY >= 0 || this.pos.y % _CHUNKPIXELS == 0){
			this.deposY = 0;
		}

		if(this.subcamera){
			this.subcamera.pos.x = (this.pos.x + this.size.x/2 - this.subcamera.size.x)/2;
			this.subcamera.pos.y = (this.pos.y + this.size.y/2 - this.subcamera.size.y)/4;

			this.subcamera.drawFromX = Math.floor(this.subcamera.pos.x/(_CHUNKPIXELS*2))-1;
			this.subcamera.drawToX = Math.ceil(
				((this.pos.x + this.size.x)/2)/(_CHUNKPIXELS*2))+2;
			this.subcamera.deposX = _CHUNKPIXELS*2;
			this.subcamera.deposX = 0;
			if(this.subcamera.pos.x < 0 && this.subcamera.pos.x % (_CHUNKPIXELS*2) !=0){
				this.subcamera.deposX = _CHUNKPIXELS*2;
			}


			this.subcamera.drawFromY = Math.floor(this.subcamera.pos.y/(_CHUNKPIXELS*2));
			this.subcamera.drawToY = Math.ceil(
				(this.pos.y + this.size.y)/(_CHUNKPIXELS*8))+2;
				this.subcamera.deposY = 2*_CHUNKPIXELS;
			if(this.subcamera.pos.y >= 0 || this.subcamera.pos.y % (_CHUNKPIXELS*4) == 0){
				this.subcamera.drawFromY--;
			} 
		}
	}

	resize(newWidth, newHeigth){
		this.size.x = newWidth;
		this.size.y = newHeigth;

		if(this.subcamera) this.subcamera.resize(newWidth/2, newHeigth/2);
	}
}
