class Camera {
	constructor(width=640, heigth=360) {
		this.pos = new Vect2(0, 0);
		this.size = new Vect2(width, heigth);

		this.offset = new Vect2(0, 0);
	}

	getLevel(){}

	move(player){
		if(player.isDowned){
			return;
		}

		let level = this.getLevel();
		//x
		this.pos.x=player.pos.x+player.spritesheet.width/2-this.size.x/2;
		if(this.pos.x<=0) this.pos.x = 0;
		if(this.pos.x+this.size.x>=level.width()) this.pos.x = level.width()-this.size.x;
		
		//y
		this.pos.y = player.pos.y-this.size.y*3/5;
		if(this.pos.y+this.size.y+_TILESIZE/2>level.heightAt(player.pos.x)){
			let playerPosLevelHeigth = level.heightAt(player.pos.x+8)
			if(player.pos.y<playerPosLevelHeigth){
				this.pos.y = playerPosLevelHeigth-this.size.y-_TILESIZE/2;
			} else {
				this.pos.y = playerPosLevelHeigth-this.size.y-_TILESIZE/2;
				if(player.health>0)
					player.takeDamage(
						player.maxHealth*2,
						'#f33',
						player.facing,
						player.pos.x+8,
						player.pos.y+12);
			}
		}
		// this.pos.x ;
		this.pos.y += this.offset.y;
	}
}
