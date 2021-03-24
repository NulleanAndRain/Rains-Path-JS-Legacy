class Player extends Entity{
	constructor(spritesheet, x=0, y=0){
		super(spritesheet, x, y);
		this.type = 'player';
		this.setOffset(4, 4, 2);

		this.attackTime = 375;
		this.castTime = 150;
		this.skillTime = 375;

		this.usingSkill = false;

		this.respTimed = false;

		this.skill = this._skill_proxy;
		this.attack = this._attack_proxy;
		this.buttonTestEvent = this._buttonTestEvent_proxy;
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

	//attack and skills

	skill(){}
	_skill_proxy(){
		this.usingSkill = true;
		this.animTime = 0;
		this.skillCasted = false;
		this.skill = () =>{};
	}

	attack(){}
	_attack_proxy(){
		this.attacking = true;
		this.animTime = 0;
		this.attack = () =>{}
		createRainsWeapon(this,
			{spriteName: 'racketR', animationFrames: 5},
			{spriteName: 'racketL', animationFrames: 5},
			this.attackTime);
	}

	_buttonTestEvent_proxy(){

		createBizarreParticle(
			this.pos.x+8  + (rand()-0.5)*10, 
			this.pos.y    + (rand()-0.5)*10,);
		// this.takeDamage(10, '#c26352', this.facingReverse, this.pos.x+8, this.pos.y+10);
	}

	//damage and heal

	takeDamage(amount, color, facing, posx, posy){
		this.health -= amount;
		if(this.health<0) this.health = 0;
		createTextParticle(
			this.pos.x+8, 
			this.pos.y-8,
			`${amount}`, color,
			2500);
		createBloodSplash(posx, posy, facing);

		this.regenTimeout = this.regenInterval;

		healthNum.innerHTML = `${this.health}/${this.maxHealth}`;
		healthLine.style.width = `${(this.health/this.maxHealth)*100}%`;
	}

	regen(){
		this.health += 1;
		if(this.health>this.maxHealth)
			this.health = this.maxHealth;
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
			this.attack = this._attack_proxy;
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
					10, 15,
					{name: 'kunai', frames: 1},
				);
			}
			if(this.animTime >= this.skillTime){
				this.skillCasted = undefined;
				this.usingSkill = false;
				this.animTime = 0;
				this.skill = this._skill_proxy;
			}
		}
	}
}

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
		this.type = 'entityPart';
		this.parent = entity;

		this.frameDuration = 75;

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
				_ctx.imageSmoothingEnabled=false;
				this.parent.spritesheet.draw(
					this.state,
					(this.pos.x - camera.pos.x),
					(this.pos.y - camera.pos.y), ctx);
				_ctx.imageSmoothingEnabled=_smoothing;
			}
		}

		if(lifetime != -1){
			this.lifetime = lifetime;
		}
	}

	destructor(){
		this.parent.childs.delete(this);
	}

	veliocityTick(deltaTime, tileCollider, camera, gravity){
		this.relPos.y += this.vel.y*deltaTime/16;
		this.pos.y = this.parent.pos.y + this.relPos.y;

		this.relPos.x += this.vel.x*deltaTime/16;
		this.pos.x = this.parent.pos.x + this.relPos.x;
	}

	update(deltaTime, tileCollider, camera, gravity){
		this.veliocityTick(deltaTime, tileCollider, camera, gravity);
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

class Box extends Entity{
	constructor(spritesheet, x=0, y=0){
		super(spritesheet, x, y);
		this.type = 'box';

		this.maxHealth = -1;
		this.health = this.maxHealth;

		this.canRegenerate = false;
	}

	updateSprite = () =>{}
}

class Projectile extends Entity{
	constructor(entity, posx, posy, lifetime, damage, sprite = {name: 'noTexture', frames: 1}){

		let spr;
		if(sprite.frames == 1)
			spr = entity.spritesheet.getSprite(sprite.name);
		else 
			spr = entity.spritesheet.getSprite(`${sprite.name}0`);
		let spritesheet = new SpriteSheet(spr.width+4, spr.width+4);

		super(spritesheet, posx, posy);

		this.owner = entity;

		this.type = 'projectile';
		this.maxHealth = -1;
		this.health = this.maxHealth;
		this.canRegenerate = false;

		this.facing = entity.facing;

		this.damage = damage;
		this.damagedList = new Set();

		this.sprite = sprite;

		if(lifetime != -1) this._lifetime = lifetime;

		this.gravityMultipler = 1;


		this.spriteBuffer = document.createElement('canvas');
		this.spriteBuffer.width  = spr.width + 4;
		this.spriteBuffer.height = spr.width + 4;
		this.bctx = this.spriteBuffer.getContext('2d');
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

	veliocityTick(deltaTime, tileCollider, camera, gravity){
		this.vel.y += gravity*deltaTime/32 * this.gravityMultipler;

		this.pos.y+=(this.vel.y*deltaTime/16);
		if(this.canCollide) tileCollider.checkY(this, deltaTime, gravity);

		this.pos.x+=(this.vel.x*deltaTime/16);
		if(this.canCollide) tileCollider.checkX(this, deltaTime, gravity);

		if(this.onGround) this.stopMoving();
		this.veliocityTickProxy(deltaTime, tileCollider, camera, gravity);
	}

	updateProxy(deltaTime){
		if(this.lifetime)
			this.lifetime -= deltaTime;
		if(this.onGround && !this.lifetime)
			this.lifetime = this._lifetime;
	}

	remove(level){
		level.entities.delete(this);
	}

	updateSprite(){
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
			spr = this.owner.spritesheet.getSprite(this.sprite.name);
		else {
			let frame = Math.floor(this.animTime/150) % this.sprite.frames;
			spr = this.owner.spritesheet.getSprite(`${this.sprite.name}${frame}`);
		}

		this.offsX = (this.spriteBuffer.width  - spr.width)  *(rotation)  /2;
		this.offsY = (this.spriteBuffer.height - spr.height) *(1-rotation)/2;

		if(this.vel.x == 0){
			rotation = Math.PI/2;

			this.bctx.setTransform(
				1, 0,
				0, 1,
				4*rotation,
				-4*(1-rotation));
			this.bctx.rotate(rotation);

			this.bctx.drawImage(spr, 2, -0.5);
			this.offsX *= 2 -0.25;
			this.offsY *= -1;
			this.setOffset(this.offsX, this.offsX, this.offsY, this.offsY+2);
		} else {
			this.bctx.setTransform(
				1-2*mirr, 0,
				0, 1,
				4*rotation + mirr*this.spriteBuffer.width*(1 - rotation),
				-4*rotation);
			this.bctx.rotate(rotation);
			this.setOffset(this.offsX, this.offsX, this.offsY, this.offsY);
			if(this.vel.x > 0){
				this.bctx.drawImage(spr, 2, 4);
			} else if(this.vel.x < 0){
				this.bctx.drawImage(spr, 4+spr.width, 4, -spr.width, spr.height);
			}
		}

	}

	draw(camera, ctx=_ctx){
		this.updateSprite();
		ctx.drawImage(
			this.spriteBuffer,
			(this.pos.x - camera.pos.x),
			(this.pos.y - camera.pos.y)
		);
	}

}