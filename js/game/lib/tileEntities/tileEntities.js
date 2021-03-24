class CampfireTile extends TileEntity{
	constructor(spritesheet, tilePosX=0, tilePosY=0){
		super(spritesheet, tilePosX, tilePosY);
		this.offset.top = 16;
		this.canCollide = false;
		this.affectedByGravity = false;
		this.type = _s_campfire;
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

class Treasure extends TileEntity{
	constructor(spritesheet, value, tilePosX=0, tilePosY=0){
		super(spritesheet, tilePosX, tilePosY);
		this.score = value;
		this.type = _s_treasure;
		this.canInteract = true;
		this.canCollide = false;
		this.affectedByGravity = false;
	}
}

class CrystalSmall extends Treasure{
	constructor(spritesheet, tilePosX=0, tilePosY=0){
		super(spritesheet, 50, tilePosX, tilePosY);
		this.state = `crystalSmall`;
	}
}

class CrystalBig extends Treasure{
	constructor(spritesheet, tilePosX=0, tilePosY=0){  //tbd later
		super(spritesheet, 100, tilePosX, tilePosY);
		this.state = `crystalBig`;
	}
}

class Coin extends Treasure{
	constructor(spritesheet, tilePosX=0, tilePosY=0){
		super(spritesheet, 25, tilePosX, tilePosY);
	}
	updateSprite(){
		let frame = Math.floor(this.animTime/150)%4;
		this.state = `coin${frame}`;
	}
}


class InfoBlock extends TileEntity{
	constructor(spritesheet, text, tilePosX=0, tilePosY=0){
		super(spritesheet, tilePosX, tilePosY);
		this.type = _s_infoblock;
		this.canInteract = true;
		this.canCollide = false;
		this.affectedByGravity = false;
		this.text = text;
	}

	updateSprite(){
		let frame = Math.floor(this.animTime/300)%2;
		this.state = `infoBlock${frame}`;
	}

	showInfo(){}
}

class LevelEndInfo extends InfoBlock{
	constructor(spritesheet, tilePosX=0, tilePosY=0){
		super(
			spritesheet,
			'This is the level end. GG',
			tilePosX,
			tilePosY);

		this.type = _s_levelend;
	}

	updateSprite(){
		let frame = Math.floor(this.animTime/600)%2;
		this.state = `infoBlock${frame}`;
	}

	showInfo(){
		createRainbowTextParticle(
			this.pos.x + 8,
			this.pos.y - 8,
			this.text,
			10000);
	}

}