let setupTileEntityFactories = level => {
	let factories = new Map();

	let createCampfire = function(){
		let spritesheet = new SpriteSheet(16, 16);
		spritesheet.addTiles('campfire', 4, 2);
		return function(TilePosX, TilePosY){
			let campfire = new CampfireTile(spritesheet, TilePosX, TilePosY);
			level.tileEntities.add(campfire);
		}
	}();
	factories.set('campfire', createCampfire);

	let createSmallCrystal = function(){
		let spritesheet = new SpriteSheet(8, 8);
		spritesheet.addTiles('crystalSmall', 1, 1);
		return function(TilePosX, TilePosY){
			let crystal = new CrystalSmall(spritesheet, TilePosX, TilePosY);
			level.tileEntities.add(crystal);
		}
	}();
	factories.set('crystalSmall', createSmallCrystal);


	let createCoin = function(){
		let spritesheet = new SpriteSheet(8, 8);
		spritesheet.addTiles('coin', 4, 1);
		return function(TilePosX, TilePosY){
			let coin = new Coin(spritesheet, TilePosX, TilePosY);
			level.tileEntities.add(coin);
		}
	}();
	factories.set('coin', createCoin);
	
	let createLevelEnd = function(){
		let spritesheet = new SpriteSheet(8, 16);
		spritesheet.addTiles('infoBlock', 2, 1);
		return function(TilePosX, TilePosY){
			let info = new LevelEndInfo(spritesheet, TilePosX, TilePosY);
			level.tileEntities.add(info);
		}
	}();
	factories.set('levelEnd', createLevelEnd);

	return factories;
}