class Matrix {
	constructor() {
		this.grid = [];
	}

	forEach(callback) {
		this.grid.forEach((column, x) => {
			column.forEach((value, y) => {
				callback(value, x, y);
			});
		});
	}

	get(x, y) {
		const col = this.grid[x];
		if (col) {
			return col[y];
		}
		return undefined;
	}

	set(x, y, value) {
		if (!this.grid[x]) {
			this.grid[x] = [];
		}
		this.grid[x][y] = value;
	}
}

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
	return (x-(x*x*x)/6+(x*x*x*x*x)/120-(x*x*x*x*x*x*x)/5040);
}

let fastCos = x =>{
	x %= Math.PI;
	return (1-(x*x)/2+(x*x*x*x)/24-(x*x*x*x*x*x)/720+(x*x*x*x*x*x*x*x)/40320);
}


let fastRand = () =>{}
let rand = function() {
	var x = (new Date().getTime()%1022+1)/1024;
	const constC = 3.9943652676605887;
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
		for(let i=0; i<3*x; i++) 
			x = (constC*(1+(x - 0.5)*0.008))*x*(1-x);
		return postProcess(x);
	}
}();