let createEntityPart  = () =>{}
let createRainsWeapon = () =>{}
let createProjectile  = () =>{}
let createGuardianProjectile = () =>{}

let setupEntityFactories = level =>{
	let factories = new Map();
	createEntityPart = (entity, x=0, y=0, sprite={spriteName: 'noSprite', animationFrames: 1}, lifetime=-1) =>{
		let part = new EntityPart(entity, x, y, sprite, lifetime);
		level.entities.add(part);
		return part;
	}

	createRainsWeapon = (entity, spriteRight={spriteName: 'noSprite', animationFrames: 1}, spriteLeft={spriteName: 'noSprite', animationFrames: 1}, lifetime=-1, damage = 15) =>{
		let _xOff = 8;
		let _yOff = 7;

		let __xOff = _xOff;
		if(entity.facing == 'left')
			__xOff *= -1;

		let offsR = [12, 9, 2, 9, 14];
		let offsL = [12, 8, 0, 8, 14];

		let part = new EntityPart(entity, __xOff, _yOff, spriteRight, lifetime);

		if(entity.facing == 'left')
			part.setOffset(offsL[0], 8, 2, 2);
		else
			part.setOffset(4, offsR[0], 2, 2);
		part.animTime = 0;

		part.type = _s_weapon;
		part.damage = damage;
		part.damagedList = new Set();

		part.spriteAlt = spriteLeft;
		// console.log(spriteLeft.spriteName);

		part.update = (deltaTime, tileCollider, camera, gravity) => {
			part.velocityTick(deltaTime, tileCollider, camera, gravity);
			part.animTime+=deltaTime;
			if(part.lifetime){
				part.lifetime -= deltaTime;
			}

			if(entity.facing == 'left'){
				let frame = Math.floor(((part.animTime-15)/part.frameDuration)%
					part.spriteAlt.animationFrames);
				if(frame<0) frame = 0;
				part.setOffset(offsL[frame], 8, 2, 2);
				part.pos.x += 5;
			} else {
				let frame = Math.floor(((part.animTime-15)/part.frameDuration)%
					part.spriteAlt.animationFrames);
				if(frame<0) frame = 0;
				part.setOffset(4, offsR[frame], 2, 2);
			}

			if(part.animTime > 750) console.log(part);
		}

		part.updateSprite = () =>{
			if(part.parent.facing == 'right'){
				part.relPos.x = _xOff;
				if(part.sprite.animationFrames == 1){
					part.state = `part${part.sprite.spriteName}`;
					part.spritesheet.width = part.parent.spritesheet
						.spriteSize(`part${part.sprite.spriteName}`).width;
				} else {
					part.setAnimFrame(part.sprite.spriteName, part.sprite.animationFrames);
					part.spritesheet.width =  part.parent.spritesheet
						.spriteSize(`part${part.sprite.spriteName}0`).width;
				}
			}

			if(part.parent.facing == 'left'){
				if(part.spriteAlt.animationFrames == 1){
					part.state = `part${part.spriteAlt.spriteName}`;
					part.spritesheet.width = part.parent.spritesheet
						.spriteSize(`part${part.spriteAlt.spriteName}`).width;
				} else {
					part.setAnimFrame(part.spriteAlt.spriteName, part.spriteAlt.animationFrames);
					part.spritesheet.width = part.parent.spritesheet
						.spriteSize(`part${part.spriteAlt.spriteName}0`).width;
				}
				part.relPos.x = _xOff - part.spritesheet.width
			}
		}


		level.entities.add(part);
		return part;
	}


	createProjectile = (entity, posx, posy, lifetime, horVel, damage, sprite) =>{
		let projectile = new Projectile(
			entity,
			posx, posy,
			lifetime,
			damage,
			sprite,
			true);

		if(entity.facing == 'left')
			projectile.setVel(-horVel, -2);
		else
			projectile.setVel(horVel, -2);

		projectile.addVel(entity.vel.x, entity.vel.y);

		level.entities.add(projectile);
		return projectile;
	}

	createGuardianProjectile = (entity, lifetime, horVel, vertVel, damage, sprite) =>{
		let projectile = new Projectile(
			entity,
			entity.pos.x+12, entity.pos.y+12,
			lifetime,
			damage,
			sprite,
			false);
			
		projectile.setOffset(2, 2, 2, 2);

		projectile.blockCollideY = () =>{
			projectile.vel.x = 0;
			projectile.vel.y = 0;
			projectile.canInteract = false;
			projectile.lifetime = 1;
		}
		projectile.blockCollideX = () =>{
			projectile.vel.x = 0;
			projectile.vel.y = 0;
			projectile.canInteract = false;
			projectile.lifetime = 1;
		}

		projectile.aftCollide = () =>{
			projectile.lifetime = 1;
			projectile.canInteract = false;
		}

		projectile.gravityMultipler = 0;

		projectile.setVel(horVel, vertVel);

		level.entities.add(projectile);
		return projectile;
	}

	let createGuardian = function(){
		let GuardSprite = new SpriteSheet(24, 32);
		GuardSprite.addSprites('Guardian', 'IdleLeft', 'sprites', 4, 1)
			.then(GuardSprite=>GuardSprite
				.addSprites('Guardian', 'IdleRight', 'sprites', 4, 1))
			.then(GuardSprite=>GuardSprite
				.addSprites('Guardian', 'DeadRight', 'sprites', 4, 1))
			.then(GuardSprite=>GuardSprite
				.addSprites('Guardian', 'DeadLeft', 'sprites', 4, 1))
			.then(GuardSprite=>GuardSprite
				.addSpritePart('Guardian', 'darkMagic', 'sprites', 4, 2, 8, 8));
		return function(x=0, y=0, sx = x, sy = y) {
			let guardian = new Guardian(GuardSprite, x, y, sx, sy);
			level.entities.add(guardian);
			return guardian;
		}
	}();
	factories.set('guardian', createGuardian);

	let createBox = function() {
		let BoxSprite = new SpriteSheet(16, 16);
		BoxSprite.addSprites('Box', 'Idle', 'sprites', 1, 1);
		return function(x, y) {
			let box = new Box(BoxSprite, x, y);
			level.entities.add(box);
			return box;
		}
	}();
	factories.set('box', createBox);

	return factories;
}

