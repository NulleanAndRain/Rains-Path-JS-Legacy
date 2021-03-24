class Particle{
	constructor(x=0, y=0, time=0){
		this.pos = new Vect2(x, y);
		this.vel = new Vect2(0, 0);

		this.timeLeft = time;
		this.timeBuffer = 0;

		this.sprite = null
		this.speedDivider = 16;
	}


	setPos(x, y){
		this.pos.set(x, y);
	}

	setVel(x, y){
		this.vel.set(x, y);
	}

	addVel(x, y){
		this.vel.x+=x;
		this.vel.y+=y;
	}


	update(deltaTime){
		this.pos.x += this.vel.x*deltaTime/this.speedDivider;
		this.pos.y += this.vel.y*deltaTime/this.speedDivider;
		this.timeBuffer += deltaTime;
		if(this.timeLeft>0)
			this.timeLeft -= deltaTime;
		this.updateProxy(deltaTime);
	}
	updateProxy(deltaTime){}


	draw(camera, ctx=_ctx){
		ctx.imageSmoothingEnabled=false;
		ctx.drawImage(
			this.sprite,
			(this.pos.x - camera.pos.x),
			(this.pos.y - camera.pos.y));
		ctx.imageSmoothingEnabled=_smoothing;
	}
}