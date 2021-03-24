let tileEntityCollision = (tile, entities) =>{
	if(!tile.canInteract) return;

	entities.forEach(target => {
		if(!target.canInteract) return;
		if(target.lifetime <= 0 || target.isDowned) return;
		if( (tile.pos.x+tile.spritesheet.width-tile.offset.right)<
			(target.pos.x+target.offset.left)||
			(target.pos.x+target.spritesheet.width-target.offset.right)<
			(tile.pos.x+tile.offset.left)||
			(tile.pos.y+tile.spritesheet.height-tile.offset.bottom)<
			(target.pos.y+target.offset.top)||
			(target.pos.y+target.spritesheet.height-target.offset.bottom)<
			(tile.pos.y+tile.offset.top)) return;

		if(tile.type == 'treasure'){
			if(target.type != 'player') return;
			target.AddScore(tile.score);
			tile.remove();
			return;
		}

		if(tile.type = 'levelEnd'){
			if(target.type != 'player') return;
			tile.showInfo();
			tile.remove();
			return;
		}
	});
}