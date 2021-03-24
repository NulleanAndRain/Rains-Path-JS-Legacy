const _speedDivider = 16;

class Entity{
	constructor(spritesheet, x=0, y=0){
		this.pos = new Vect2(x, y);
		this.vel = new Vect2(0, 0);
		this.canCollide = true;
		this.onGround=false;
		this.movement = {left: false, right: false};
		this.speed=1.5;
		this.running = false;
		this.jumpVec=-9;
		this.acceleratedJump = false;

		this.attacking = false;
		this.spritesheet = spritesheet;
		this.state = 'Idle';
		this.facing = 'right';
		this.offset = {'left': 0, 'right': 0, 'top': 0, 'bottom':0};
		this.childs = new Set();

		this.distance = 0;
		this.animTime = 0;

		this.respTimed = false;
		this.type = 'entity';
	}

	destructor(){}

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

		let _spdmult = 1;
		if(this.running)
			_spdmult *= 1.5;

		if(this.vel.x == -this.speed*_spdmult){
			return;
		} else if(this.vel.x > -this.speed*_spdmult){
			this.vel.x -= this.speed/_speedDivider;
		} else if(this.vel.x < -this.speed*_spdmult && this.onGround){
			this.vel.x += this.speed/_speedDivider;
		}
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


		let _spdmult = 1;
		if(this.running)
			_spdmult *= 1.5;
		
		if(this.vel.x == this.speed*_spdmult){
			return;
		} else if(this.vel.x<this.speed*_spdmult){
			this.vel.x += this.speed/_speedDivider;
		} else if(this.vel.x>this.speed*_spdmult && this.onGround){
			this.vel.x -= this.speed/_speedDivider;
		}
	}
	isMovigRight(){
		return this.movement.right;
	}

	stopMoving(){
		this.acceleratedJump = false;
		this.movement.left = false;
		this.movement.right = false;
		this.setVel(0, this.vel.y);

		if(__collisionStops){
			this.distance = 0;
		}
	}

	jump(){
		if(this.onGround){
			this.onGround=false;
			this.vel.y = this.jumpVec;

			if(this.onMove){
				this.vel.x *= 1.5;
				this.acceleratedJump = true;
			}
		}
	}
	land(y){
		if(!this.onGround){
			if(this.acceleratedJump){
				this.vel.x /= 1.5;
				this.acceleratedJump= false;
			}
		}

		this.onGround = true;
		this.pos.y = y;
		this.vel.y = 0;
	}

	run(){
		this.running = true;
	}

	stopRun(){
		this.running = false;
	}

	//entity updates

	veliocityTick(deltaTime, tileCollider, camera, gravity){
		this.addVel(0, gravity*deltaTime/30);

		this.pos.y+=(this.vel.y*deltaTime/16);
		if(this.canCollide) tileCollider.checkY(this, camera);

		this.pos.x+=(this.vel.x*deltaTime/16);
		if(this.canCollide) tileCollider.checkX(this, camera);
	}

	updateProxy(deltaTime, tileCollider, camera, gravity){}

	update(deltaTime, tileCollider, camera, gravity){
		this.veliocityTick(deltaTime, tileCollider, camera, gravity);
		this.animTime+=deltaTime;
		this.updateProxy(deltaTime, tileCollider, camera, gravity);
	}

	// skills and attack

	attack(){}
	skill(){}

	takeDamage(amount, color, facing, posx, posy){
		createTextParticle(
			this.pos.x+8, 
			this.pos.y-8,
			`${amount}`, color,
			5000);
		crateBloodSplash(posx, posy, facing);
	}

	//sprites

	setAnimFrame(name, frames){
		if(this.onMove&&this.onGround){
			let frame = Math.floor((this.distance/30)%frames);
			this.state = `${name}${frame}`;
			// console.log(frame);
		} else {
			let dt;
			if(this.onGround) dt = 150;
			else dt=100;

			if(this.attacking) dt = 75;
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
			this.distance+=Math.abs(this.vel.x);
			if(this.facing=='right') this.setAnimFrame('RunRight', 4);
			else if(this.facing=='left') this.setAnimFrame('RunLeft', 4);
		} else {
			if(this.facing=='right') this.setAnimFrame('IdleRight', 4);
			else if(this.facing=='left') this.setAnimFrame('IdleLeft', 4);
			else this.state = 'Confused';
		}

		if(this.attacking){
			if(!this.onGround){

			} else if(this.onMove){

			} else {
				if(this.facing == 'right') this.setAnimFrame('AttackIdleRight', 5);
			}
		} else if(
			`${this.facing}${this.onMove}${this.onGround}`!=oldState) this.animTime = 0;
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