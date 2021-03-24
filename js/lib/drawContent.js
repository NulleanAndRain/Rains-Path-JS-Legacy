let drawContent = function() {
	let _renderPosX = 0;
	let _renderPosY = 0;
	return (canvas, context, player = null, camera = null, splashes = []) =>{
		if(player) if(player.isDowned){
			context.drawImage(_canvas, 
				 0,
				 _renderPosY, 
				 _canvas.width, 
				 _canvas.height);

			splashes.forEach(splash =>{
				splash.draw(context);
			})
			
			window.requestAnimationFrame(()=>{
				drawContent(canvas, context, player, camera, splashes);
			});
			return;
		}

		_renderPosX = 0;
		_renderPosY = (canvas.height-_canvas.height);
		
		context.imageSmoothingEnabled = _smoothing;	

		if(!player){
			context.drawImage(_canvas, 
				 0, 0, 
				 _canvas.width, 
				 _canvas.height);
			window.requestAnimationFrame(()=>{
				drawContent(canvas, context);
			});

			return;
		}

		if(canvas.width==_canvas.width) _renderPosX=0;
		else {
			if(camera.pos.x==0 && player.pos.x<_canvas.width/2+_TILESIZE){
				_renderPosX = Math.round( -(player.pos.x-canvas.width/2)-_TILESIZE);
			} else if(player.pos.x>camera.pos.x+_canvas.width/2-_TILESIZE){
				_renderPosX = Math.round(camera.pos.x-(player.pos.x-canvas.width/2)-_TILESIZE);
			} else {
				_renderPosX =  Math.round(-(_canvas.width-canvas.width)/2);
			}
		}

		if(player.pos.x<canvas.width/2-_TILESIZE||_renderPosX>0){
			_renderPosX=0;
		}
		else if(player.pos.x>(camera.pos.x+camera.size.x-canvas.width/2)-8){
			_renderPosX=-Math.round(_canvas.width-canvas.width);
		}


		context.drawImage(_canvas, 
			 // _renderPosX, _renderPosY, 
			 0, _renderPosY,
			 _canvas.width, 
			 _canvas.height);

		splashes.forEach(splash =>{
			splash.draw(context);
		});
		
		camera.offset.x = _renderPosX;
		camera.offset.y = _renderPosY;

		camera.size.x = canvas.width;
		camera.size.y = canvas.height;

		camera.move(player);

		window.requestAnimationFrame(()=>{
			drawContent(canvas, context, player, camera, splashes);
		});
	}
}();