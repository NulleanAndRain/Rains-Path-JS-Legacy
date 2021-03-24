class Camera {
	constructor(width=640, heigth=360) {
		this.pos = new Vect2(0, 0);
		this.size = new Vect2(width, heigth);
		this.subcamera = undefined;
		//		spec camera for level editor 
	}

	createSubcamera(){
		this.subcamera = new Camera(this.size.x/2, this.size.y/2);
		this.subcamera.isSubcamera = true;
	}

	update(){
		this.drawFromX = Math.floor(this.pos.x/_CHUNKPIXELS);
		if(this.drawFromX < 0 && this.pos.x % _CHUNKPIXELS != 0)
			this.deposX = _CHUNKPIXELS;
		else
			this.deposX = 0;
		this.drawToX = Math.ceil((this.pos.x + this.size.x + this.deposX)/_CHUNKPIXELS);

		this.drawFromY = Math.floor(this.pos.y/(_CHUNKPIXELS));
		if(this.drawFromY < 0 && this.pos.y % _CHUNKPIXELS != 0)
			this.deposY = _CHUNKPIXELS;
		else
			this.deposY = 0;
		this.drawToY = Math.ceil((this.pos.y + this.size.y + this.deposY)/(_CHUNKPIXELS));

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


			this.subcamera.drawFromY = Math.floor(this.subcamera.pos.y/(_CHUNKPIXELS*2));
			this.subcamera.drawToY = Math.ceil(
				((this.pos.y + this.size.y)/4)/(_CHUNKPIXELS*4))+2;
				this.subcamera.deposY = 0;
			if(this.subcamera.pos.y < 0 && this.subcamera.pos.y % (_CHUNKPIXELS*4) !=0){
				this.subcamera.deposY = _CHUNKPIXELS*2;
			}
		}
	}
}
