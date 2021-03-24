let createSpriteParticle = () =>{}
let createTextParticle = () =>{}
let createGradientTextParticle = () =>{}
let createRainbowTextParticle = () =>{}
let createPixelParticle = () =>{}
let createEmptyParticle = () =>{}

let createFullscreenSplash = () =>{}

let setupParticleFactories = (level, particles) =>{
	createEmptyParticle = (x=0, y=0, time=5000) =>{
		let particle = new Particle(x, y, time);
		level.particles.add(particle);
		return particle;
	}

	createSpriteParticle = (x, y, spriteName, time=5000, updateFunc = ()=>{}) =>{
		let particle = new Particle(x, y, time);
		particle.sprite = particles.getSprite(spriteName);

		particle.updateProxy = updateFunc;

		level.particles.add(particle);

		return particle;
	}

	createTextParticle = (x, y, text, color='#fff', time=5000) =>{
		let particle = new Particle(x, y, time);

		particle.text = text;

		let buffer = document.createElement('canvas');
		buffer.width = particle.text.length*7;
		buffer.height = 12;

		let bctx = buffer.getContext('2d');
		bctx.imageSmoothingEnabled=false;

		bctx.font = `8px Minecraft rus`;
		bctx.fillStyle = color;
		bctx.strokeStyle = 'rgba(0,0,0,0.6)';
		bctx.strokeText(particle.text, 2, 9);
		bctx.fillText(particle.text, 1, 8);
		particle.sprite = buffer;


		particle.upd1 = false;
		particle.upd2 = false;


		particle.vel.y = -0.3;
		particle.updateProxy = () =>{
			if(particle.vel.y<0){
				particle.vel.y += 1/1024;
			} else if(particle.vel.y>0){
				particle.vel.y = 0;
			}

			if(particle.timeLeft<150 && !particle.upd1){
				particle.upd1 = true;
				let bctx = buffer.getContext('2d');
				bctx.imageSmoothingEnabled=false;

				bctx.clearRect(0, 0, buffer.width, buffer.height);
				bctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
				bctx.fillText(particle.text, 1, 8);
			}

			if(particle.timeLeft<50 && !particle.upd2){
				particle.upd2 = true;
				let bctx = buffer.getContext('2d');
				bctx.imageSmoothingEnabled=false;

				bctx.clearRect(0, 0, buffer.width, buffer.height);
				bctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
				bctx.fillText(particle.text, 1, 8);
			}
		}

		level.particles.add(particle);
		return particle;
	}


	createRainbowTextParticle = (x, y, text, time=5000) =>{
		let particle = new Particle(x, y, time);

		particle.text = text;

		particle.color = 0;

		let buffer = document.createElement('canvas');
		buffer.width = particle.text.length*7;
		buffer.height = 12;

		let bctx = buffer.getContext('2d');
		bctx.imageSmoothingEnabled=false;

		bctx.font = `8px Minecraft rus`;
		bctx.fillStyle = `hsl(${particle.color}, 100%, 50%)`;
		bctx.strokeStyle = 'rgba(0,0,0,0.6)';
		bctx.strokeText(particle.text, 2, 9);
		bctx.fillText(particle.text, 1, 8);
		particle.sprite = buffer;


		particle.upd1 = false;
		particle.upd2 = false;


		particle.vel.y = -0.3;
		particle.updateProxy = () =>{

			if(particle.vel.y<0){
				particle.vel.y += 1/1024;
			} else if(particle.vel.y>0){
				particle.vel.y = 0;
			}

			if(particle.timeLeft>=150){
				particle.color ++;
				if(particle.color > 255) color = 0;

				bctx.clearRect(0, 0, buffer.width, buffer.height);
				bctx.fillStyle = `hsl(${Math.floor(particle.color)}, 100%, 50%)`;
				bctx.strokeText(particle.text, 2, 9);
				bctx.fillText(particle.text, 1, 8);
			}
			if(particle.timeLeft<150 && !particle.upd1){
				particle.upd1 = true;
				let bctx = buffer.getContext('2d');
				bctx.imageSmoothingEnabled=false;

				bctx.clearRect(0, 0, buffer.width, buffer.height);
				bctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
				bctx.fillText(particle.text, 1, 8);
			}
			if(particle.timeLeft<50 && !particle.upd2){
				particle.upd2 = true;
				let bctx = buffer.getContext('2d');
				bctx.imageSmoothingEnabled=false;

				bctx.clearRect(0, 0, buffer.width, buffer.height);
				bctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
				bctx.fillText(particle.text, 1, 8);
			}
		}

		level.particles.add(particle);
		return particle;
	}


	createGradientTextParticle = (x, y, text, colorStops=[{color: '#000', pos: 0}, {color: '#fff', pos: 1}], time=5000) =>{
		let particle = new Particle(x, y, time);

		particle.text = text;

		let buffer = document.createElement('canvas'); 
		let _width= particle.text.length*6;

		let prevLetter;

		for(let letter of particle.text){
			if(letter == '.' || letter == ',') _width-=5;
			if(letter == ' ') _width-=3.3;
			if(letter == 'ы') _width+=1;
			if(letter == 'ш' || letter == 'щ'){
				_width+=1;
				if(prevLetter == 'ш' || prevLetter == 'щ'){
					_width-=0.5;
				}
			}
			prevLetter = letter;
		}

		buffer.width = _width+1;
		buffer.height = 12;

		let bctx = buffer.getContext('2d');
		bctx.imageSmoothingEnabled=false;

		let gradient = bctx.createLinearGradient(0, 0, buffer.width, 0);
		colorStops.forEach(stop=>{
			gradient.addColorStop(stop.pos, stop.color);
		});

		bctx.font = `8px Minecraft rus`;
		bctx.fillStyle = gradient;
		bctx.strokeStyle = 'rgba(0,0,0,0.6)';
		bctx.strokeText(particle.text, 2, 9);
		bctx.fillText(particle.text, 1, 8);
		particle.sprite = buffer;


		particle.upd1 = false;
		particle.upd2 = false;


		particle.vel.y = -0.3;
		particle.updateProxy = () =>{
			if(particle.vel.y<0){
				particle.vel.y += 1/1024;
			} else if(particle.vel.y>0){
				particle.vel.y = 0;
			}

			if(particle.timeLeft<150 && !particle.upd1){
				particle.upd1 = true;
				let bctx = buffer.getContext('2d');
				bctx.imageSmoothingEnabled=false;

				bctx.clearRect(0, 0, buffer.width, buffer.height);
				bctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
				bctx.fillText(particle.text, 1, 8);
			}

			if(particle.timeLeft<50 && !particle.upd2){
				particle.upd2 = true;
				let bctx = buffer.getContext('2d');
				bctx.imageSmoothingEnabled=false;

				bctx.clearRect(0, 0, buffer.width, buffer.height);
				bctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
				bctx.fillText(particle.text, 1, 8);
			}
		}

		level.particles.add(particle);
		return particle;
	}

	createPixelParticle = (x, y, color, size=1, time=5000) =>{
		let particle = new Particle(x, y, time);
		particle.sprite = document.createElement('canvas');
		particle.sprite.width = size;
		particle.sprite.height = size;
		particle.speedDivider = 32;

		particle.canCollide = true;


		particle.veliocityTick = (deltaTime, tileCollider, gravity, camera) =>{
			particle.addVel(0, gravity*deltaTime/30);

			particle.pos.y+=(particle.vel.y*deltaTime/particle.speedDivider);
			tileCollider.checkYparticle(particle, camera);

			particle.pos.x+=(particle.vel.x*deltaTime/particle.speedDivider);
			tileCollider.checkXparticle(particle, camera);
		}

		let ctx = particle.sprite.getContext('2d');
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, size, size);

		level.particles.add(particle);
		return particle;
	}

	createPixelParticleNoGrav = (x, y, color, size=1, time=5000) =>{
		let particle = new Particle(x, y, time);
		particle.sprite = document.createElement('canvas');
		particle.sprite.width = size;
		particle.sprite.height = size;
		particle.speedDivider = 32;

		particle.veliocityTick = (deltaTime, tileCollider, camera) =>{
			particle.pos.y+=(particle.vel.y*deltaTime/particle.speedDivider);
			if(particle.canCollide)tileCollider.checkYparticle(particle, camera);

			particle.pos.x+=(particle.vel.x*deltaTime/particle.speedDivider);
			if(particle.canCollide)tileCollider.checkXparticle(particle, camera);
		}

		let ctx = particle.sprite.getContext('2d');
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, size, size);

		level.particles.add(particle);
		return particle;
	}
}

