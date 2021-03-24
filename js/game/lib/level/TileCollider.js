var __collisionStops = true;

class TileCollider {
	constructor(levelMap) {
		this.tiles = new TileResolver(levelMap);

		this.collisionLayer = document.createElement('canvas');
			this.collisionLayer.width = _canvas.width;
			this.collisionLayer.height = _canvas.height;
		this.cctx = this.collisionLayer.getContext('2d');

		//_collDebug
		this.collisions = new Set();
		this.inboundCollisions = new Set();
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

		this.inboundCollisions.forEach(match=>{
			this.cctx.strokeStyle = "cyan";
			this.cctx.strokeRect(
				match.x1-camera.pos.x,
				match.y1-camera.pos.y,
				match.x2-match.x1,
				match.y2-match.y1);
		});

		this.inboundCollisions.clear();

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

	checkX(entity, deltaTime = 1000/144, gravity = 1) {
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

		if(_autojump || entity.type == _s_enemy){
			var bottomBlockColl = true;
			var solidMatches = 0;
			if(!entity.onGround || !entity.onMove || entity.vel.y != 0 ) bottomBlockColl = false;
		}

		matches.forEach(match => {
			if (match.tile.type != 'solid' || match.tile.type == undefined) {
				return;
			}

			if(_autojump  || entity.type == _s_enemy){
				solidMatches++;
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

		if((entity.type == _s_projectile && solidMatches > 0) || (entity.AITick && solidMatches > 1)){
			if(entity.blockCollideX) entity.blockCollideX();
		}

		if(!entity.onGround || !(_autojump || entity.type != _s_player)) return;
		if(bottomBlockColl && solidMatches == 1){
			if(this._canJump(entity)){
				entity.addVel(0, -3);
			}
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

	checkY(entity, deltaTime = 1000/144, gravity = 1) {
		let yTop = entity.pos.y + entity.offset.top;
		let yBot = entity.pos.y + entity.spritesheet.height - entity.offset.bottom;

		let y1 = 0;
		if (entity.vel.y >= 0) {
			y1 += yBot;
		} else {
			y1 += yTop;
		}

		let x1 = entity.pos.x + entity.offset.left;
		let x2 = entity.pos.x + entity.spritesheet.width - entity.offset.right

		const matches = this.tiles.searchByRange(
			x1, x2,
			y1, y1);

		let hasSolid = false;

		matches.forEach(match => {
			if (match.tile.type != 'solid' || match.tile.type == undefined) {
				return;
			}

			hasSolid = true;

			
			if(_collDebug){
				this.collisions.add(match);
			}

			if(entity.blockCollideY) entity.blockCollideY();

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

		if(hasSolid){
			entity.onGround = true;
		} else {
			entity.onGround = false;
			let y2, y3;
			if(entity.vel.y > 0){
				y2 = y1 + _TILESIZE;
				y3 = y2 + entity.vel.y*deltaTime/16;

			} else {
				y3 = y1 - _TILESIZE;
				y2 = y3 + entity.vel.y*deltaTime/16;
			}

			const matchesNext = this.tiles.searchByRange(
				x1, x2, 
				y2, y3);

			matchesNext.forEach(match => {
				if (match.tile.type != 'solid' || match.tile.type == undefined) {
					return;
				}
				
				if (entity.vel.y > 0) {
					if(entity.type == _s_projectile){
						// entity.vel.y = gravity*deltaTime/16;
						// entity.pos.y = match.y1 - 2*gravity*deltaTime/16;
						matchesNext.length = 0;
						return;
					}
					if (entity.pos.y + entity.vel.y + entity.spritesheet.height 
						- entity.offset.bottom > match.y1){
						entity.vel.y = (match.y1 
							- entity.pos.y + entity.spritesheet.height 
							- entity.offset.bottom)/deltaTime - gravity*deltaTime/16;
						matchesNext.length = 0;
					}
				} else if (entity.vel.y < 0) {
					if(entity.type == _s_projectile) return;
					if (entity.pos.y + entity.vel.y < match.y2 - entity.offset.top){
						entity.vel.y /= 2; 
					}
				}
			});
			return;
		}


		yTop = entity.pos.y + entity.offset.top;
		yBot = entity.pos.y + entity.spritesheet.height - entity.offset.bottom;

		const matchesInbound = this.tiles.searchByRange(
			x1, x2,
			yTop, yBot-2);

		if(matchesInbound.length == 0) return;

		matchesInbound.forEach(match=>{
			if (match.tile.type != 'solid' || match.tile.type == undefined || match.tile.type == 'air'){
				return;
			}
		entity.onGround = true;

			if(_collDebug){
				this.inboundCollisions.add(match);
			}

			if(entity.vel.y >= 0){
				entity.pos.y = match.y1 - entity.spritesheet.height
				 - entity.offset.bottom;
				entity.vel.y = 0;
			} else if(entity.vel.y < 0){
				entity.pos.y = match.y2 + entity.offset.top + 4;
				entity.vel.y = 0;
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
