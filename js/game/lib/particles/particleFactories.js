let createSpriteParticle = () =>{}
let createTextParticle = () =>{}
let createGradientTextParticle = () =>{}
let createRainbowTextParticle = () =>{}
let createPixelParticle = () =>{}
let createEmptyParticle = () =>{}


let setupParticleFactories = (level, particles) =>{
	createEmptyParticle = (x=0, y=0, time=5000) =>{
		let particle = new Particle(x, y, time);
		level.particles.add(particle);
		return particle;
	}

	createSpriteParticle = (x, y, spriteName, time=5000, updateFunc = ()=>{}) =>{
		let particle = new Particle(x, y, time);
		particle.sprite = particles.getSprite(spriteName);
		if(!particle.sprite) particle.sprite = particles.getSprite('noTexture');

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

		buffer.width = _width+3;
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


		particle.velocityTick = (deltaTime, tileCollider, gravity, camera) =>{
			particle.addVel(0, gravity*deltaTime/32);

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

		particle.velocityTick = (deltaTime, tileCollider, gravity, camera) =>{
			particle.pos.y+=(particle.vel.y*deltaTime/particle.speedDivider);
			if(particle.canCollide) tileCollider.checkYparticle(particle, camera);

			particle.pos.x+=(particle.vel.x*deltaTime/particle.speedDivider);
			if(particle.canCollide) tileCollider.checkXparticle(particle, camera);
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
			// let rotMultipler = fastSin(particle.rotation);

			bctx.clearRect(0, 0, 12, 12);

			bctx.setTransform(1, 0, 0, 1, 6*particle.rotation, -6*particle.rotation);
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
		ctx.drawImage(
			particle.buffer,
			(particle.pos.x - camera.pos.x),
			(particle.pos.y - camera.pos.y));
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
		let colorAlpha = fastRand()*0.6 + 0.4;
		let color = `rgba(${colorMain},${colorOff},${colorOff},${colorAlpha})`;

		let particle = createPixelParticle(x, y, color, size, 4000 + 2000*colorAlpha);

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
		let colorAlpha = fastRand()*0.6 + 0.4;
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
		let colorAlpha = fastRand()*0.6 + 0.4;
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

let createGuardianMist = entity =>{
	let count = Math.ceil(fastRand()*3)+3;
	for(let i=0; i<count; i++){
		let size = Math.ceil(fastRand()*2);
		let colorTone = rand()*30+10;
		let colorAlpha = fastRand()*0.5 + 0.5;
		let color = `rgba(${colorTone},${colorTone*0.9},${colorTone*1.2},${colorAlpha})`;

		let xOff = 7 + rand()*10;
		let yOff = 26 + fastRand()*4;

		let particle = createPixelParticleNoGrav(
			entity.pos.x + xOff, 
			entity.pos.y + yOff,
			color,
			size,
			1000*colorAlpha);

		particle.canCollide = true;
		particle.drawFirst = true;

		particle.locPos = {x: xOff, y: yOff};

		particle.updateProxy = deltaTime =>{
			particle.locPos.x += particle.vel.x*deltaTime/16;
			particle.locPos.y += particle.vel.y*deltaTime/16;
			particle.pos.x = entity.pos.x + particle.locPos.x;
			particle.pos.y = entity.pos.y + particle.locPos.y;
		}

		let velY = rand()*0.05 - 0.02;
		particle.vel.y = velY;

		let velX = rand()*0.2 - 0.1;
		particle.vel.x = velX;
	}
}

let createGuardArmorSplash = (x, y, direction) =>{
	let count = Math.ceil(fastRand()*8)+6;
	// console.log(count);
	for(let i=0; i<count; i++){
		let size = Math.ceil(fastRand()*2);
		let colorTone = rand()*60+30;
		let colorAlpha = fastRand()*0.5 + 0.5;
		let color = `rgba(${colorTone},${colorTone*0.9},${colorTone*1.2},${colorAlpha})`;

		let particle = createPixelParticle(x, y, color, size, 4000 + 2000*colorAlpha);

		let velX = rand()*2.5+1;
		if(direction == 'left') velX *= -1;

		let velY = rand()*5-3;


		particle.vel.x = velX;
		particle.vel.y = velY;
	}
}

let createGuardianDeathMist = (entity, posY) =>{
		let size = Math.ceil(fastRand()*2);
		let colorTone = rand()*30+10;
		let colorAlpha = fastRand()*0.5 + 0.2;
		let color = `rgba(${colorTone},${colorTone*0.9},${colorTone*1.2},${colorAlpha})`;

		let xOff = 10 + rand()*6;
		let yOff = posY + fastRand()*4;

		let particle = createPixelParticleNoGrav(
			entity.pos.x + xOff, 
			entity.pos.y + yOff,
			color,
			size,
			1000*colorAlpha);

		particle.canCollide = true;
		particle.drawFirst = true;

		let velY = -rand()*0.2 - 0.1;
		particle.vel.y = velY;

		let velX = rand()*0.2 - 0.1;
		particle.vel.x = velX;
}