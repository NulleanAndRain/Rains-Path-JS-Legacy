let entityCollision = (subject, entities) =>{
	if(!subject.canInteract) return;
	if(subject.lifetime) if(subject.lifetime <= 0) return
	entities.forEach(target => {
		if(target == subject) return;
		if(!target.canInteract) return;
		if(target == subject.parent) return;
		// if(target.parent) return;
		if(target.parent == subject) return;
		if( (subject.pos.x+subject.spritesheet.width-subject.offset.right)<
			(target.pos.x+target.offset.left)||
			(target.pos.x+target.spritesheet.width-target.offset.right)<
			(subject.pos.x+subject.offset.left)||
			(subject.pos.y+subject.spritesheet.height-subject.offset.bottom)<
			(target.pos.y+target.offset.top)||
			(target.pos.y+target.spritesheet.height-target.offset.bottom)<
			(subject.pos.y+subject.offset.top)) return;

/*------------------*/
//
//	text particles colors
//
//	#fff - hit enemy
//	#fc4 - crit enemy
//	#fcc - hit player
//	#f88 - crit player
//
/*------------------*/

		if(subject.type == 'weapon'){
			if(target.type == 'projectile'){
				if(target.onGround) return;
				if(target.owner == subject.parent) return;
				if(subject.pos.x < target.pos.x && target.vel.x > 0) return;
				if(subject.pos.x > target.pos.x && target.vel.x < 0) return;

				target.vel.x *= -1;
				target.vel.y *= -1;
				target.owner = subject.parent;

				return;
			}
			if(subject.damagedList.has(target)) return;
			if(target.type == 'box' || target.health > 0){
				subject.damagedList.add(target);

				let critProc = rand();

				let damage = subject.damage;
				let color = '#fff';
				if(target.type == 'player'){
					color = '#fcc';
				}

				if(critProc<0.15){
					damage *= 1.5;
					if(target.type == 'player'){
						color = '#f88';
					} else {
						color = '#fc4';
					}
				}

				let posY = subject.pos.y + subject.offset.top + (subject.spritesheet.height
					- subject.offset.top - subject.offset.bottom)/2;

				let posX = (subject.pos.x + subject.spritesheet.width - subject.offset.right 
					- target.pos.x + target.offset.left)/2 + target.pos.x;
					
				target.takeDamage(damage, color, subject.parent, posX, posY);
				return;
			}
			return;
		}

		

		if(subject.type == 'projectile'){
			if(target.health <= 0 && target.type != 'box')return;
			if(target.type == 'weapon') return;
			if(target == subject.owner){
				if(target.type != 'player') return;
				if(!subject.onGround) return;
				if(subject.lifetime) subject.lifetime = -1;
				target.skillCooldownTimer = 1;
			} else {
				if(target.type == subject.owner.type) return;
				if(subject.onGround) return;
				if(subject.damagedList.has(target)) return;
					subject.damagedList.add(target);

				let critProc = rand();

				let damage = subject.damage;

				let color = '#fff';
				if(target.type == 'player'){
					color = '#fcc';
				}

				if(critProc<0.15){
					damage *= 1.5;
					if(target.type == 'player'){
						color = '#f88';
					} else {
						color = '#fc4';
					}
				}

				damage = parseFloat(damage.toFixed(1));

				if(subject.aftCollide) 
					subject.aftCollide()
				else 
					subject.vel.x /= 4;

				let posY = subject.pos.y + subject.offset.top + (subject.spritesheet.height
					- subject.offset.top - subject.offset.bottom)/2;

				let posX = (subject.pos.x + subject.spritesheet.width - subject.offset.right 
					- target.pos.x + target.offset.left)/2 + target.pos.x;

				if(subject.vel.x >= 0) subject.facing = 'right';
				else subject.facing = 'left';
					
				target.takeDamage(damage, color, subject, posX, posY);
			}
			return;
		}



		if(subject.type == 'enemy'){
			if(subject.attackCooldownTimer != 0) return;
			if(!subject.hostile && target.type == 'player') return;
			if(target.type == 'weapon') return;
			if(target.type == subject.type) return;
			if(target.health <= 0) return;

			subject.attackCooldownTimer = subject.attackCooldown;

			let critProc = rand();

			let damage = subject.damage;
			let color = '#fff';
			if(target.type == 'player'){
				color = '#fcc';
			}

			if(critProc<0.15){
				damage *= 1.5;
				if(target.type == 'player'){
					color = '#f88';
				} else {
					color = '#fc4';
				}
			}

			let posY = subject.pos.y + subject.offset.top + (subject.spritesheet.height
				- subject.offset.top - subject.offset.bottom)/2;

			let posX = (subject.pos.x + subject.spritesheet.width - subject.offset.right 
				- target.pos.x + target.offset.left)/2 + target.pos.x;
				
			target.takeDamage(damage, color, subject, posX, posY);
		}
	});
}