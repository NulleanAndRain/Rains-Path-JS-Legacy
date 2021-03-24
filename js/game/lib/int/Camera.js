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

		// let level = this.getLevel();
		//x
		this.pos.x = player.pos.x + player.spritesheet.width/2 - this.size.x/2;
		// if(this.size.x > level.levelWidth){
		// 	if(this.pos.x<=level.leftBorder)
		// 		this.pos.x = 0;
		// 	if(this.pos.x+this.size.x>=level.rightBorder)
		// 		this.pos.x = level.rightBorder-this.size.x;
		// }
		
		//y
		this.pos.y = player.pos.y-this.size.y*3/5;/*
		if(this.pos.y+this.size.y+_TILESIZE/2>level.heightAt(player.pos.x)){
			let playerPosLevelHeigth = level.heightAt(player.pos.x+8)
			if(player.pos.y<playerPosLevelHeigth){
				this.pos.y = playerPosLevelHeigth-this.size.y-_TILESIZE/2;
			} else {
				this.pos.y = playerPosLevelHeigth-this.size.y-_TILESIZE/2;
				if(player.health>0)
					player.takeDamage(
						player.maxHealth*2,
						'#f33',
						player.facing,
						player.pos.x+8,
						player.pos.y+12);
			}
		}*/
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
		this.deposY = 0;
		if(this.drawFromY < 0 && this.pos.y % _CHUNKPIXELS != 0){
			this.drawFromY++;
			this.deposY = 0;
		} else {
			this.deposY = -_CHUNKPIXELS;
		}

		if(this.subcamera){
			this.subcamera.pos.x = (this.pos.x + this.size.x/2 - this.subcamera.size.x)/2;
			this.subcamera.pos.y = (this.pos.y + this.size.y/2 - this.subcamera.size.y)/4;

			this.subcamera.drawFromX = Math.floor((this.pos.x/2)/(_CHUNKPIXELS*2))-1;
			this.subcamera.drawToX = Math.ceil(
				((this.pos.x + this.size.x)/2)/(_CHUNKPIXELS*2))+2;
			this.subcamera.deposX = _CHUNKPIXELS*2;
			this.subcamera.deposX = 0;
			if(this.subcamera.pos.x < 0 && this.subcamera.pos.x % (_CHUNKPIXELS*2) !=0){
				this.subcamera.deposX = _CHUNKPIXELS*2;
			}


			this.subcamera.drawFromY = Math.floor(this.subcamera.pos.y/(_CHUNKPIXELS*2))-1;
			this.subcamera.drawToY = Math.ceil(
				((this.pos.y + this.size.y)/4)/(_CHUNKPIXELS*4))+2;
				// this.subcamera.deposY = -_CHUNKPIXELS;
				this.subcamera.deposY = 0;
			if(this.subcamera.pos.y < 0 && this.subcamera.pos.y % (_CHUNKPIXELS*4) !=0){
				this.subcamera.drawFromY++;
			} else {
				// this.subcamera.deposY = -_CHUNKPIXELS;
			}
		}
	}

	resize(newWidth, newHeigth){
		this.size.x = newWidth;
		this.size.y = newHeigth;

		if(this.subcamera) this.subcamera.resize(newWidth/2, newHeigth/2);
	}
}
