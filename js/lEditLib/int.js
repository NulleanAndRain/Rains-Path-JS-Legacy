let changeID = () =>{};
let addTile  = () =>{};

let setInt = (IDResolver) =>{
	const blockSelect = document.getElementById('blockSelect');
	const ids = document.getElementsByClassName('id');

	const _color = document.getElementById('color');
	const name   = document.getElementById('name');
	const type   = document.getElementById('type');
	const addBtn = document.getElementById('addTile');

	let focus = () =>{
		window.removeEventListener('keydown', kbEvents);
	}
	let unfocus = () =>{
		window.addEventListener('keydown', kbEvents);
	}

	_color.onfocus	= focus;
	name.onfocus	= focus;
	type.onfocus	= focus;

	_color.onblur	= unfocus;
	name.onblur		= unfocus;
	type.onblur		= unfocus;


	changeID = () =>{
		for(let id = 0; id<ids.length; id++){
			let elem = ids.item(id);
			if(id != currID){
			elem.classList.remove('idSelected');
			elem.onclick = () =>{
				currID = id;
				elem.classList.add('idSelected');
				changeID();
			}} else {
				elem.classList.add('idSelected');
				elem.onclick = () =>{};
				copyTileData(elem, id);
			}
		}
	}

	changeID();

	addTile = () =>{
		let tile = {
			name: name.value,
			type: type.value
		}

		IDResolver.setId(
			ids.length,
			tile,
			_color.value
		);

		let tileSel = document.createElement('div');
		tileSel.classList.add('id');

		let tileSelColor = document.createElement('div');
		tileSelColor.classList.add('tilecolor');
		tileSelColor.style.backgroundColor = `${_color.value}`;

		let tileSelText = document.createElement('div');
		tileSelText.classList.add('tileinfo');
		tileSelText.innerText = `${ids.length} :  ${name.value}`;

		tileSel.appendChild(tileSelColor);
		tileSel.appendChild(tileSelText);

		blockSelect.appendChild(tileSel);

		changeID();
	}


	let copyTileData = (elem, id) =>{
		let tile = IDResolver.getTile(id);
		if(tile){
			name.value = tile.name;
			type.value = tile.type;
		}

		_color.value = `${RGBToHex( 
			elem.getElementsByClassName('tilecolor')
			.item(0).style.backgroundColor)
		}`;
	}

	addBtn.onclick = () =>{
		addTile();
	}

	let RGBToHex = str => {
		let a = str.split("(")[1].split(")")[0];
		a = a.split(",");
		let b = a.map((x) =>{
			x = parseInt(x).toString(16);
			return (x.length==1) ? "0"+x : x;
		});
		return '#'+b.join('');
	}

	const selectFront = document.getElementById('selectFront');
	const selectBack = document.getElementById('selectBack');
	const selectBG = document.getElementById('selectBG');

	selectFront.onclick = () =>{
		__drawLayer = 'front';
		selectFront.classList.add('idSelected');
		selectBack.classList.remove('idSelected');
		selectBG.classList.remove('idSelected');
	}

	selectBack.onclick = () =>{
		__drawLayer = 'back';
		selectBack.classList.add('idSelected');
		selectFront.classList.remove('idSelected');
		selectBG.classList.remove('idSelected');
	}

	selectBG.onclick = () =>{
		__drawLayer = 'bg';
		selectBG.classList.add('idSelected');
		selectFront.classList.remove('idSelected');
		selectBack.classList.remove('idSelected');
	}

	const toggleGrid = document.getElementById('toggleGrid');
	toggleGrid.onclick = () =>{
		if(_chunkGrid){
			_chunkGrid = false;
			localStorage.removeItem('_chunkGrid');
		} else {
			_chunkGrid = true;
			localStorage.setItem('_chunkGrid', true);
		}
	}
}

let addTileFromJSON = (name, color) =>{
	const blockSelect = document.getElementById('blockSelect');
	const ids = document.getElementsByClassName('id');

	// console.log(ids.length, name, color);
	let tileSel = document.createElement('div');
	tileSel.classList.add('id');

	let tileSelColor = document.createElement('div');
	tileSelColor.classList.add('tilecolor');
	tileSelColor.style.backgroundColor = `${color}`;

	let tileSelText = document.createElement('div');
	tileSelText.classList.add('tileinfo');
	tileSelText.innerText = `${ids.length} :  ${name}`;

	tileSel.appendChild(tileSelColor);
	tileSel.appendChild(tileSelText);

	blockSelect.appendChild(tileSel);

	changeID();
}