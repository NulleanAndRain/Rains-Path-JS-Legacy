let entityCollision = (subject, entities) =>{
	if(!subject.canInteract) return;
   entities.forEach(target => {
		if(!target.canInteract) return;
		if(target == subject) return;
		if(target == subject.parent) return;
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
			if(subject.damagedList.has(target)) return;
			if(target.type = 'box' || target.health > 0){
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
					
				target.takeDamage(damage, color, subject.parent.facing, posX, posY);
			}
		}

		if(subject.type == 'projectile'){
			if(target.health < 0 && target.type != 'box')return;
			if(target == subject.owner){
				if(!subject.onGround || subject.collected) return;
				// createGradientTextParticle(
				// 	subject.pos.x+8, 
				// 	subject.pos.y-12,
				// 	`${subject}`,
				// 	blue_gradient);
				if(subject.lifetime) subject.lifetime = -1;
				subject.collected = true;
			} else {
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

					damage =parseFloat(damage.toFixed(1));

					subject.vel.x /= 4;

					let posY = subject.pos.y + subject.offset.top + (subject.spritesheet.height
						- subject.offset.top - subject.offset.bottom)/2;

					let posX = (subject.pos.x + subject.spritesheet.width - subject.offset.right 
						- target.pos.x + target.offset.left)/2 + target.pos.x;
						
					target.takeDamage(damage, color, subject.facing, posX, posY);
				// }
			}
		}
	});
}