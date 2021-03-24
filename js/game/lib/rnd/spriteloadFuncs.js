let loadGrassOuters = spritesheet =>{
	return new Promise(resolve=>{
		spritesheet.image.src = './img/textures/grassOuter.png';
		spritesheet.image.onload = () => {
			spritesheet.defineAtSpritesheet('grassOuter1', 0, 2, 8, 2)
			.then(spritesheet=>spritesheet.defineAtSpritesheet('grassOuter3', 2, 4, 2, 8))
			.then(spritesheet=>{
				{
					let buffer = document.createElement('canvas');
					buffer.width = buffer.heigth = _TILESIZE;
					buffer.getContext('2d')
						.drawImage(
							spritesheet.image,
							0, 0, 8, 2,
							0, 6, 8, 2
						);

					spritesheet.sprites.set('grassOuter0', buffer);
				}
				{
					let buffer = document.createElement('canvas');
					buffer.width = buffer.heigth = _TILESIZE;
					buffer.getContext('2d')
						.drawImage(
							spritesheet.image,
							0, 4, 2, 8,
							6, 0, 2, 8
						);

					spritesheet.sprites.set('grassOuter2', buffer);
				}

				resolve(spritesheet);
			});
		}
	});
}