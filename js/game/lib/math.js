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


let rand = () =>{}
let fastRand = () =>{}

let _setupRand = () =>{
	var x = (new Date().getTime()%1022+1)/1024;
	const constC = 3.9943652676605887;
	const postProcConst = 0.95;

	let postProc = t =>{
		t+=postProcConst;
		if(t>1) t = (1-t);
		t-=postProcConst;
		if(t<0) t*=-1;
		t /= (1-postProcConst);
		t %= 1;
		return t;
	}

	rand = () =>{
		for(let i=0; i<3*x; i++) 
			x = (constC*(1+(x - 0.5)*0.008))*x*(1-x);
		return postProc(x);
	}

	fastRand = () =>{
		x = (constC*(1+(x - 0.5)*0.008))*x*(1-x);
		return x;
	} //slower than Math.random()
}

_setupRand();