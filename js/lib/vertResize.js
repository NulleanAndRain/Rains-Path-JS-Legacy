function vertResize(canvas){
	let sizing = (window.innerHeight/window.innerWidth);
	let currWidth = canvWidth;
	let canvHeight = canvWidth*sizing;

	if(sizing>0.9){
		canvHeight = currWidth*0.9;
		currWidth = canvHeight/sizing;
	} else {
		canvHeight = currWidth*sizing;
	}

	canvas.width = currWidth;
	canvas.height = canvHeight;

	// console.log(canvas.height);
	if(typeof _canvHeight !== undefined){
		_canvHeight = canvHeight;
	}
	window.requestAnimationFrame(()=>vertResize(canvas));
}