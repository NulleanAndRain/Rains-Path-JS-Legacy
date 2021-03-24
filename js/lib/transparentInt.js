let transparentInterface = id =>{

	const interface = document.getElementById(id); 
	const nav = document.getElementById('nav');
	const main = document.getElementById('main');

	nav.classList.remove('nav_bright');
	main.classList.remove('main_bright');
			
	interface.onmouseover = () => {}
	interface.onmouseout = () => {}

	nav.onmouseover = () => {}
	nav.onmouseout = () => {}

	if(localStorage.getItem('newStyle')){
		nav.onmouseover = () => {
			nav.classList.add('nav_bright');
		}

		nav.onmouseout = () => {
			nav.classList.remove('nav_bright');
		}
	} else {
		interface.onmouseover = () => {
			nav.classList.add('nav_bright');
			main.classList.add('main_bright');
		}

		interface.onmouseout = () => {
			nav.classList.remove('nav_bright');
			main.classList.remove('main_bright');
		}
	}
}