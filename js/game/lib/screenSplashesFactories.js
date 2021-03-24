let createFullscreenSplash = () =>{}

let setupScreenSplash = (splashes) =>{
		createFullscreenSplash = (text, color='#fff') =>{
			// console.log(screen);

		let particle = new Particle(0, 0, _respawnTime);
		particle.text = text;

		let buffer = document.createElement('canvas');
		buffer.height = canvWidth/10;
		buffer.width = particle.text.length*buffer.height*0.7;

		particle.screenWidth = canvWidth;
		particle.screenSize = canvResize;
		particle.extension = 1;

		let bctx = buffer.getContext('2d');

		bctx.font = `${buffer.height*1.5}px AtariRevue`;
		bctx.fillStyle = color;
		bctx.strokeStyle = 'rgba(0,0,0,0.6)';
		bctx.strokeText(particle.text, 2, buffer.height*0.91);
		bctx.fillText(particle.text, 1, buffer.height*0.9);
		particle.sprite = buffer;

		particle.pos.x = canvWidth/2 - buffer.width/2;
		particle.pos.y = _canvHeight/2 - buffer.height*2/3;



		particle.upd1 = false;
		particle.upd2 = false;

		particle.vel.y = 0;

		particle.draw = (context) =>{
			if(particle.screenWidth != canvWidth){
				if(canvWidth == resizeConst[canvResize]){
					bctx.clearRect(0, 0, buffer.width, buffer.height);
					buffer.height = canvWidth/10;
					buffer.width = particle.text.length*buffer.height*0.7;

					bctx.imageSmoothingEnabled=true;

					bctx.font = `${buffer.height*1.5}px AtariRevue`;
					bctx.fillStyle = color;
					bctx.strokeStyle = 'rgba(0,0,0,0.6)';
					bctx.strokeText(particle.text, 2, buffer.height*0.91);
					bctx.fillText(particle.text, 1, buffer.height*0.9);
					particle.sprite = buffer;

					particle.extension = 1;
				} else {
					particle.extension =  1+(canvWidth/10 
						- buffer.height)/buffer.height;
				}

				particle.screenWidth = canvWidth;

				particle.pos.x = canvWidth/2 - buffer.width*particle.extension/2;
				particle.pos.y = _canvHeight/2 - buffer.height*particle.extension*2/3;
			}

			let smoothing = context.imageSmoothingEnabled;

			context.imageSmoothingEnabled = true;
			context.drawImage(
				particle.sprite,
				particle.pos.x,
				particle.pos.y,
				buffer.width*particle.extension,
				buffer.height*particle.extension);
			context.imageSmoothingEnabled = smoothing;
		}
		particle.updateProxy = () =>{
			if(particle.timeLeft<150 && !particle.upd1){
				particle.upd1 = true;
				let bctx = buffer.getContext('2d');
				bctx.imageSmoothingEnabled=false;

				bctx.clearRect(0, 0, buffer.width, buffer.height);
				bctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
				bctx.fillText(particle.text, 1, buffer.height*0.9);
			}

			if(particle.timeLeft<50 && !particle.upd2){
				particle.upd2 = true;
				let bctx = buffer.getContext('2d');
				bctx.imageSmoothingEnabled=false;

				bctx.clearRect(0, 0, buffer.width, buffer.height);
				bctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
				bctx.fillText(particle.text, 1, buffer.height*0.9);
			}

			if(particle.timeLeft <= 0){
				splashes.delete(particle);
			}
		}

		splashes.add(particle);
		return particle;
	}
}