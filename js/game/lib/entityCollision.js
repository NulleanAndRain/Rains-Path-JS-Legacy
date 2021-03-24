let entityCollision = (subject, entities) =>{
   entities.forEach(target => {
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
			if(target.type = 'box'){
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
	});
}