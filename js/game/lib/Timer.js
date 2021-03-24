class Timer{
	constructor(deltaTime){
		this.deltaTime=deltaTime;
		this.time=16; 
		this.lastTime=0;
		this.accumulatedTime=0;

		this.isPaused=true;
	}

	updateProxy(){
		this.accumulatedTime += (this.time - this.lastTime);

		if(this.accumulatedTime>this.deltaTime*3)
			this.accumulatedTime = this.deltaTime*3;	//frame skip


		while (this.accumulatedTime > this.deltaTime) {
			this.accumulatedTime -= this.deltaTime;
			this.update(this.deltaTime);
		}

		this.lastTime = this.time;
		this.time = new Date().getTime();
		
		if(!this.isPaused) window.requestAnimationFrame(() => this.updateProxy());
		// if(!this.isPaused) setTimeout(() => this.updateProxy(), this.accumulatedTime);
	}

	start(){
		this.accumulatedTime=0;
		this.time = new Date().getTime();
		this.lastTime = this.time-16;
		this.isPaused=false;
		// console.log(this.time%20000);
		this.updateProxy();
	}

	pause(){
		if(this.isPaused) return;
		this.isPaused=true;
		this.accumulatedTime=0;
		if(__TEST_AREA) {
			this.setPauseIcoArgs();
			setTimeout(()=>{
				window.requestAnimationFrame(()=>{
					this.drawPauseIco();
				}
			)}, 1);
		} 
	}

	continue(){
		if(!this.isPaused) return;
		this.time = new Date().getTime();
		this.lastTime = this.time-16;
		this.isPaused=false;
		this.updateProxy();
	}
	drawPauseIco(){
		_ctx.fillStyle = "rgba(0,0,0,0.4)";
		_ctx.fillRect(
			_canvas.width/2-25,
			_canvas.height/2-25,
			50,50);
		_ctx.fillStyle = "#fff";
		_ctx.fillRect(
			_canvas.width/2-15,
			_canvas.height/2-15,
			10,30);
		_ctx.fillRect(
			_canvas.width/2+5,
			_canvas.height/2-15,
			10,30);
	}
}