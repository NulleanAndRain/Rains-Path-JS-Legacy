selectButton = (elem) => {
	if(!elem.classList.contains('nav_button__selected'))
		elem.classList.add('nav_button__selected');
}

unselectButton = (elem) => {
	if(elem.classList.contains('nav_button__selected'))
		elem.classList.remove('nav_button__selected');
}