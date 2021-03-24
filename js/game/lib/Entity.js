class Entity{
	constructor(spritesheet, x=0, y=0){
		this.pos = new Vect2(x, y);
		this.vel = new Vect2(0, 0);
		this.canCollide = true;
		this.gravity = 1;
		this.onGround=false;
		this.movement = {left: false, right: false};
		this.speed=2;
		this.running = false;
		this.offset = {'left': 0, 'right': 0, 'top': 0, 'bottom':0};
		this.jumpVec=-9;
		this.acceleratedJump = 'none';

		this.spritesheet = spritesheet;
		this.state = 'Idle';
		this.facing = 'right';

		this.distance = 0;
		this.animTime = 0;

		this.respTimed = false;
		this.type = 'entity';
	}

	//entity moving

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

	get onMove(){
		return this.movement.left||this.movement.right;
	}

	moveLeft(speed=this.speed){
		if(this.movement.right){
			this.stopMoving();
			this.moveLeft();
		} else {
			this.facing = 'left';
			this.movement.left = true;
		}
		
		if(this.running){
			if(this.vel.x>-this.speed*1.5){
				this.addVel(-this.speed/10, 0);
			}
		} else {
			if(this.vel.x>-this.speed){
				this.addVel(-this.speed/10, 0);
			}
		}

		if(this.vel.x == -this.speed*3/10) this.vel.x -= this.speed/2;

		this.distance+=Math.abs(this.vel.x);
	}
	isMovigLeft(){
		return this.movement.left;
	}

	moveRight(speed=this.speed){
		if(this.movement.left){
			this.stopMoving();
			this.moveRight();
		} else {
			this.facing = 'right';
			this.movement.right = true;
		}

		if(this.running){
			if(this.vel.x<this.speed*1.5){
				this.addVel(this.speed/10, 0);
			}
		} else {
			if(this.vel.x<this.speed){
				this.addVel(this.speed/10, 0);
			}
		}

		if(this.vel.x == this.speed*3/10) this.vel.x += this.speed/2;

		this.distance+=Math.abs(this.vel.x);
	}
	isMovigRight(){
		return this.movement.right;
	}

	stopMoving(){
		this.acceleratedJump='none';
		this.movement.left = false;
		this.movement.right = false;
		this.setVel(0, this.vel.y);

		this.running = false;

		if(__collisionStops){
			this.distance = 0;
		}
	}

	jump(){
		if(this.onGround){
			this.onGround=false;
			this.vel.y = this.jumpVec;

			if(this.isMovigRight()) {
				this.vel.x*=1.5;
				this.acceleratedJump = 'right';
			} else if(this.isMovigLeft()){
				this.vel.x*=1.5;
				this.acceleratedJump = 'left';
			}
		}
	}
	land(y){
		if(this.acceleratedJump!='none'){
			if(this.acceleratedJump=='left'&&this.onMove)
				this.setVel(this.vel.x/1.5, 0);
			else if(this.acceleratedJump=='right'&&this.onMove)
				this.setVel(this.vel.x/1.5, 0);
			this.acceleratedJump='none';
		}
		this.onGround = true;
		this.pos.y=y;
		this.setVel(this.vel.x, 0);
	}

	run(){
		this.running = true;
	}

	stopRun(){
		this.running = false;
		if(this.onMove){
			if(this.isMovigRight())
				 this.vel.x = this.speed;
			else this.vel.x = -this.speed;
		}
	}

	//entity updates

	veliocityTick(deltaTime, tileCollider, camera, gravity){
		this.addVel(0, gravity*deltaTime/30);

		this.pos.y+=(this.vel.y*deltaTime/16);
        if(this.canCollide) tileCollider.checkY(this, camera);

		this.pos.x+=(this.vel.x*deltaTime/16);
		if(this.canCollide) tileCollider.checkX(this, camera);

		if(this.type=='player')
			if(!this.respTimed){
				if(this.pos.x<-this.offset.left){
					this.stopMoving();
					this.pos.x=-this.offset.left;
				}
				if(this.pos.x>camera.pos.x+camera.size.x-this.spritesheet.width+this.offset.right){
					this.stopMoving();
					this.pos.x=camera.pos.x+camera.size.x-this.spritesheet.width+this.offset.right;
				}
			}
	}

	update(deltaTime, tileCollider, camera, gravity){
		this.veliocityTick(deltaTime, tileCollider, camera, gravity);
		this.animTime+=deltaTime;
	}

	//sprites

	setAnimFrame(name, frames=3){
		if(this.onMove&&this.onGround){
			let frame = Math.floor((this.distance/30)%frames);
			this.state = `${name}${frame}`;
			// console.log(frame);
		} else {
			let dt;
			if(this.onGround) dt = 250;
			else dt=100;
			let frame = Math.floor(this.animTime/dt)%frames;
			this.state = `${name}${frame}`;
		}

	}

	updateSprite(){
		let oldState = `${this.facing}${this.onMove}${this.onGround}`;
		if(this.facing=='none'){
			this.state = 'Confused';
			return;
		}
		if(!this.onGround){
			if(this.vel.y>0){
				if(this.facing=='right') this.setAnimFrame('JumpRightDown', 4);
				else if(this.facing=='left') this.setAnimFrame('JumpLeftDown', 4);
			} else {
				if(this.facing=='right') this.setAnimFrame('JumpRightUp', 4);
				else if(this.facing=='left') this.setAnimFrame('JumpLeftUp', 4);
			}
		} else if(this.onMove){
			if(this.facing=='right') this.setAnimFrame('RunRight', 4);
			else if(this.facing=='left') this.setAnimFrame('RunLeft', 4);
		} else {
			if(this.facing=='right') this.setAnimFrame('IdleRight', 4);
			else if(this.facing=='left') this.setAnimFrame('IdleLeft', 4);
			else this.state = 'Confused';
		}
		if(`${this.facing}${this.onMove}${this.onGround}`!=oldState) this.animTime = 0;
	}


	draw(camera, ctx=_ctx){
		this.updateSprite();
		_ctx.imageSmoothingEnabled=false;
		this.spritesheet.draw(
			this.state,
			(this.pos.x - camera.pos.x),
			(this.pos.y - camera.pos.y), ctx);
		_ctx.imageSmoothingEnabled=_smoothing;
	}

	setOffset(left, right, top=this.offset.top, bottom=this.offset.bottom){
		this.offset.left = left;
		this.offset.right = right;
		this.offset.top = top;
		this.offset.bottom = bottom;
	}

	get offsetHor(){
		return this.offset.right + this.offset.left;
	}
	get offsetVert(){
		return this.offset.top + this.offset.bottom;
	}


}