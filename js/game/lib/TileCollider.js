var __collisionStops = true;

class TileCollider {
	constructor(tileMatrix) {
		this.tiles = new TileResolver(tileMatrix);

		this.collisionLayer = document.createElement('canvas');
			this.collisionLayer.width = _canvas.width;
			this.collisionLayer.height = _canvas.height;
		this.cctx = this.collisionLayer.getContext('2d');

		//_collDebug
		this.collisions = new Set();
		this.autojumpMatch = undefined;

		setupJumpCheck(this);
	}

	drawCollisionLayer(camera, ctx=_ctx){
		this.collisions.forEach(match=>{
			this.cctx.strokeStyle = "red";
			this.cctx.strokeRect(
				match.x1-camera.pos.x,
				match.y1-camera.pos.y,
				match.x2-match.x1,
				match.y2-match.y1);
		});

		this.collisions.clear();

		if(this.autojumpMatch){
			this.cctx.fillStyle = 'rgba(255, 0, 255, 0.4)';
			this.cctx.fillRect(
				this.autojumpMatch.x1-camera.pos.x,
				this.autojumpMatch.y1-camera.pos.y,
				this.autojumpMatch.x2-this.autojumpMatch.x1, 
				this.autojumpMatch.y2-this.autojumpMatch.y1);
			this.autojumpMatch = undefined;
		}

		ctx.drawImage(this.collisionLayer, 0, 0);
		this.cctx.clearRect(0, 0,
			this.collisionLayer.width,
			this.collisionLayer.height);

	}

	highlightHitbox(entity, camera){
		this.cctx.beginPath();
		this.cctx.strokeStyle = "green";
		this.cctx.rect(
			entity.pos.x-camera.pos.x,
			entity.pos.y-camera.pos.y, 
			entity.spritesheet.width,
			entity.spritesheet.height);
		this.cctx.stroke();
		this.cctx.closePath();

		this.cctx.beginPath();
		this.cctx.strokeStyle = "blue";
		this.cctx.rect(
			entity.pos.x-camera.pos.x + entity.offset.left,
			entity.pos.y-camera.pos.y+entity.offset.top, 
			entity.spritesheet.width-entity.offsetHor,
			entity.spritesheet.height-entity.offsetVert);
		this.cctx.stroke();
		this.cctx.closePath();
	}

	highlightHitboxParticle(particle, camera){
		if(!particle.canCollide) return;
		this.cctx.beginPath();
		this.cctx.strokeStyle = "yellow";
		this.cctx.rect(
			particle.pos.x-camera.pos.x,
			particle.pos.y-camera.pos.y, 
			particle.sprite.width,
			particle.sprite.height);
		this.cctx.stroke();
		this.cctx.closePath();
	}

	checkX(entity, camera) {
		let x = 0;
		if (entity.vel.x >= 0) {
			x += entity.pos.x + entity.spritesheet.width - entity.offset.right;
		} else {
			x += entity.pos.x + entity.offset.left;
		}

		const matches = this.tiles.searchByRange(
			x, x,
			entity.pos.y + entity.offset.top, entity.pos.y
			 + entity.spritesheet.height - entity.offset.bottom);

		let bottomBlockColl = true;
		let solidMatches = 0;

		if(!entity.onGround || !entity.onMove) bottomBlockColl = false;


		matches.forEach(match => {
			if (match.tile.type != 'solid' || match.tile.type == undefined) {
				return;
			}

			if(_autojump){
				solidMatches++
				if(bottomBlockColl){
					if(_collDebug){
						this.autojumpMatch = match;
					}
					if(match.y2 < entity.pos.y + entity.spritesheet.height
							 - entity.offset.bottom ||
						match.y1 > entity.pos.y + entity.spritesheet.height
							 - entity.offset.bottom)
						bottomBlockColl = false;
					if(solidMatches > 1) bottomBlockColl = false;
				}
			}

			if(_collDebug){
				this.collisions.add(match);
			}
			
			if (entity.vel.x > 0) {
				if (entity.pos.x + entity.spritesheet.width > match.x1) {
					entity.pos.x = match.x1 - entity.spritesheet.width
					 + entity.offset.right;
					if(__collisionStops)
						entity.stopMoving();
				}
			} else if (entity.vel.x < 0) {
				if (entity.pos.x < match.x2) {
					entity.pos.x = match.x2 - entity.offset.left;
					if(__collisionStops)
						entity.stopMoving();
				}
			}
		});

		if(!entity.onGround || !_autojump) return;
		if(bottomBlockColl && solidMatches == 1){
			if(this._canJump(entity))
				entity.addVel(0, -4);
		}
	}

