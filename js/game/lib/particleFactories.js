let createSpriteParticle = () =>{}
let createTextParticle = () =>{}
let createRainbowTextParticle = () =>{}
let createEmptyParticle = () =>{}
let createPixelParticle = () =>{}

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

		bctx.font = "8px Minecraft rus";
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

		bctx.font = "8px Minecraft rus";
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

	createPixelParticle = (x, y, color, size=1, time=5000) =>{
		let particle = new Particle(x, y, time);
		particle.sprite = document.createElement('canvas');
		particle.sprite.width = size;
		particle.sprite.height = size;
		particle.speedDivider = 32;


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

let crateBloodSplash = (x, y, direction) =>{
	let count = Math.ceil(fastRand()*8)+6;
	// console.log(count);
	for(let i=0; i<count; i++){
		let size = Math.ceil(rand()*2);
		let colorMain = Math.ceil(fastRand()*80)+110;
		let colorOff = Math.ceil(fastRand()*16);
		let colorAlpha = Math.ceil(fastRand()*0.6)+0.4;
		let color = `rgba(${colorMain},${colorOff},${colorOff},${colorAlpha})`;

		let particle = createPixelParticle(x, y, color, size);

		let velX = rand()*2.5+1;
		// let velX = Math.random()*2.5+1;
		if(direction == 'left') velX *= -1;

		let velY = rand()*5-3;
		// let velY = Math.random()*5-3;


		particle.vel.x = velX;
		particle.vel.y = velY;
	}
}