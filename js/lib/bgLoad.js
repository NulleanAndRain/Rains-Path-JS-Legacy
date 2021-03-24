const buffer = document.createElement('canvas');
const bufferImg = document.createElement('canvas');

let bgLoad = url =>{
	const canvas = document.getElementById('bg');
	const context = canvas.getContext('2d');

	let image = new Image();
	image.src=url;
	image.onload = () => {
		canvWidth=image.width;
		bufferImg.width=buffer.width=image.width;
		bufferImg.height=buffer.height=image.height;
		bufferImg.getContext('2d').drawImage(image, 0, 0);
		buffer.getContext('2d').drawImage(bufferImg, 0, 0);
		vertResize(canvas);
		drawBg(canvas, context);
	};

	const blackscreen = document.getElementById('blackscreen');
	blackscreen.classList.add('blackscreenFaded');
	blackscreen.classList.remove('blackscreen');
}

let drawBg = (canvas, context) =>{
	context.drawImage(buffer, 
					 ((canvas.width-buffer.width)/2),
					 ((canvas.height-buffer.height)/16*14), 
					 buffer.width, 
					 buffer.height);

	window.requestAnimationFrame(()=>{
		drawBg(canvas, context);
	});
}

