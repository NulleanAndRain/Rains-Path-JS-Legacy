class Player extends Entity{
	constructor(spritesheet, x=0, y=0){
		super(spritesheet, x, y);
		this.type = 'player';
		this.setOffset(4, 4, 2);

		this.attackTime = 375;

		this.skill = this._skill_proxy;
		this.attack = this._attack_proxy;
		this.buttonTestEvent = this._buttonTestEvent_proxy;
	}

	veliocityTick(deltaTime, tileCollider, camera, gravity){
		this.addVel(0, gravity*deltaTime/30);

		this.pos.y+=(this.vel.y*deltaTime/16);
		if(this.canCollide) tileCollider.checkY(this, camera);

		this.pos.x+=(this.vel.x*deltaTime/16);
		if(this.canCollide) tileCollider.checkX(this, camera);

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
		createBizarreParticle(
			this.pos.x+8  + (rand()-0.5)*10, 
			this.pos.y    + (rand()-0.5)*10,);
		// createTextParticle(
		// 	this.pos.x+8, 
		// 	this.pos.y+4,
		// 	'15', '#f88',
		//	5000);
		// crateBloodSplash(this.pos.x+8, this.pos.y+12, this.facing);
	}

	attack(){}
	_attack_proxy(){
		this.attacking = true;
		this.animTime = 0;
		this.attack = () =>{}
		createRainsWeapon(this, {spriteName: 'racketR', animationFrames: 5}, {spriteName: 'racketL', animationFrames: 4}, this.attackTime-10);
	}

	_buttonTestEvent_proxy(){
		createRainbowTextParticle(
			this.pos.x+8, 
			this.pos.y+4,
			`ты пидор`);
	}

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
		// console.log('deleted');
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
	}

	updateSprite = () =>{}
}