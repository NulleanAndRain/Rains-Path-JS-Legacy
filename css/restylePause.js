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
	if(localStorage.getItem('darkTheme')){}
	else {
		document.getElementById('pauseTitle').style.color = '#42433E';
	}
}


toggleTheme.onclick = () => {
	if(localStorage.getItem('darkTheme')){
		localStorage.removeItem('darkTheme');
		document.body.removeChild(darkTheme);

		if(localStorage.getItem('newStyle')){
			document.getElementById('pauseTitle').style.color = '#42433E';
		}
		else {
			document.getElementById('pauseTitle').style.color = '#fff';
		}
		toggleTheme.innerHTML = '🌙';
	} else {
		localStorage.setItem('darkTheme', true);
		if(localStorage.getItem('newStyle')){
			document.body.removeChild(newStyle);
		}
		document.body.appendChild(darkTheme);
		if(localStorage.getItem('newStyle')){
			document.body.appendChild(newStyle);
			document.getElementById('pauseTitle').style.color = '#fff';
		}
		else {
			document.getElementById('pauseTitle').style.color = '#42433E';
		}
		toggleTheme.innerHTML = '🌞';
	}
}

let toggleStyle = document.getElementById('toggleStyle');

toggleStyle.onclick = () => {
	if(localStorage.getItem('newStyle')){
		document.body.removeChild(newStyle);
		localStorage.removeItem('newStyle');
		transparentInterface('pause_container');
		pause_containerVertResize();
		document.getElementById('pauseTitle').style.color = '#fff';
	} else {
		localStorage.setItem('newStyle', true);
		document.body.appendChild(newStyle);
		transparentInterface('pause_container');
		pause_containerVertResize();
		if(localStorage.getItem('darkTheme')){
			document.getElementById('pauseTitle').style.color = '#fff';
		}
		else {
			document.getElementById('pauseTitle').style.color = '#42433E';
		}
	}

}