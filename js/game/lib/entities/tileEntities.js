class CampfireTile extends TileEntity{
	constructor(spritesheet, tilePosX=0, tilePosY=0){
		super(spritesheet, tilePosX, tilePosY);
		this.offset.top = 16;
		this.canCollide = false;
		this.affectedByGravity = false;
	}
	updateSprite(){
		let frame = Math.floor(this.animTime/75)%8;
		this.state = `campfire${frame}`;

		if(this.animTime%150 < 3){
			if(fastRand() < 0.5){
				createCampfireSmoke(this.pos.x+8, this.pos.y+10);
			}
		}
	}
}