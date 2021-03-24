let createEntityPart = () =>{}
let createRainsWeapon = () =>{}

let setupEntityFactories = level =>{
	createEntityPart = (entity, x=0, y=0, sprite={spriteName: 'noSprite', animationFrames: 1}, lifetime=-1) =>{
		let part = new EntityPart(entity, x, y, sprite, lifetime);
		level.entities.add(part);
		return part;
	}

	createRainsWeapon = (entity, spriteRight={spriteName: 'noSprite', animationFrames: 1}, spriteLeft={spriteName: 'noSprite', animationFrames: 1}, lifetime=-1) =>{
		let _xOff = 8;
		let _yOff = 7;

		let __xOff = _xOff;
		if(entity.facing == 'left')
			__xOff *= -1;

		let offsFar = [12, 7, 2, 7, 12];

		let part = new EntityPart(entity, __xOff, _yOff, spriteRight, lifetime);

		if(entity.facing == 'left')
			part.setOffset(offsFar[0], 4, 2, 2);
		else
			part.setOffset(4, offsFar[0], 2, 2);
		part.animTime = 0;

		part.type = 'weapon';
		part.damage = 10;
		part.damagedList = new Set();

		part.spriteAlt = spriteLeft;
		// console.log(spriteLeft.spriteName);

		part.update = (deltaTime, tileCollider, camera, gravity) => {
			part.veliocityTick(deltaTime, tileCollider, camera, gravity);
			part.animTime+=deltaTime;
			if(part.lifetime){
				part.lifetime -= deltaTime;
			}

			if(entity.facing == 'left'){
				let frame = Math.floor(((part.animTime-15)/part.frameDuration)%
					part.spriteAlt.animationFrames);
				if(frame<0) frame = 0;
				part.setOffset(offsFar[frame], 4, 2, 2);
			} else {
				let frame = Math.floor(((part.animTime-15)/part.frameDuration)%
					part.spriteAlt.animationFrames);
				if(frame<0) frame = 0;
				part.setOffset(4, offsFar[frame], 2, 2);
			}
		}

		part.updateSprite = () =>{
			if(part.parent.facing == 'right'){
				part.pos.x = part.parent.pos.x+_xOff;
				part.relPos.x = _xOff;


				if(part.sprite.animationFrames == 1){
					part.state = `part${part.sprite.spriteName}`;
				} else {
					part.setAnimFrame(part.sprite.spriteName, part.sprite.animationFrames);
				}
			}
			if(part.parent.facing == 'left'){
				part.pos.x = part.parent.pos.x-_xOff;
				part.relPos.x = -_xOff;
				if(part.spriteAlt.animationFrames == 1){
					part.state = `part${part.spriteAlt.spriteName}`;
				} else {
					part.setAnimFrame(part.spriteAlt.spriteName, part.spriteAlt.animationFrames);
				}
			}
		}


		level.entities.add(part);
		return part;
	}
}