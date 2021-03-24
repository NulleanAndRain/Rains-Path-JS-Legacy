let drawContent = function() {
	let _renderPosY = 0;
	return (canvas, context, player = null, camera = null, splashes = []) =>{
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

		camera.resize(canvas.width, canvas.height);
		
		camera.move(player);

		camera.pos.y += _renderPosY;

		context.drawImage(_canvas,
			 0, _renderPosY,
			 _canvas.width, 
			 _canvas.height);

		splashes.forEach(splash =>{
			splash.draw(context);
		});


		window.requestAnimationFrame(()=>{
			drawContent(canvas, context, player, camera, splashes);
		});
	}
}();