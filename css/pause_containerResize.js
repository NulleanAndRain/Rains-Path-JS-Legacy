let pause_containerVertResize = () => {
	let pause_container = document.getElementById('pause_container');
	if(!pause_container.classList.contains('hidden')){
		if(localStorage.getItem('newStyle')){
			pause_container.style.height = `100%`;
		}
		else{
			pause_container.style.height = `${pause_container.clientWidth*6/5}px`;
		}
	}
	if(localStorage.getItem('newStyle')){}
	else window.requestAnimationFrame(pause_containerVertResize);
}
pause_containerVertResize();