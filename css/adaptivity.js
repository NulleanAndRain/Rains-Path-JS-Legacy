let adaptaptivity = () => {
	document.body.style.fontSize = `${window.innerWidth/100}px`;
	window.requestAnimationFrame(adaptaptivity);
}
adaptaptivity();