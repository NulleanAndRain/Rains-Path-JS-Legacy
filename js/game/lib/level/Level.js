class Level {
	constructor(levelMapFG, levelMapBack, levelMapBG, sky) {
		this.gravity = 0.9;

		this.levelFront = levelMapFG;
		this.levelBack  = levelMapBack;
		this.levelBG 	= levelMapBG;
		this.sky	 	= sky;


		this.tileCollider = new TileCollider(this.levelFront);

		this.entities = new Set();
		this.particles = new Set();
		this.tileEntities = new Set();

		this.respswn = new Vect2(0, 0);
		this.globalTime = 0;


		this.front = document.createElement('canvas');
		this.front.width  = _canvas.width;
		this.front.height = _canvas.height;
		this.frontctx = this.front.getContext('2d');

		this.back = document.createElement('canvas');
		this.back.width  = _canvas.width;
		this.back.height = _canvas.height;
		this. backctx = this.back.getContext('2d');

		this.bg = document.createElement('canvas');
		this.bg.width  = _canvas.width/2  + _CHUNKPIXELS*2;
		this.bg.height = _canvas.height/2 + _CHUNKPIXELS*2;
		this.bgctx = this.bg.getContext('2d');
	}

	get width(){
		return this.levelFront.levelWidth;
	}
	get leftBorder(){
		return this.levelFront.leftBorder;
	}
	get rightBorder(){
		return this.levelFront.rightBorder;
	}
	heightAt(posx){
		return this.levelFront.heightAt(posx);
	}

	tileEntityUpdates(entity, deltaTime, camera){
		if(entity.type != 'player' && !entity.parent){
			if( entity.pos.x < camera.drawFromX *_CHUNKPIXELS	||
				entity.pos.x > camera.drawToX   *_CHUNKPIXELS	||
				entity.pos.y < camera.drawFromY *_CHUNKPIXELS	||
				entity.pos.y > camera.drawToY   *_CHUNKPIXELS) return;
		}
		entity.update(deltaTime, this.tileCollider, camera, this.gravity);

		tileEntityCollision(entity, this.entities);

		if(entity.toRemove){
			this.tileEntities.delete(entity);
		}
	}

	entityUpdates(entity, deltaTime, camera){
		if(!entity.isDowned || entity.lifetime > 0){
			if(entity.type != 'player' && !entity.parent && entity.type != 'projectile'){
				if( entity.pos.x < (camera.drawFromX - 1)*_CHUNKPIXELS	||
					entity.pos.x > (camera.drawToX   + 1)*_CHUNKPIXELS	||
					entity.pos.y < (camera.drawFromY - 1)*_CHUNKPIXELS	||
					entity.pos.y > (camera.drawToY   + 1)*_CHUNKPIXELS) return;
			}
		}
		entity.update(deltaTime, this.tileCollider, camera, this.gravity);

		if(entity.lifetime){
			if(entity.lifetime <= 0){
				entity.destructor();
				this.entities.delete(entity);
			}
		} else if(entity.health == 0){
			entity.remove(this, deltaTime);
		}

		entityCollision(entity, this.entities);

		entity.childs.forEach(child => {
			this.entityUpdates(child, deltaTime, camera);
		});

		if(entity.pos.y > this.heightAt(entity.pos.x) + _CHUNKPIXELS*3){
			if(entity.health > 0){
				entity.takeDamage(
					entity.maxHealth*2,
					'#f33',
					{
						pos: {x:0, y:0},
						spritesheet: {width:0, height:0},
						facing: entity.facing
					},
					entity.pos.x+8,
					entity.pos.y+12);
			} else if(entity.lifetime){
				entity.remove(this, deltaTime);
			}
		}

		if(entity.AITick) entity.AITick(this.entities, deltaTime);
	}

	update(deltaTime, camera) {
		this.globalTime += deltaTime;

		this.tileEntities.forEach(entity => {
			this.tileEntityUpdates(entity, deltaTime, camera);
		});


		this.entities.forEach(entity => {
			if(entity.parent) return;
			this.entityUpdates(entity, deltaTime, camera);
		});

		this.particles.forEach(particle => {
			particle.update(deltaTime);
			if(particle.velocityTick){
				particle.velocityTick(deltaTime, this.tileCollider, this.gravity, camera);
			}
			if(particle.timeLeft<=0){
				if(particle.destructor) particle.destructor(deltaTime, camera);
				this.particles.delete(particle);
			}
		});
	}

	drawFrame(camera, ctx = _ctx) {
		camera.update();

		this.frontctx	.clearRect(0, 0, _canvas.width, _canvas.height);
		this.backctx	.clearRect(0, 0, _canvas.width, _canvas.height);
		this.bgctx		.clearRect(0, 0, _canvas.width, _canvas.height);

		this.frontctx.strokeRect(0, 0, this.levelFront.width/2, this.front.height/2);

		this.front.width  = _canvas.width;
		this.front.height = _canvas.height;

		this.back.width  = _canvas.width;
		this.back.height = _canvas.height;

		this.bg.width  = _canvas.width/2  + _CHUNKPIXELS*2;
		this.bg.height = _canvas.height/2 + _CHUNKPIXELS*2;


		this.levelFront	.draw(this.frontctx, camera);
		this.levelBack	.draw(this.backctx,  camera);
		this.levelBG	.draw(this.bgctx,    camera.subcamera);

		ctx.drawImage(
			this.sky,
			(_canvas.height - this.sky.height)/2,
			0,
		);

	_ctx.imageSmoothingEnabled = _smoothing;

		ctx.filter = 'brightness(120%) blur(3px)';
		ctx.drawImage(
			this.bg,
			-camera.subcamera.pos.x % (_CHUNKPIXELS*2) - (camera.subcamera.deposX),
			-camera.subcamera.pos.y % (_CHUNKPIXELS*2) - (camera.subcamera.deposY),
			_canvas.width  + _CHUNKPIXELS*4,
			_canvas.height + _CHUNKPIXELS*4);

		if(_bgBlur)
			ctx.filter = 'brightness(75%) blur(0.6px)';
		else
			ctx.filter = 'brightness(75%)';
		ctx.drawImage(
			this.back,
			-camera.pos.x % _CHUNKPIXELS - (camera.deposX),
			-camera.pos.y % _CHUNKPIXELS - (camera.deposY));

		ctx.filter = 'none';
		ctx.drawImage(
			this.front,
			-camera.pos.x % _CHUNKPIXELS - (camera.deposX),
			-camera.pos.y % _CHUNKPIXELS - (camera.deposY));


		this.tileEntities.forEach(entity => {
			entity.draw(camera);
			if(_collDebug) this.tileCollider.highlightHitbox(entity, camera);
		});



		this.particles.forEach(particle => {
			if(!particle.drawFirst) return;
			particle.draw(camera);
			if(_collDebug) this.tileCollider.highlightHitboxParticle(particle, camera);
		});


		this.entities.forEach(entity => {
	if(entity.type == 'player') _ctx.imageSmoothingEnabled = false;
	else _ctx.imageSmoothingEnabled = _smoothing;
			if(entity.parent) return;
			entity.draw(camera);
			if(_collDebug) this.tileCollider.highlightHitbox(entity, camera);

			entity.childs.forEach(child => {
				child.draw(camera);
				if(_collDebug) this.tileCollider.highlightHitbox(child, camera);
			});
		});
_ctx.imageSmoothingEnabled = _smoothing;
		this.particles.forEach(particle => {
			if(particle.drawFirst) return;
			particle.draw(camera);
			if(_collDebug) this.tileCollider.highlightHitboxParticle(particle, camera);
		});

		if(_collDebug) this.tileCollider.drawCollisionLayer(camera);
	}
}