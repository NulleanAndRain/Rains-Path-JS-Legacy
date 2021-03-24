// let createCampfire = () =>{}

let setupTileEntityFactories = level => {
	let factories = new Map();

	let createCampfire = function(){
		let spritesheet = new SpriteSheet(16, 16);
		spritesheet.addBigSprites('campfire', 'textures/campfire.png', 16, 16, 4, 2);
		return function(TilePosX, TilePosY){
			let campfire = new CampfireTile(spritesheet, TilePosX, TilePosY);
			level.tileEntities.add(campfire);
			// return campfire;
		}
	}();
	factories.set('campfire', createCampfire);

	return factories;
}