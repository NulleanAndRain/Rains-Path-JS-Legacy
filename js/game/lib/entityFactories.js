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

		let offsR = [12, 9, 2, 9, 14];
		let offsL = [8, 6, 0, 0, 12];

		let part = new EntityPart(entity, __xOff, _yOff, spriteRight, lifetime);

		if(entity.facing == 'left')
			part.setOffset(offsL[0], 4, 2, 2);
		else
			part.setOffset(4, offsR[0], 2, 2);
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
				part.setOffset(offsL[frame], 4, 2, 2);
			} else {
				let frame = Math.floor(((part.animTime-15)/part.frameDuration)%
					part.spriteAlt.animationFrames);
				if(frame<0) frame = 0;
				part.setOffset(4, offsR[frame], 2, 2);
			}
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
}