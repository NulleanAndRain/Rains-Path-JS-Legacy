let menu_containerResize = () => {
	let menu_container = document.getElementById('menu_container');
	if(!menu_container.classList.contains('hidden')){
		if(localStorage.getItem('newStyle')){
			menu_container.style.height = `100%`;
		}
		else{
			menu_container.style.height = `${menu_container.clientWidth*9/16}px`;
		}
	}
	if(localStorage.getItem('newStyle')){}
	else window.requestAnimationFrame(menu_containerResize);
}
menu_containerResize();