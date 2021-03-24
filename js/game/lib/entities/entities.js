class Player extends Entity{
	constructor(spritesheet, x=0, y=0){
		super(spritesheet, x, y);
		this.type = _s_player;
		this.setOffset(4, 4, 2);

		this.attackTime = 375;
		this.castTime = 175;
		this.skillTime = 375;

		this.usingSkill = false;
		this.skillCooldown = 2500;
		this.skillCooldownTimer = 0;

		this.attackDamage = 15;
		this.skillDamage = 10;


		this.attackCooldown = 375;
		this.attackCooldownTimer = 0;

		this.knockbackTaken = 1;

		this.score = 0;
		this.AddScore(0);
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

	AddScore(score){
		this.score += score;
		if(this.score < 0) this.score = 0;

		if(score){
			if(score > 0){
				createGradientTextParticle(
					this.pos.x+8, 
					this.pos.y-12,
					`+${score}`,
					blue_gradient,
					1500);
			} else if(score < 0){
				createGradientTextParticle(
					this.pos.x+16, 
					this.pos.y+8,
					`${score}`,
					orange_gradient,
					1500);
			}
		}

		const scoreInt = document.getElementById('scoreInt');
		scoreInt.innerHTML = this.score.toString().padStart(6, '0');
	}

	//attack and skills

	skill(){
		if(this.skillCooldownTimer != 0){
			createGradientTextParticle(
				this.pos.x+8, 
				this.pos.y-12,
				`${(this.skillCooldownTimer/1000).toFixed(1)}s`,
				red_gradient,
				500);
			return;
		}
		this.skillCooldownTimer =  this.skillCooldown;
		this.usingSkill = true;
		this.animTime = 0;
		this.distance = 0;
		this.skillCasted = false;
	}

	attack(){
		if(this.attackCooldownTimer != 0) return;
		this.attackCooldownTimer = this.attackCooldown;

		this.attacking = true;
		this.animTime = 0;
		this.distance = 0;
		createRainsWeapon(this,
			{spriteName: 'racketR', animationFrames: 5},
			{spriteName: 'racketL', animationFrames: 5},
			this.attackTime, this.attackDamage);
	}

	buttonTestEvent(){

		//  test only

		// this.heal(100);

		// createBizarreParticle(
		// 	this.pos.x+8  + (rand()-0.5)*10, 
		// 	this.pos.y    + (rand()-0.5)*10,);
		// this.takeDamage(10, '#c26352', this.facingReverse, this.pos.x+8, this.pos.y+10);
	}

	//damage and heal

	takeDamage(amount, color, entity, posx, posy){
		if(this.damageCooldownTimer != 0) return;
		this.damageCooldownTimer = this.damageCooldown;
		this.health -= amount;
		if(this.health<0){
			this.AddScore(-100);
			this.health = 0;
		}
		createTextParticle(
			this.pos.x+8, 
			this.pos.y-8,
			`${amount}`, color,
			2500);
		createBloodSplash(posx, posy, entity.facing);

		this.regenTimeout = this.regenInterval;


		const healthNum = document.getElementById('healthNum');
		const healthLine = document.getElementById('healthLine');

		healthNum.innerHTML = `${this.health}/${this.maxHealth}`;
		healthLine.style.width = `${(this.health/this.maxHealth)*100}%`;


		if(this.pos.x + this.spritesheet.width/2
			< entity.pos.x + entity.spritesheet.width/2){
			this.vel.x -= this.knockbackTaken*this.__kbHor;
		} else {
			this.vel.x += this.knockbackTaken*this.__kbHor;
		}

		this.vel.y = this.__kbVer * (this.knockbackTaken*2);
		this.onGround = false;
	}

	regen(){
		this.health += 1;
		if(this.health % 1 != 0){
			this.health = Math.ceil(this.health);
		}
		if(this.health>this.maxHealth)
			this.health = this.maxHealth;

		const healthNum = document.getElementById('healthNum');
		const healthLine = document.getElementById('healthLine');

		healthNum.innerHTML = `${this.health}/${this.maxHealth}`;
		healthLine.style.width = `${(this.health/this.maxHealth)*100}%`;
	}

	heal(amount){
		let t = this.health;
		this.health += amount;
		if(this.health>this.maxHealth)
			this.health = this.maxHealth;
		createTextParticle(
			this.pos.x+8, 
			this.pos.y-8,
			`${this.health - t}`, '#00F01F',
			2500);

		const healthNum = document.getElementById('healthNum');
		const healthLine = document.getElementById('healthLine');

		healthNum.innerHTML = `${this.health}/${this.maxHealth}`;
		healthLine.style.width = `${(this.health/this.maxHealth)*100}%`;
	}

	remove(level, deltaTime = 1000/144){
		if(!this.isDowned){
			createFullscreenSplash(
				`You died`,
				'#C43234');

			this.isDowned = true;
			this.canCollide = false;
			this._canRegenerate = this.canRegenerate;
			this.canRegenerate = false;

			this.stopMoving();
			this.setVel(-0.8, -4.5);

			this.downTimeout = _respawnTime;

			this._stopMoving = this.stopMoving;
		} else {
			this.downTimeout -= deltaTime;
			if(this.downTimeout <= 0){
				this.stopMoving = this._stopMoving;
				this._stopMoving = undefined;

				this.downTimeout = undefined;
				this.canCollide = true;
				this.isDowned = false;
				this.canRegenerate = this._canRegenerate;


				this.setPos(
					level.respswn.x,
					level.respswn.y);
				this.setVel(0, 0);

				this.health = this.maxHealth;
				healthNum.innerHTML = `${this.health}/${this.maxHealth}`;
				healthLine.style.width = `${(this.health/this.maxHealth)*100}%`;
			}
		}
	}

	//update

	updateProxy(deltaTime, tileCollider, camera, gravity){
		if(this.attacking && this.animTime >= this.attackTime){
			this.attacking = false;
			this.animTime = 0;
		}


		if(this.skillCooldownTimer != 0){
			this.skillCooldownTimer -= deltaTime;
			if(this.skillCooldownTimer < 0) this.skillCooldownTimer = 0;

			document.getElementById('skillCD')
				.style.height = `${(this.skillCooldownTimer / this.skillCooldown)*100}%`;
		}

		if(this.attackCooldownTimer != 0){
			this.attackCooldownTimer -= deltaTime;
			if(this.attackCooldownTimer < 0) this.attackCooldownTimer = 0;
		}

		if(this.usingSkill){
			if(this.animTime >= this.castTime && !this.skillCasted){
				this.skillCasted = true;
				let pos = this.pos.x;
				if(this.facing == 'right') pos += 8;
				createProjectile(
					this,
					pos,
					this.pos.y+8,
					5000,
					10, this.skillDamage,
					{name: 'kunai', frames: 1},
				);
			}
			if(this.animTime >= this.skillTime){
				this.skillCasted = undefined;
				this.usingSkill = false;
				this.animTime = 0;
			}
		}

		if(this.onGround && !this.onMove) this.stopMoving();
	}

	updateSprite(){
		if(this.isDowned){
			this.state = 'Downed';
			return;
		}
		let oldState = `${this.facing}${this.onMove}${this.onGround}`;
		if(this.facing=='none'){
			this.state = 'Confused';
			return;
		}

			// console.log(this.onGround);
		if(!this.onGround){
			// console.log(this.onGround);
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
		} else if(this.onGround){
			if(this.facing=='right') this.setAnimFrame('IdleRight', 4);
			else if(this.facing=='left') this.setAnimFrame('IdleLeft', 4);
			else this.state = 'Confused';
		} else {
			this.state = 'Confused';
		}

		if(this.attacking || this.usingSkill){
			if(!this.onGround){
				if(this.facing == 'right'){
					if(this.vel.y < 0) this.setAnimFrame('AttackJumpUpRight', 5);
					else this.setAnimFrame('AttackJumpDownRight', 5);
				} else {
					if(this.vel.y < 0) this.setAnimFrame('AttackJumpUpLeft', 5);
					else this.setAnimFrame('AttackJumpDownLeft', 5);
				}
			} else if(this.onMove){
				if(this.facing == 'right') this.setAnimFrame('AttackRunRight', 5);
				else this.setAnimFrame('AttackRunLeft', 5);
			} else {
				if(this.facing == 'right') this.setAnimFrame('AttackIdleRight', 5);
				else this.setAnimFrame('AttackIdleLeft', 5);
			}
		} else if(
			`${this.facing}${this.onMove}${this.onGround}`!=oldState) this.animTime = 0;
	}

	setAnimFrame(name, frames){
		if(this.onMove&&this.onGround){
			let frame = Math.floor((this.distance/16)%frames);
			this.state = `${name}${frame}`;
			// console.log(frame);
		} else {
			let dt;
			if(this.onGround) dt = 150;
			else dt=100;

			if(this.attacking || this.usingSkill) dt = 75;
			let frame = Math.floor(this.animTime/dt)%frames;
			this.state = `${name}${frame}`;
		}
	}

	draw(camera, ctx=_ctx){
	_ctx.imageSmoothingEnabled = false;
		this.updateSprite();
		this.spritesheet.draw(
			this.state,
			(this.pos.x - camera.pos.x),
			(this.pos.y - camera.pos.y), ctx);
	_ctx.imageSmoothingEnabled = _smoothing;
	}

}



/*  ---- EntityPart ---- */




class EntityPart extends Entity{
	constructor(entity, x=0, y=0, sprite={spriteName: 'noSprite', animationFrames: 1}, lifetime=-1){
		let sizes;
		if(sprite.animationFrames==1){
			sizes = entity.spritesheet.spriteSize(`part${sprite.spriteName}`);
		} else {
			sizes = entity.spritesheet.spriteSize(`part${sprite.spriteName}0`);
		}
		let spritesheet = new SpriteSheet(sizes.width, sizes.height);

		super(spritesheet, entity.pos.x+x, entity.pos.y+y);
		this.type = _s_entitypart;
		this.parent = entity;

		this.frameDuration = 75;

		this.knockbackTaken = 0;

		this.relPos = new Vect2(x, y);

		entity.childs.add(this);

		if(sprite.spriteName == 'noSprite'){
			this.draw = () =>{}
		} else {

			this.sprite = sprite;

			if(sprite.animationFrames == 1){
				this.updateSprite = () => {}
				this.state = `part${this.sprite.spriteName}`;
			} else {
				this.updateSprite = () =>{
					this.setAnimFrame(this.sprite.spriteName, this.sprite.animationFrames);
				}
			}

			this.draw = (camera, ctx=_ctx) =>{
				this.updateSprite();
				this.parent.spritesheet.draw(
					this.state,
					(this.pos.x - camera.pos.x),
					(this.pos.y - camera.pos.y), ctx);
			}
		}

		if(lifetime != -1){
			this.lifetime = lifetime;
		}
	}

	destructor(){
		this.parent.childs.delete(this);
	}

	velocityTick(deltaTime, tileCollider, camera, gravity){
		this.relPos.y += this.vel.y*deltaTime/16;
		this.pos.y = this.parent.pos.y + this.relPos.y;

		this.relPos.x += this.vel.x*deltaTime/16;
		this.pos.x = this.parent.pos.x + this.relPos.x;
	}

	update(deltaTime, tileCollider, camera, gravity){
		this.velocityTick(deltaTime, tileCollider, camera, gravity);
		this.animTime+=deltaTime;
		if(this.lifetime){
			this.lifetime -= deltaTime;
		}
	}

	setAnimFrame(name, frames){
		let frame = Math.floor(this.animTime/this.frameDuration)%frames;
		this.state = `part${name}${frame}`;
	}
}



/*  ---- Box ---- */




class Box extends Entity{
	constructor(spritesheet, x=0, y=0){
		super(spritesheet, x, y);
		this.type = _s_box;

		this.knockbackTaken = 0;

		this.maxHealth = -1;
		this.health = this.maxHealth;

		this.canRegenerate = false;
	}

	updateSprite = () =>{}

	updateProxy(){
		if(this.onGround) this.stopMoving();
	}
}




/*  ---- Projectile ---- */




class Projectile extends Entity{
	constructor(entity, posx, posy, lifetime, damage, sprite = {name: 'noTexture', frames: 1}, isRotating = true){

		let spr;
		if(sprite.frames == 1)
			spr = entity.spritesheet.getSprite(sprite.name);
		else 
			spr = entity.spritesheet.getSprite(`${sprite.name}0`);

		if(!spr) spr = {width: _TILESIZE, height:_TILESIZE};

		let spritesheet;
		if(isRotating){
			spritesheet = new SpriteSheet(spr.width*1.5, spr.width*1.5);
		} else {
			spritesheet = new SpriteSheet(spr.width, spr.width);
		}

		super(spritesheet, posx, posy);

		this.owner = entity;
		this.ownerSpritesheet = entity.spritesheet;

		this.type = _s_projectile;
		this.maxHealth = -1;
		this.health = this.maxHealth;
		this.canRegenerate = false;

		this.facing = entity.facing;

		this.isRotating = isRotating;

		this.damage = damage;
		this.damagedList = new Set();

		this.sprite = sprite;

		if(lifetime != -1){
			this.lifetime = lifetime*3;
			this._lifetime = lifetime;
		}

		this.gravityMultipler = 1;


		if(isRotating){
			this.spriteBuffer = document.createElement('canvas');
			this.spriteBuffer.width  = spr.width*1.5;
			this.spriteBuffer.height = spr.width*1.5;
			this.bctx = this.spriteBuffer.getContext('2d');
		}
	}

	AddScore(score){
		if(this.owner.AddScore) this.owner.AddScore(score);
	}

	stopMoving(){
		if(this.vel.x != 0){
			let sign = Math.sign(this.vel.x);
			this.setVel(0, this.vel.y);
			this.updateSprite();
			if(sign > 0) this.pos.x += this.offsX/2;
			else this.pos.x -= this.offsX/2;
		}
		this.vel.x = 0;
	}

	velocityTick(deltaTime, tileCollider, camera, gravity){
		this.vel.y += gravity*deltaTime/32 * this.gravityMultipler;

		this.pos.y+=(this.vel.y*deltaTime/16);
		if(this.canCollide) tileCollider.checkY(this, deltaTime, gravity);

		this.pos.x+=(this.vel.x*deltaTime/16);
		if(this.canCollide) tileCollider.checkX(this, deltaTime, gravity);

		if(this.onGround) this.stopMoving();
		this.velocityTickProxy(deltaTime, tileCollider, camera, gravity);
	}

	updateProxy(deltaTime){
		if(this.lifetime)
			this.lifetime -= deltaTime;
		if(this.onGround && this._lifetime){
			this.lifetime = this._lifetime;
			this._lifetime = undefined;
		}
	}

	blockCollideX(){}
	blockCollideY(){}

	remove(level){
		level.entities.delete(this);
	}

	updateSprite(){
		if(!this.isRotating){
			if(this.sprite.frames > 1)
				this.setAnimFrame(this.sprite.name, this.sprite.frames);
			else
				this.state = this.sprite.name;
			return;
		}
		if(this.onGround) return;
		this.bctx.clearRect(
			0, 0, 
			this.spriteBuffer.width,
			this.spriteBuffer.height);

		let rotation = this.vel.y/Math.sqrt(this.vel.x**2 + this.vel.y**2);

		let mirr = 0;
		if(this.vel.x <  0){
			mirr = 1;
		}

		let spr;
		if(this.sprite.frames == 1)
			spr = this.ownerSpritesheet.getSprite(this.sprite.name);
		else {
			let frame = Math.floor(this.animTime/150) % this.sprite.frames;
			spr = this.ownerSpritesheet.getSprite(`${this.sprite.name}${frame}`);
		}

		this.offsX = (this.spriteBuffer.width  - spr.width)  *(rotation)  /2;
		this.offsY = (this.spriteBuffer.height - spr.height) *(1-rotation)/2;

		if(this.vel.x == 0){
			rotation = Math.PI/2;

			this.bctx.setTransform(
				1-2*mirr, 0,
				0, 1,
				0.5+this.spriteBuffer.width/2*rotation,
				0);
			this.bctx.rotate(rotation);

			this.bctx.drawImage(spr, 2, 2);
			this.offsX *= 2 -0.25;
			this.offsY *= -1;
			this.setOffset(this.offsX, this.offsX, this.offsY, this.offsY+2);
		} else {
			this.bctx.setTransform(
				1-2*mirr, 0,
				0, 1,
				this.spriteBuffer.width/2*rotation
					+ mirr*this.spriteBuffer.width*(1 - rotation),
				(spr.height - this.spriteBuffer.height)/2*rotation);
			this.bctx.rotate(rotation);
			this.setOffset(this.offsX, this.offsX, this.offsY, this.offsY+2);
			if(this.vel.x > 0){
				this.bctx.drawImage(
					spr,
					(this.spriteBuffer.width - spr.width)/2,
					(this.spriteBuffer.height - spr.height)/2);
			} else if(this.vel.x < 0){
				this.bctx.drawImage(
					spr,
					4+spr.width,
					4,
					-spr.width,
					spr.height);
			}
		}

	}

	draw(camera, ctx=_ctx){
		this.updateSprite();
		if(this.isRotating){
			ctx.drawImage(
				this.spriteBuffer,
				(this.pos.x - camera.pos.x),
				(this.pos.y - camera.pos.y)
			);
		} else {
			this.ownerSpritesheet.draw(
				this.state,
				(this.pos.x - camera.pos.x),
				(this.pos.y - camera.pos.y),
				ctx);
		}
	}
}



/*  ---- Guardian ---- */




class Guardian extends Entity{
	constructor(spritesheet, x=0, y=0, sx = x, sy = y){
		super(spritesheet, x, y);
		this.type = _s_enemy;

		this.facing = 'left';
		this.setOffset(2, 2);

		this.speed = 0.5;
		this.knockbackTaken = 0.8;

		this.damage = 25;
		this.skillDamage = 20;

		this.searchRadius = 15*_TILESIZE;
		this.wait = 0;
		this.searchpoint = new Vect2(sx, sy);
		this.playerInRadius = false;

		this.maxHealth = 200;
		this.health = this.maxHealth;

		this.usingSkill = false;
		this.skillCooldown = 2500;
		this.skillCooldownTimer = this.skillCooldown/2;

		this.attackCooldown = 300;
		this.attackCooldownTimer = this.attackCooldown;

		this.hostile = true;

		this.score = 200;
	}

	skill(dx, dy, r){
		this.skillCooldownTimer =  this.skillCooldown;
		this.usingSkill = true;
		this.distance = 0;

		let vx = dx/r * 2.5;
		let vy = dy/r * 2.5;

		createGuardianProjectile(
			this,
			8000,
			vx, vy,
			this.skillDamage,
			{name: 'partdarkMagic', frames: 8},
		);
	}

	AITick(entities, deltaTime){
		if(this.isDowned){
			this.stopMoving();
			return;
		}
		if(this.hostile){
			let playerInRadius = false;
			entities.forEach(entity=>{
				if(entity.type != _s_player) return;
				if(entity.isDowned) return;
				let dx = (this.pos.x+12 - entity.pos.x-8);
				let dy = (this.pos.y+16 - entity.pos.y-12);
				let r2 = dx**2 + dy**2;
				if(r2 > this.searchRadius**2*2){
					return;
				}
				playerInRadius = true;
				this.playerInRadius = true;

				if(this.skillCooldownTimer == 0){
					this.skill(-dx, -dy, Math.sqrt(r2));
				}

				this.running = true;

				if(dx < 0){
					this.moveRight(deltaTime);
				} else {
					this.moveLeft(deltaTime);
				}
			
				if(Math.abs(dx)<_TILESIZE) this.stopMoving();
				this.target = true;
			});
			if(!playerInRadius && this.playerInRadius){
				this.playerInRadius = false;
				this.target = undefined;
				this.running = false;
				// this.searchpoint.set(this.pos.x, this.pos.y);
			}
			if(playerInRadius) return;
		}

		if(!this.target){
			if(this.wait <= 0){
				let dist = this.searchRadius/2 + this.searchRadius*rand()/2;
				let dir  = rand() - 0.5;

				if(this.pos.x > this.searchpoint.x 
					&& this.pos.x - this.searchpoint.x > this.searchRadius-_TILESIZE*3){
					dir = -1;
				}

				if(this.pos.x < this.searchpoint.x 
					&& this.searchpoint.x - this.pos.x > this.searchRadius-_TILESIZE*3){
					dir = 1; 
				}

				let t;
				if(dir > 0)
					t = this.pos.x + dist;
				else
					t = this.pos.x - dist;

				if(t > this.searchpoint.x + this.searchRadius)
					t = this.searchpoint.x + this.searchRadius;

				if(t < this.searchpoint.x - this.searchRadius)
					t = this.searchpoint.x - this.searchRadius;

				this.target = t;
				// console.log(this.pos.x, this.target, dist, dir);
			} else {
				this.wait -= deltaTime;
			}
		}

		if(this.target < this.pos.x) this.moveLeft(deltaTime);
		if(this.target > this.pos.x) this.moveRight(deltaTime);

		if(Math.abs(this.target - this.pos.x) < 1){
			this.stopMoving();
			this.target = undefined;
			this.wait = 2000 + 4000*fastRand();
		}
	}

	takeDamage(amount, color, entity, posx, posy){
		if(this.damageCooldownTimer != 0) return;
		this.damageCooldownTimer = this.damageCooldown;
		createTextParticle(
			this.pos.x+8, 
			this.pos.y-8,
			`${amount}`, color,
			2500);
		createGuardArmorSplash(posx, posy, entity.facing);


		if(this.pos.x + this.spritesheet.width/2
			< entity.pos.x + entity.spritesheet.width/2){
			this.vel.x -= this.knockbackTaken*this.__kbHor;
		} else {
			this.vel.x += this.knockbackTaken*this.__kbHor;
		}

		this.vel.y = this.__kbVer * (this.knockbackTaken*2);

		if(this.health == -1) return;

		this.health -= amount;
		if(this.health <= 0){
			this.health=0;
			if(entity.AddScore) entity.AddScore(this.score);
		}
		this.regenTimeout = this.regenInterval;
	}

	setAnimFrame(name, frames){
		let frame = Math.floor(this.animTime/300)%frames;
		if(this.state != `${name}${frame}`){
			this.state = `${name}${frame}`;
			createGuardianMist(this);
		}
	}

	setAnimFrameNoRepeat(name, frames){
		let frame = Math.floor(this.animTime/100);
		if(frame >= frames-1 && frame < frames) frame = frames-2;
		else if(frame >= frames) frame = frames-1;
		if(frame == 1){
			createGuardianDeathMist(this, 6);
		}
		if(frame == 2){
			createGuardianDeathMist(this, 12);
		}
		this.state = `${name}${frame}`;
	}

	updateProxy(deltaTime, tileCollider, camera, gravity){
		if(!this.onMove && this.onGround) this.stopMoving();

		if(this.skillCooldownTimer != 0){
			this.skillCooldownTimer -= deltaTime;
			if(this.skillCooldownTimer < 0) this.skillCooldownTimer = 0;
		}

		if(this.attackCooldownTimer != 0){
			this.attackCooldownTimer -= deltaTime;
			if(this.attackCooldownTimer < 0){
				// console.log('attack cd ended');
				this.attackCooldownTimer = 0;
			}
		}
	}

	updateSprite(){
		if(!this.isDowned){
			if(this.facing == 'left'){
				this.setAnimFrame('IdleLeft', 4);
			} else {
				this.setAnimFrame('IdleRight', 4);
			}
		} else {
			if(this.facing == 'left'){
				this.setAnimFrameNoRepeat('DeadLeft', 4);
			} else {
				this.setAnimFrameNoRepeat('DeadRight', 4);
			}
		}
	}

	blockCollideX(){
		if(!this.playerInRadius)
			this.target = undefined;
	}
}