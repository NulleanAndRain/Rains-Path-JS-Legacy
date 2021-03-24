function vertResize(canvas){
	window.onresize = () =>{
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

		// console.log(_canvHeight);
		if(typeof _canvHeight !== undefined){
			_canvHeight = canvHeight;
		}
	}
	window.onresize();
}