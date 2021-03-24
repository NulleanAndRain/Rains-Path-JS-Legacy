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
	}
}