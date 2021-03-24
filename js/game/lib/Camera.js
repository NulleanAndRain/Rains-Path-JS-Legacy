class Camera {
    constructor(width=640, heigth=360) {
        this.pos = new Vect2(0, 0);
        this.size = new Vect2(width, heigth);
        this.underMap = false;
    }

    move(player, level){
		if(player.isDead){
			return;
		}
    	//x
		this.pos.x=player.pos.x+player.spritesheet.width/2-this.size.x/2;
    	if(this.pos.x<=0) this.pos.x = 0;
    	if(this.pos.x+this.size.x>=level.width()) this.pos.x = level.width()-this.size.x;
		//y
		

		
		this.pos.y = player.pos.y-this.size.y*3/5;
		if(this.pos.y+this.size.y+_TILESIZE/2>level.heightAt(player.pos.x)){
			if(player.pos.y<level.heightAt(player.pos.x)){
		 		this.pos.y = level.heightAt(player.pos.x)-this.size.y-_TILESIZE/2;
       			this.underMap = false;
			} else {
		 		this.pos.y = level.heightAt(player.pos.x)-this.size.y-_TILESIZE/2;
				this.underMap = true;
				if(player.health>0)
					player.takeDamage(
						player.maxHealth*2,
						'#f33',
						player.facingReverse,
						player.pos.x,
						player.pos.y);
			}
		}
    }
}
