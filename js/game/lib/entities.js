class Player extends Entity{
	constructor(spritesheet, x=0, y=0){
		super(spritesheet, x, y);
		this.type = 'player';
		this.setOffset(4, 4, 2);

		this.attackTime = 375;

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

	veliocityTickProxy(deltaTime, tileCollider, camera, gravity){
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
	//attack and skills

	skill(){}
	_skill_proxy(){
		// createBizarreParticle(
		// 	this.pos.x+8  + (rand()-0.5)*10, 
		// 	this.pos.y    + (rand()-0.5)*10,);


		// createGradientTextParticle(
		// 	this.pos.x+8, 
		// 	this.pos.y+4,
		// 	`Ебаный рот этого казино, блядь`,
		// 	rainbow_gradient);

		createGradientTextParticle(
			this.pos.x+8, 
			this.pos.y+12,
			`${this}`,
			blue_gradient);
		// this.heal(100);

		// createCampfireSmoke(this.pos.x+8, this.pos.y+12);
	}

	attack(){}
	_attack_proxy(){
		this.attacking = true;
		this.animTime = 0;
		this.attack = () =>{}
		createRainsWeapon(this, {spriteName: 'racketR', animationFrames: 5}, {spriteName: 'racketL', animationFrames: 4}, this.attackTime);
	}

	_buttonTestEvent_proxy(){
		this.takeDamage(10, '#c26352', this.facingReverse, this.pos.x+8, this.pos.y+10);
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