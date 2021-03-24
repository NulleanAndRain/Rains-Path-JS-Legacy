let hideElem = (elem) => {
	if(!elem.classList.contains('hidden'))
		elem.classList.add('hidden');
}

let showElem = (elem) => {
	if(elem.classList.contains('hidden'))
		elem.classList.remove('hidden');
}

let bottomButtonsEvents = (id) => {
	let hide_button = document.getElementById('hide_button');	//bottom buttons
	let show_button = document.getElementById('show_button');

	const interface = document.getElementById(id);

	hide_button.onmouseover = () =>{
		hide_button.classList.add('bot-button__hover');
	}
	hide_button.onmouseout = () =>{
		hide_button.classList.remove('bot-button__hover');
	}

	show_button.onmouseover = () =>{
		show_button.classList.add('bot-button__hover');
	}
	show_button.onmouseout = () =>{
		show_button.classList.remove('bot-button__hover');
	}


	hide_button.onclick = () =>{
		hideElem(interface);
		hideElem(hide_button);
		showElem(show_button);
		show_button.classList.remove('transition03s');
		show_button.classList.add('bot-button__hover');
		show_button.focus();
		show_button.classList.add('transition03s');
	}
	show_button.onclick = () =>{
		showElem(interface);
		hideElem(show_button);
		showElem(hide_button);
		hide_button.classList.remove('transition03s');
		hide_button.classList.add('bot-button__hover');
		hide_button.focus();
		hide_button.classList.add('transition03s');
	}

}