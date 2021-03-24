var darkTheme = document.createElement('style');
darkTheme.innerHTML = getDarkTheme();

let toggleTheme = document.getElementById('toggleTheme');

if(localStorage.getItem('darkTheme')){
	document.body.appendChild(darkTheme);
	toggleTheme.innerHTML = '🌞';
}

var newStyle = document.createElement('style');
newStyle.innerHTML = getNewStyle();


if(localStorage.getItem('newStyle')){
	document.body.appendChild(newStyle);
}

toggleTheme.onclick = () => {
	if(localStorage.getItem('darkTheme')){
		localStorage.removeItem('darkTheme');
		document.body.removeChild(darkTheme);
		toggleTheme.innerHTML = '🌙';
	} else {
		localStorage.setItem('darkTheme', true);
		if(localStorage.getItem('newStyle')){
			document.body.removeChild(newStyle);
		}
		document.body.appendChild(darkTheme);
		if(localStorage.getItem('newStyle')){
			document.body.appendChild(newStyle);
		}
		toggleTheme.innerHTML = '🌞';
	}
}

let toggleStyle = document.getElementById('toggleStyle');

toggleStyle.onclick = () => {
	if(localStorage.getItem('newStyle')){
		document.body.removeChild(newStyle);
		localStorage.removeItem('newStyle');
		transparentInterface('menu_container');
		menu_containerResize();
	} else {
		localStorage.setItem('newStyle', true);
		document.body.appendChild(newStyle);
		transparentInterface('menu_container');
		menu_containerResize();
	}

}