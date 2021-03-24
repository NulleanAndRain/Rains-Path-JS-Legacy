class Vect2{
	constructor(x, y){
		this.set(x, y);
	}

	set(x, y){
		this.x=x;
		this.y=y;
	}
}

let fastSin = x =>{
	x %= Math.PI;
	return (x-(x**3)/6+(x**5)/120-(x**7)/5040);
}

let fastCos = x =>{
	x %= Math.PI;
	return (1-(x*x)/2+(x**4)/24-(x**6)/720+(x**8)/40320);
}


let fastRand = () =>{}
let rand = function() {
	var x = (new Date().getTime()%1022+1)/1024;
	x *= (performance.now()%0.98 + 0.01);
	const constC = 3.9943652676605887 + (x - 0.5) * 0.001;
	const postProcessConst = 0.95;

	fastRand = () =>{
		x = (constC*(1+(x - 0.5)*0.008))*x*(1-x);
		return x;
	} //		slower than Math.random()

	let postProcess = t =>{
		t+=postProcessConst;
		if(t>1) t = (1-t);
		t-=postProcessConst;
		if(t<0) t*=-1;
		t /= (1-postProcessConst);
		t %= 1;
		if(t>1 || t<0)
			console.log(t);

		return t;
	}

	return function(){
		x += performance.now()%15/10;
		if(x > 1) x %= 1;
		for(let i=0; i<3*x; i++) 
			// x *= (performance.now()%1;%0.98 + 0.01);
			x = (constC*(1+(x - 0.5)*0.008))*x*(1-x);
		return postProcess(x);
	}
}();