let createBizarreParticle = (x, y, entity={vel: {x:0, y:0}}) =>{
	let particleTime = 5000;
	let particle = createSpriteParticle(x, y, 'bizarre', particleTime, deltaTime =>{
		particle.pos.x += entity.vel.x*deltaTime/16;
		particle.pos.y += entity.vel.y*deltaTime/16;

		if(particle.timeBuffer >= 300){
			particle.timeBuffer = 0;
			particle.rotation = Math.random()*0.5 - 0.25;
			let rotMultipler = fastSin(particle.rotation);

			bctx.clearRect(0, 0, 12, 12);

			bctx.setTransform(1, 0, 0, 1, 6*rotMultipler, -6*rotMultipler);
			bctx.rotate(particle.rotation);
			bctx.drawImage(particle.sprite, 2, 2);
		}
	});
	particle.rotation = 0;

			particle.buffer = document.createElement('canvas');
			particle.buffer.width=12;
			particle.buffer.height=12;
			let bctx = particle.buffer.getContext('2d');

			bctx.drawImage(particle.sprite, 2, 2);

	particle.draw = (camera, ctx=_ctx) => {
		ctx.imageSmoothingEnabled=false;
		ctx.drawImage(
			particle.buffer,
			(particle.pos.x - camera.pos.x),
			(particle.pos.y - camera.pos.y));
		ctx.imageSmoothingEnabled=_smoothing;
	}

	return particle;
}

