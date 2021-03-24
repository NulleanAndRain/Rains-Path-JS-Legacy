let creategrassOuter = (spritesheet, name, horCount, vertCount) =>{
	spritesheet.spriteFunctions.set(`grass0`, 
		(camera, posx, posy, ctx=_ctx, extension = 1)=>{
			spritesheet.draw('grassOuter0',
				posx-2,
				posy-2,
				ctx, extension);
		}); 
	spritesheet.spriteFunctions.set(`grass1`, 
		(camera, posx, posy, ctx=_ctx, extension = 1)=>{
			spritesheet.draw('grassOuter4',
				posx,
				posy-2,
				ctx, extension);
		});
	spritesheet.spriteFunctions.set(`grass2`, 
		(camera, posx, posy, ctx=_ctx, extension = 1)=>{
			spritesheet.draw('grassOuter1',
				posx,
				posy-2,
				ctx, extension);
		});
	spritesheet.spriteFunctions.set(`grass5`, 
		(camera, posx, posy, ctx=_ctx, extension = 1)=>{
			spritesheet.draw('grassOuter5',
				posx-2,
				posy,
				ctx, extension);
		});
	spritesheet.spriteFunctions.set(`grass7`, 
		(camera, posx, posy, ctx=_ctx, extension = 1)=>{
			spritesheet.draw('grassOuter6',
				posx+8,
				posy,
				ctx, extension);
		});
	spritesheet.spriteFunctions.set(`grass10`, 
		(camera, posx, posy, ctx=_ctx, extension = 1)=>{
			spritesheet.draw('grassOuter2',
				posx-2,
				posy,
				ctx, extension);
		});
	spritesheet.spriteFunctions.set(`grass11`, 
		(camera, posx, posy, ctx=_ctx, extension = 1)=>{
				spritesheet.draw('grassOuter7',
				posx,
				posy+8,
				ctx, extension);
		});
	spritesheet.spriteFunctions.set(`grass12`,  
		(camera, posx, posy, ctx=_ctx, extension = 1)=>{
				spritesheet.draw('grassOuter3',
				posx,
				posy,
				ctx, extension);
		});
	spritesheet.spriteFunctions.set(`grass13`,  
		(camera, posx, posy, ctx=_ctx, extension = 1)=>{
			spritesheet.draw('grassOuter4',
				posx,
				posy-2,
				ctx, extension);
		});
	spritesheet.spriteFunctions.set(`dirtToStone13`, 
		(camera, posx, posy, ctx=_ctx, extension = 1)=>{
			spritesheet.draw('grassOuter4',
				posx,
				posy-2,
				ctx, extension);
		});
	spritesheet.spriteFunctions.set(`dirtToStone14`, 
		(camera, posx, posy, ctx=_ctx, extension = 1)=>{
			spritesheet.draw('grassOuter4',
				posx,
				posy-2,
				ctx, extension);
		});
	spritesheet.spriteFunctions.set(`grassCorner4`, 
		(camera, posx, posy, ctx=_ctx, extension = 1)=>{
			spritesheet.drawSpritePart('grassOuter5',
				posx-2,
				posy,
				2, 6, 0, 0,
				ctx, extension);
		});
	spritesheet.spriteFunctions.set(`grassCorner5`, 
		(camera, posx, posy, ctx=_ctx, extension = 1)=>{
			spritesheet.drawSpritePart('grassOuter6',
				posx+8,
				posy,
				2, 6, 0, 0,
				ctx, extension);
		});
}

let createCampfireParticles = (spritesheet, name, horCount, vertCount) =>{
	for(let i=0; i<vertCount; i++){
		for(let j=0; j<horCount; j++){
			if((i*horCount+j)%2 == 0){
				spritesheet.spriteFunctions.set(`${name}${(i*horCount+j)}`, 
					(camera, posx, posy, ctx=_ctx, extension = 1)=>{
					let time = new Date().getTime();
					if(time%500>5) return;
					if(fastRand()<0.2){
						createCampfireSmoke(posx+8+camera.pos.x, posy+4+camera.pos.y);
					}
				});
			} 
			if((i*horCount+j)%2 == 1){
				spritesheet.spriteFunctions.set(`${name}${(i*horCount+j)}`, 
					(camera, posx, posy, ctx=_ctx, extension = 1)=>{
					let time = new Date().getTime();
					if(time%500>5) return;
					if(fastRand()<0.2){
						createCampfireSmoke(posx+camera.pos.x, posy+4+camera.pos.y);
					}
				});
			}
		}
	}
}