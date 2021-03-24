class Timer{
	constructor(deltaTime){
		this.deltaTime=deltaTime;
		this.time=16; 
		this.lastTime=0;
		this.accumulatedTime=0;

		this.isPaused=true;
	}

	update(){}
	drawFrame(){}

	updateProxy(){
		this.accumulatedTime += (this.time - this.lastTime);

		if(this.accumulatedTime>this.deltaTime*4)
			this.accumulatedTime = this.deltaTime*4;	//frame skip


		while (this.accumulatedTime > this.deltaTime) {
			this.accumulatedTime -= this.deltaTime;
			this.update(this.deltaTime);
		}

		this.lastTime = this.time;
		this.time = new Date().getTime();

		this.drawFrame();

		_frametime = performance.now() - _frametime;
		this.deltaTime = _frametime;
		if(_frametimeDebug){
			console.log(1000/_frametime);
		}
		_frametime=performance.now();
		
		if(!this.isPaused) window.requestAnimationFrame(() => this.updateProxy());
		// if(!this.isPaused) setTimeout(() => this.updateProxy(), this.deltaTime/3);
	}

	start(){
		this.accumulatedTime=0;
		this.time = new Date().getTime();
		this.lastTime = this.time-16;
		this.isPaused=false;
		this.updateProxy();

		_frametime=performance.now();
	}

	pause(){
		if(this.isPaused) return;
		this.isPaused=true;
		this.accumulatedTime=0;
	}

	continue(){
		if(!this.isPaused) return;
		this.time = new Date().getTime();
		this.lastTime = this.time-16;
		this.isPaused=false;
		this.updateProxy();
	}
}