	_canJump(entity){
		let solidMatches = 0;
		let matchesTop = this.tiles.searchByRange(
		entity.pos.x + entity.offset.left,
		entity.pos.x + entity.spritesheet.width - entity.offset.right,
		entity.pos.y + entity.offset.top - _TILESIZE,
		entity.pos.y + entity.offset.top);

		matchesTop.forEach(match=>{
			if (match.tile.type != 'solid' || match.tile.type == undefined) {
				return;
			}
			solidMatches++;
		});
		if(solidMatches == 0) return true;
		return false;
	}

	checkY(entity, camera) {
		let y1 = 0;
		if (entity.vel.y >= 0) {
			y1 += entity.pos.y + entity.spritesheet.height - entity.offset.bottom;
		} else {
			y1 += entity.pos.y + entity.offset.top;
		}

		let y2 = y1 + entity.vel.y;

		const matches = this.tiles.searchByRange(
			entity.pos.x + entity.offset.left,
			entity.pos.x + entity.spritesheet.width - entity.offset.right,
			y1, y2);
		if(matches.length==0){
			entity.onGround = false;
			return;
		}


		matches.forEach(match => {
			// console.log(match);

			if (match.tile.type != 'solid' || match.tile.type == undefined) {
				return;
			}

			
			if(_collDebug){
				this.collisions.add(match);
			}

			if (entity.vel.y > 0) {
				if (entity.pos.y + entity.spritesheet.height 
					- entity.offset.bottom > match.y1){
					entity.land(match.y1-entity.spritesheet.height+entity.offset.bottom);
				}
			} else if (entity.vel.y < 0) {
				if (entity.pos.y < match.y2 - entity.offset.top){
					entity.pos.y = match.y2 - entity.offset.top;
					entity.vel.y = 0;
				}
			}
		});
	}


	checkXparticle(entity, camera) {
		let x = 0;
		if (entity.vel.x >= 0){
			x += entity.pos.x + entity.sprite.width;
		} else {
			x += entity.pos.x;
		}

		const matches = this.tiles.searchByRange(
			x, x,
			entity.pos.y, entity.pos.y + entity.sprite.height);

		matches.forEach(match => {

			if (match.tile.type != 'solid' || match.tile.type == undefined){
				return;
			}

			if(_collDebug){
				this.cctx.beginPath();
				this.cctx.strokeStyle = "red";
				this.cctx.rect(
					match.x1-camera.pos.x,
					match.y1-camera.pos.y,
					match.x2-match.x1,
					match.y2-match.y1);
				this.cctx.stroke();
				this.cctx.closePath();
			}
			
			if (entity.vel.x > 0) {
				if (entity.pos.x + entity.sprite.width > match.x1){
					entity.pos.x = match.x1 - entity.sprite.width;
					entity.vel.x = 0;
				}
			} else if (entity.vel.x < 0){
				if (entity.pos.x < match.x2) {
					entity.pos.x = match.x2;
					entity.vel.x = 0;
				}
			}
		});
	}

	checkYparticle(entity, camera) {
		let y = 0;
		if (entity.vel.y >= 0) {
			y += entity.pos.y + entity.sprite.height;
		} else {
			y += entity.pos.y;
		}

		const matches = this.tiles.searchByRange(
			entity.pos.x, entity.pos.x + entity.sprite.width,
			y, y);
		if(matches.length==0){
			entity.onGround = false;
			// return;
		}

		matches.forEach(match => {
			// console.log(match);

			if (match.tile.type != 'solid' || match.tile.type == undefined) {
				return;
			}

			
			if(_collDebug){
				this.cctx.beginPath();
				this.cctx.strokeStyle = "red";
				this.cctx.rect(
					match.x1-camera.pos.x,
					match.y1-camera.pos.y, 
					match.x2-match.x1,
					match.y2-match.y1);
				this.cctx.stroke();
				this.cctx.closePath();
			}

			if (entity.vel.y > 0) {
				if (entity.pos.y + entity.sprite.height> match.y1) {
					entity.pos.y = match.y1-entity.sprite.height;
					entity.vel.y = 0;
					if(entity.vel.x != 0){
						if(entity.vel.x<0)
							entity.vel.x += 0.1*entity.speedDivider/16;
						else
							entity.vel.x -= 0.1*entity.speedDivider/16;
						if(Math.abs(entity.vel.x)<0.5) entity.vel.x = 0;
					}
				}
			} else if (entity.vel.y < 0) {
				if (entity.pos.y < match.y2) {
					entity.pos.y = match.y2;
					entity.vel.y = 0;
				}
			}
		});
	}
}

let canJump = () =>{}
let setupJumpCheck = collider =>{
	canJump = entity => {
		return collider._canJump(entity);
	}
}
