var camSpeed = _TILESIZE;

let setCvsDrawing = (canvas, levelFront, levelBack, levelBG, camera) =>{
	var rect = canvas.getBoundingClientRect();

	const drawRadius = document.getElementById('drawRadius');

	var __draw = (e, id) =>{
		let rad = parseInt(drawRadius.value);
		if(__drawLayer != 'bg'){
			let posx = Math.floor((e.clientX - rect.left)/(_TILESIZE*2))
				+ camera.drawFromX*_CHUNKSIZE;
			let posy = Math.floor((e.clientY - rect.top )/(_TILESIZE*2))
				+ camera.drawFromY*_CHUNKSIZE;

			if(__drawLayer == 'front'){
				for(let dy = posy-rad; dy <= posy+rad; dy++){
					for(let dx = posx-rad; dx <= posx+rad; dx++){
						levelFront.updateChunk(dx, dy, (x, y, chunk)=>{
							chunk.grid[y][x] = id;
						});
					}
				}
			}
			if(__drawLayer == 'back'){
				for(let dy = posy-rad; dy <= posy+rad; dy++){
					for(let dx = posx-rad; dx <= posx+rad; dx++){
						levelBack.updateChunk(dx, dy, (x, y, chunk)=>{
							chunk.grid[y][x] = id;
						});
					}
				}
			}
		} else {
			let posx = Math.floor((e.clientX - rect.left)/(_TILESIZE*4))
				+ camera.subcamera.drawFromX*_CHUNKSIZE;
			let posy = Math.floor((e.clientY - rect.top )/(_TILESIZE*4))
				+ camera.subcamera.drawFromY*_CHUNKSIZE;
			for(let dy = posy-rad; dy <= posy+rad; dy++){
				for(let dx = posx-rad; dx <= posx+rad; dx++){
					levelBG.updateChunk(dx, dy, (x, y, chunk)=>{
						chunk.grid[y][x] = id;
					});
				}
			}
		}
	}

	canvas.onmousedown = e =>{
		if(e.which == 1){
			__draw(e, currID);
			canvas.onmousemove = e =>{
				__draw(e, currID);

				if(e.clientX < rect.left||
					e.clientX > rect.right||
					e.clientY < rect.top||
					e.clientY > rect.bottom){
					canvas.onmousemove = () =>{}
					canvas.onmouseup();
				}
			}
		}
		if(e.which == 2){
			let posx = Math.floor((e.clientX - rect.left)/(_TILESIZE*2))
				+ camera.drawFromX*_CHUNKSIZE;
			let posy = Math.floor((e.clientY - rect.top )/(_TILESIZE*2))
				+ camera.drawFromY*_CHUNKSIZE;
			if(__drawLayer == 'front'){
				currID = levelFront.getTileId(posx, posy);
			}
			if(__drawLayer == 'back'){
				currID = levelBack.getTileId(posx, posy);
			}
			if(__drawLayer == 'bg'){
				posx = Math.floor((e.clientX - rect.left)/(_TILESIZE*4))
						+ camera.subcamera.drawFromX*_CHUNKSIZE,
				posy = Math.floor((e.clientY - rect.top )/(_TILESIZE*4))
						+ camera.subcamera.drawFromY*_CHUNKSIZE
				currID = levelBG.getTileId(posx, posy);
			}
			changeID();
			console.log('x:', posx, ' y:', posy, ' id:', currID);
		}
		if(e.which == 3){
			__draw(e, 0);
			canvas.onmousemove = e =>{
				__draw(e, 0);

				if(e.clientX < rect.left||
					e.clientX > rect.right||
					e.clientY < rect.top||
					e.clientY > rect.bottom){
					canvas.onmousemove = () =>{}
				}
			}
		}
	}

	canvas.onmouseup = () =>{
		canvas.onmousemove = () =>{}
	}

	canvas.addEventListener('contextmenu', e=>{
		e.preventDefault();
	});


	window.levelFront = (string) => {
		levelFront.json = string;
	}
	window.levelBack = (string) => {
		levelBack.json = string;
	}
	window.levelBG = (string) => {
		levelBG.json = string;
	}

	window.getLevelFront = () => {
		return levelFront.json;
	}
	window.getLevelBack = () => {
		return levelBack.json;
	}
	window.getLevelBG = () => {
		return levelBG.json;
	}


	kbEvents = e =>{
		if(e.code == 'KeyA'){
			camera.pos.x -= camSpeed;
		}

		if(e.code == 'KeyD'){
			camera.pos.x += camSpeed;
		}

		if(e.code == 'KeyW'){
			camera.pos.y -= camSpeed;
		}

		if(e.code == 'KeyS'){
			camera.pos.y += camSpeed;
		}

		if(e.code == 'KeyE'){
			console.log(levelFront.json); 
		}
		if(e.code == 'KeyR'){
			console.log(levelBack.json);
		}
		if(e.code == 'KeyT'){
			console.log(levelBG.json);
		}

// console.log(e.code);
		if(e.code == 'Digit1'){
			camSpeed = 1;
		}
		if(e.code == 'Digit2'){
			camSpeed = _TILESIZE;
		}
		if(e.code == 'Digit3'){
			camSpeed = _CHUNKPIXELS;
		}
	}

	window.addEventListener('keydown', kbEvents);
}

let kbEvents = () => {}