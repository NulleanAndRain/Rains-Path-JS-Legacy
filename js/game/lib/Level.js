class Level {
	constructor() {
		this.gravity = 1;

		this.comp = new Compositor();
		this.tiles = new Matrix();
		this.backing = new Matrix();
		this.bg = new Matrix();
		this.tileSize = _TILESIZE;

		this.animations = {};

		this.globalTime = 0;

		this.tileCollider = new TileCollider(this.tiles);

		this.entities = new Set();
		this.particles = new Set();
	}

	width(){
		return _TILESIZE*this.tiles.grid.length;
	}

	heightAt(posx){
		posx+=_TILESIZE/2;
		let posX = (posx-posx%_TILESIZE)/_TILESIZE; 
		if(posX<0) posX = 0;
		return _TILESIZE*this.tiles.grid[posX].length;
	}

	entityUpdates(entity, deltaTime, camera){
		entity.update(deltaTime, this.tileCollider, camera, this.gravity);

		if(entity.lifetime){
			if(entity.lifetime<0){
				entity.destructor();
				this.entities.delete(entity);
			}
		}

		entityCollision(entity, this.entities);

		entity.childs.forEach(child => {
			this.entityUpdates(child, deltaTime, camera);
		})
	}

	playerUnderMapCheck(entity){
		if(entity.parent) return;
		if(entity.pos.y>this.heightAt(entity.pos.x)){
			if(!entity.respTimed){
				entity.respTimed = true;
				setTimeout(() => {
					if(entity.type=='player')
						console.log(`Rain выпала из мира`);
					entity.pos.x=128;
					entity.pos.y-0;
					entity.stopMoving();
					entity.land(0);
					camera.pos.x=0;
					camera.underMap=false;
					entity.respTimed = false
				}, 1000);
			}
		}
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

	drawFrame(camera) {
		this.comp.draw(camera, _ctx);

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