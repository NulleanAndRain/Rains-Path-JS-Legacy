let resizeAnim = (newWidth, canvas, context) =>{
	let dx = (newWidth-canvWidth)/30;
	if(dx==0) return;
	let resizeTimer = setInterval(()=>{
		canvWidth+=dx;
		if(dx>0&&canvWidth>newWidth) {
			canvWidth = newWidth;
			clearInterval(resizeTimer);
		}
		if(dx<0&&canvWidth<newWidth) {
			canvWidth = newWidth;
			clearInterval(resizeTimer);
		}
	}, (1000/60));
}