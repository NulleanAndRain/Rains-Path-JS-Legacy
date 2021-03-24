class Timer{
	constructor(deltaTime){
		this.deltaTime = deltaTime;
		this.time=16; 
		this.lastTime=0;
		this.accumulatedTime=0;

		this.isPaused=true;

		this._frametime = performance.now();
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

		this._frametime = performance.now() - this._frametime;
		this.deltaTime = this._frametime;
		if(_frametimeDebug) console.log(1000/this._frametime);
		this._frametime=performance.now();
		
		if(!this.isPaused) window.requestAnimationFrame(() => this.updateProxy());
		// if(!this.isPaused) setTimeout(() => this.updateProxy(), 13);
	}

	start(){
		this._frametime = performance.now();
		this.accumulatedTime=0;
		this.time = new Date().getTime();
		this.lastTime = this.time-16;
		this.isPaused=false;
		this.updateProxy();
	}

	pause(){
		if(this.isPaused) return;
		this.isPaused=true;
		this.accumulatedTime=0;
	}

	continue(){
		if(!this.isPaused) return;
		this._frametime = performance.now();
		this.time = new Date().getTime();
		this.lastTime = this.time-16;
		this.isPaused=false;
		this.updateProxy();
	}
}