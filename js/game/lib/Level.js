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
		this.lightsources = new Set();

		this.respswn = {x:128, y:0};
	}

	width(){
		return _TILESIZE*this.tiles.grid.length;
	}

	heightAt(posx){
		posx+=_TILESIZE/2;
		let posX = (posx-posx%_TILESIZE)/_TILESIZE; 
		if(posX<0) posX = 0;
		if(posX>this.width()) posX = this.width();
		return _TILESIZE*this.tiles.grid[posX].length;
	}

	entityUpdates(entity, deltaTime, camera){
		if(entity.type != 'player'){
			if( entity.pos.x < camera.pos.x - camera.size.x/2   ||
				entity.pos.x > camera.pos.x + camera.size.x*1.5 ||
				entity.pos.y < camera.pos.y - camera.size.y/2   ||
				entity.pos.y > camera.pos.y - camera.offset.y + camera.size.y*1.5) return;
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

	drawFrame(camera) {
		if(_shadowsEnabled){
			this.comp.createShadows(camera, this.tiles, this.backing, this.lightsources);
		}
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