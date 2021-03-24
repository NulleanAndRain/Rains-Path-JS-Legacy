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
		return _TILESIZE*this.tiles.grid[posX].length;
	}

	entityUpdates(entity, deltaTime, camera){
			entity.update(deltaTime, this.tileCollider, camera, this.gravity);

			if(_collDebug){
				this.tileCollider.highlightHitbox(entity, camera);
			}

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
				this.particles.delete(particle);
			}
		});
	}

	drawFrame(camera) {
		this.comp.draw(camera, _ctx);
		this.entities.forEach(entity => {
			if(entity.parent) return;
			entity.draw(camera);

			entity.childs.forEach(child => {
				child.draw(camera);
			});
		});

		this.particles.forEach(particle => {
			particle.draw(camera);
		});
	}

}