let createBloodSplash = (x, y, direction) =>{
	let count = Math.ceil(fastRand()*8)+6;
	// console.log(count);
	for(let i=0; i<count; i++){
		let size = Math.ceil(fastRand()*2);
		let colorMain = Math.ceil(fastRand()*80)+110;
		let colorOff = Math.ceil(fastRand()*16);
		let colorAlpha = Math.ceil(fastRand()*0.6)+0.4;
		let color = `rgba(${colorMain},${colorOff},${colorOff},${colorAlpha})`;

		let particle = createPixelParticle(x, y, color, size);

		let velX = rand()*2.5+1;
		if(direction == 'left') velX *= -1;

		let velY = rand()*5-3;


		particle.vel.x = velX;
		particle.vel.y = velY;
	}
}


let createSmoke = (x, y) =>{
	let count = Math.ceil(fastRand()*3)+2;
	for(let i=0; i<count; i++){
		let size = Math.ceil(fastRand()*2);
		let colorTone = fastRand()*160;
		let colorAlpha = Math.ceil(fastRand()*0.6)+0.4;
		let color = `rgba(${colorTone},${colorTone},${colorTone},${colorAlpha})`;

		let xOff = rand()*6-3;
		let yOff = rand()*4-2;

		let particle = createPixelParticleNoGrav(x+xOff, y+yOff, color, size);

		particle.canCollide = true;

		let velY = -rand()*0.1-0.1;
		particle.vel.y = velY;
	}
}

let createCampfireSmoke = (x, y) =>{
	let count = Math.ceil(fastRand()*5)+2;
	for(let i=0; i<count; i++){
		let size = Math.ceil(fastRand()*2);
		let colorTone = rand()*120+40;
		let colorAlpha = Math.ceil(fastRand()*0.6)+0.4;
		let color = `rgba(${colorTone},${colorTone},${colorTone},${colorAlpha})`;

		let xOff = rand()*12-6;
		let yOff = rand()*4-2;

		let particle = createPixelParticleNoGrav(x+xOff, y+yOff, color, size, 4000+2000*colorAlpha);

		particle.drawFirst = true;

		particle.canCollide = true;

		let velY = -rand()*1-1;
		velY/=10;
		particle.vel.y = velY;
	}
}

let setupScreenSplash = (player, camera, level) =>{
		createFullscreenSplash = (text, color='#fff', time=5000) =>{
		let particle = new Particle(0, 0, time);
		particle.text = text;

		let buffer = document.createElement('canvas');
		buffer.height = canvWidth/10;
		buffer.width = particle.text.length*buffer.height*0.7;

		particle.screenWidth = canvWidth;

		let bctx = buffer.getContext('2d');

		bctx.font = `${buffer.height*1.5}px AtariRevue`;
		bctx.fillStyle = color;
		bctx.strokeStyle = 'rgba(0,0,0,0.6)';
		bctx.strokeText(particle.text, 2, buffer.height*0.9+1);
		bctx.fillText(particle.text, 1, buffer.height*0.9);
		particle.sprite = buffer;


		particle.upd1 = false;
		particle.upd2 = false;

		particle.vel.y = 0;

		particle.draw = (camera, ctx=_ctx) =>{
			if(particle.screenWidth != canvWidth){
				bctx.clearRect(0, 0, buffer.width, buffer.height);
				buffer.height = canvWidth/10;
				buffer.width = particle.text.length*buffer.height*0.7;

				bctx.imageSmoothingEnabled=true;

				bctx.font = `${buffer.height*1.5}px AtariRevue`;
				bctx.fillStyle = color;
				bctx.strokeStyle = 'rgba(0,0,0,0.6)';
				bctx.strokeText(particle.text, 2, buffer.height*0.9+1);
				bctx.fillText(particle.text, 1, buffer.height*0.9);
				particle.sprite = buffer;

				particle.screenWidth = canvWidth;
			}

			ctx.imageSmoothingEnabled=true;
			ctx.drawImage(
				particle.sprite,
				(particle.pos.x - camera.pos.x),
				(particle.pos.y - camera.pos.y));
			ctx.imageSmoothingEnabled=_smoothing;
		}
		particle.updateProxy = () =>{
			particle.pos.x = canvWidth/2 + camera.pos.x - camera.xOffset - buffer.width/2;
			particle.pos.y = _canvHeight/2 + camera.pos.y - camera.yOffset - buffer.height*2/3;

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
		}

		level.particles.add(particle);
		return particle;
	}
}