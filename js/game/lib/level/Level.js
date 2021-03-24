class Level {
	constructor(levelMapFG, levelMapBack, levelMapBG, sky) {
		this.gravity = 1;

		this.levelFront = levelMapFG;
		this.levelBack  = levelMapBack;
		this.levelBG 	= levelMapBG;
		this.sky	 	= sky;


		this.tileCollider = new TileCollider(this.levelFront);

		this.entities = new Set();
		this.particles = new Set();
		// this.lightsources = new Set();

		this.respswn = {x:0, y:0};
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

	width(){
		return this.levelFront.levelWidth;
	}

	heightAt(posx){
		if(this.levelFront)
			return this.levelFront.heightAt(posx);
		return 0;
	}

	entityUpdates(entity, deltaTime, camera){
		if(entity.type != 'player'){
			if( entity.pos.x < camera.pos.x - camera.size.x/2   ||
				entity.pos.x > camera.pos.x + camera.size.x*1.5 ||
				entity.pos.y < camera.pos.y - camera.size.y/2   ||
				entity.pos.y > camera.pos.y + camera.size.y*1.5) return;
		}
		entity.update(deltaTime, this.tileCollider, camera, this.gravity);

		if(entity.lifetime){
			if(entity.lifetime<0){
				entity.destructor();
				this.entities.delete(entity);
			}
		} else if(entity.health == 0){
			entity.remove(this, deltaTime);
		}

		entityCollision(entity, this.entities);

		entity.childs.forEach(child => {
			this.entityUpdates(child, deltaTime, camera);
		})
	}

	update(deltaTime, camera) {
		this.globalTime += deltaTime;
		this.entities.forEach(entity => {
			if(entity.parent) return;
			this.entityUpdates(entity, deltaTime, camera);
		});

		this.particles.forEach(particle => {
			particle.update(deltaTime);
			if(particle.veliocityTick){
				particle.veliocityTick(deltaTime, this.tileCollider, this.gravity, camera);
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

		ctx.drawImage(this.sky, 0, 0);

		ctx.filter = 'brightness(120%) blur(3px)';
		ctx.drawImage(
			this.bg,
			// 0, 0,
			-camera.subcamera.pos.x % (_CHUNKPIXELS*2) - (camera.subcamera.deposX),
			-camera.subcamera.pos.y % (_CHUNKPIXELS*2) - (camera.subcamera.deposY),
			_canvas.width  + _CHUNKPIXELS*4,
			_canvas.height + _CHUNKPIXELS*4);

		ctx.filter = 'brightness(50%)';
		ctx.drawImage(
			this.back,
			// 0, 0);
			-camera.pos.x % _CHUNKPIXELS - (camera.deposX),
			-camera.pos.y % _CHUNKPIXELS - (camera.deposY));

		ctx.filter = 'none';
		ctx.drawImage(
			this.front,
			// 0, 0);
			-camera.pos.x % _CHUNKPIXELS - (camera.deposX),
			-camera.pos.y % _CHUNKPIXELS - (camera.deposY));



		this.particles.forEach(particle => {
			if(!particle.drawFirst) return;
			particle.draw(camera);
			if(_collDebug) this.tileCollider.highlightHitboxParticle(particle, camera);
		});

		this.entities.forEach(entity => {
			if(entity.parent) return;
			entity.draw(camera);
			if(_collDebug) this.tileCollider.highlightHitbox(entity, camera);

			entity.childs.forEach(child => {
				child.draw(camera);
				if(_collDebug) this.tileCollider.highlightHitbox(child, camera);
			});
		});

		this.particles.forEach(particle => {
			if(particle.drawFirst) return;
			particle.draw(camera);
			if(_collDebug) this.tileCollider.highlightHitboxParticle(particle, camera);
		});

		if(_collDebug) this.tileCollider.drawCollisionLayer(camera);
	}
}