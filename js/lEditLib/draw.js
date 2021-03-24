let draw = function(){
	let front = document.createElement('canvas');
	front.width = _buffer.width;
	front.height = _buffer.height;
	let frontctx = front.getContext('2d');

	let back = document.createElement('canvas');
	back.width = _buffer.width;
	back.height = _buffer.height;
	let backctx = back.getContext('2d');

	let bg = document.createElement('canvas');
	bg.width = _buffer.width/2;
	bg.height = _buffer.height/2;
	let bgctx = bg.getContext('2d');

	return function redraw (levelFront, levelBack, levelBG, ctx, camctx, camera){
		clearScreens();

		_bctx.clearRect(0, 0, _buffer.width, _buffer.height);

		frontctx.clearRect(0, 0, _buffer.width, _buffer.height);
		backctx.clearRect(0, 0, _buffer.width, _buffer.height);
		bgctx.clearRect(0, 0, _buffer.width/2, _buffer.height/2);


		front.width  = _buffer.width;
		front.height = _buffer.height;

		back.width  = _buffer.width;
		back.height = _buffer.height;

		bg.width  = _buffer.width/2  + _CHUNKPIXELS*2;
		bg.height = _buffer.height/2 + _CHUNKPIXELS*2;

		camera.update();

		levelFront	.draw(frontctx,	camera);
		levelBack	.draw(backctx, 	camera);
		levelBG		.draw(bgctx, 	camera.subcamera);

		levelFront.drawPlayerDot(frontctx, camera);

		camctx.filter = 'brightness(120%) blur(3px)';
		camctx.drawImage(
			bg, 
			-camera.subcamera.pos.x % (_CHUNKPIXELS*2) - (camera.subcamera.deposX),
			-camera.subcamera.pos.y % (_CHUNKPIXELS*2) - (camera.subcamera.deposY),
			_buffer.width  + _CHUNKPIXELS*4,
			_buffer.height + _CHUNKPIXELS*4);

		camctx.filter = 'brightness(75%)';
		camctx.drawImage(
			back,
			-camera.pos.x % _CHUNKPIXELS - (camera.deposX),
			-camera.pos.y % _CHUNKPIXELS - (camera.deposY));

		camctx.filter = 'none';
		camctx.drawImage(
			front,
			-camera.pos.x % _CHUNKPIXELS - (camera.deposX),
			-camera.pos.y % _CHUNKPIXELS - (camera.deposY));


		if(__drawLayer == 'front'){
			ctx.filter = 'brightness(75%)';
			ctx.drawImage(
				bg, 0, 0,
				_buffer.width  + _CHUNKPIXELS*4,
				_buffer.height + _CHUNKPIXELS*4);
			ctx.filter = 'brightness(50%)';
			ctx.drawImage(
				back, 0, 0);
			ctx. filter = 'none';
			ctx.drawImage(
				front, 0, 0);
		}

		if(__drawLayer == 'back'){
			ctx.filter = 'brightness(75%)';
			ctx.drawImage(
				bg, 0, 0,
				_buffer.width  + _CHUNKPIXELS*4,
				_buffer.height + _CHUNKPIXELS*4);
			ctx.filter = 'brightness(50%)';
			ctx.drawImage(
				front, 0, 0);
			ctx. filter = 'none';
			ctx.drawImage(
				back, 0, 0);
		}

		if(__drawLayer == 'bg'){
			ctx.filter = 'brightness(50%)';
			ctx.drawImage(
				front, 0, 0);
			ctx. filter = 'brightness(75%)';
			ctx.drawImage(
				back, 0, 0);

			ctx.filter = 'none';
			ctx.drawImage(
				bg, 0, 0,
				_buffer.width  + _CHUNKPIXELS*4,
				_buffer.height + _CHUNKPIXELS*4);
		}
		
		levelFront.drawFrames(ctx, camera);

		window.requestAnimationFrame(()=>{
			redraw(levelFront, levelBack, levelBG, ctx, camctx, camera);
		});
	}
}()