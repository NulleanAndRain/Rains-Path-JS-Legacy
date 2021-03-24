class TileEntity{
	constructor(spritesheet, tilePosX=0, tilePosY=0){
		this.pos = new Vect2(tilePosX*_TILESIZE, tilePosY*_TILESIZE);
		this.vel = new Vect2(0, 0);

		this.offset = {'left': 0, 'right': 0, 'top': 0, 'bottom':0};

		this.canCollide = true;
		this.onGround = false;
		this.affectedByGravity = false;

		this.spritesheet = spritesheet;
		this.animTime = 0;
		this.state = 'Idle';

		this.type = 'block';
	}

	setOffset(left, right, top=this.offset.top, bottom=this.offset.bottom){
		this.offset.left = left;
		this.offset.right = right;
		this.offset.top = top;
		this.offset.bottom = bottom;
	}

	velocityTick(deltaTime, tileCollider, camera, gravity){
		if(this.affectedByGravity) this.vel.y += gravity*deltaTime/32;

		this.pos.y+=(this.vel.y*deltaTime/16);
		if(this.canCollide) tileCollider.checkY(this, deltaTime, gravity);

		this.pos.x+=(this.vel.x*deltaTime/16);
		if(this.canCollide) tileCollider.checkX(this, deltaTime, gravity);
		this.velocityTickProxy(deltaTime, tileCollider, camera, gravity);
	}
	velocityTickProxy(){}

	update(deltaTime, tileCollider, camera, gravity){
		this.velocityTick(deltaTime, tileCollider, camera, gravity);
		this.animTime+=deltaTime;
		this.updateProxy(deltaTime, tileCollider, camera, gravity);
	}
	updateProxy(){}

	updateSprite(){}

	draw(camera, ctx=_ctx){
		this.updateSprite();
		this.spritesheet.draw(
			this.state,
			(this.pos.x - camera.pos.x),
			(this.pos.y - camera.pos.y), ctx);
	}

	remove(){
		this.toRemove = true;
	}
}