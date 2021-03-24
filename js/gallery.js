//bgLoad, vertResize, drawBg from lib/bgLoad.js
//hideElem, showElem, bottomButtonsEvents from lib/elemHiding.js


var currPage = 0;
var pagesAll = 1;

var canvWidth = 1920;


window.onload = () => {
	//console.log('loaded');
	const blackscreen = document.getElementById('blackscreen');

	const galleryOverlay = document.getElementById('galleryOverlay');
	const closeImg = document.getElementById('closeImg');
	const activeImg = document.getElementById('activeImg');

	let images = document.getElementsByClassName('gallery-image');

	/*			//tbd on server
	loadJSON("", (response)=>{
		galleryJSON=JSON.parse(response);
	});
	*/
	const canvas = document.getElementById('bg');
	canvas.style.backgroundColor = "#000";


	const galleryItems = [
		{
			pageName : "Концепт-арты",
			bg : "./img/test1.png",
			pageImages:[
				{Url : "./img/mainMenuBGOrig.png"},
				{Url : "./img/mainMenuBgLineart.png"},
				{Url : "./img/conceptArt1.jpg"},
			]
		},
		{
			pageName : "Спрайты",
			bg : "./img/mainMenuBgLineart.png",
			pageImages:[
				{Url : "./img/sprites/Lena/IdleRight.png"},
				{Url : "./img/sprites/Lena/RunRight.png"},
				{Url : "./img/sprites/Lena/JumpRightUp.png"},
				{Url : "./img/sprites/Lena/JumpRightDown.png"},
				{Url : "./img/textures/stone.png"},
				{Url : "./img/textures/dirt.png"},
				{Url : "./img/textures/campfire.png"},
				{Url : "./img/sprites/Box/Idle.png"},
			]
		}
	];

	bgLoad(galleryItems[0].bg)

	pagesAll = galleryItems.length;
	printPage(images, galleryItems, activeImg, galleryOverlay);

	if(pagesAll!=1){
		const galleryLeftButton = document.getElementById('galleryLeftButton');
		galleryLeftButton.onclick = () =>{
			if(currPage==0) currPage=pagesAll-1;
			else currPage--;

			blackscreen.classList.remove('blackscreenFaded');
			blackscreen.classList.add('blackscreen');
			printPage(images, galleryItems, activeImg, galleryOverlay);
		}

		const galleryRightButton = document.getElementById('galleryRightButton');
		galleryRightButton.onclick = () => {
			if(currPage==pagesAll-1) currPage=0;
			else currPage++;

			blackscreen.classList.remove('blackscreenFaded');
			blackscreen.classList.add('blackscreen');
			printPage(images, galleryItems, activeImg, galleryOverlay);
		}
	}


	closeImg.onclick = () =>{
		galleryOverlay.classList.add('hidden');
	}
	galleryOverlay.onclick = (cursor) =>{
		if(!activeImg.childNodes[1].contains(cursor.target))
			closeImg.onclick();
	}

	bottomButtonsEvents('menu_container');
	transparentInterface('menu_container')


	let _items = document.getElementsByClassName('gallery-image');
	for(let elem of _items){
		elem.addEventListener('mouseover', ()=>{
			elem.parentNode.classList.add('gallery-item_hovered');
		});
		elem.addEventListener('mouseout', ()=>{
			elem.parentNode.classList.remove('gallery-item_hovered');
		});
	}
}

let printPage = (images, galleryItems, activeImg, galleryOverlay) =>{
	let galleryPageNum = document.getElementById('galleryPageNum');
	galleryPageNum.innerHTML = `${currPage+1}/${pagesAll}`;

	let pageName = document.getElementById('pageName');
	pageName.innerHTML = galleryItems[currPage].pageName;

	setTimeout(()=>bgLoad(galleryItems[currPage].bg), 200);

	resetImages(images);

	setImages(images, galleryItems, activeImg, galleryOverlay);
}

let setImages = (images, galleryItems, activeImg, galleryOverlay) => {
	for(let i=0; i<galleryItems[currPage].pageImages.length; i++){
		images[i].childNodes[1].src = galleryItems[currPage].pageImages[i].Url;
		images[i].childNodes[1].onload = () => {
			images[i].childNodes[1].style.display = "block";
			images[i].onclick = () =>{
				activeImg.childNodes[1].src = `${images[i].childNodes[1].src}`;
				showElem(galleryOverlay);
				images[i].childNodes[1].classList.remove('gallery-image_hover');
			}
			images[i].onmouseover = () =>{
				images[i].childNodes[1].classList.add('gallery-image_hover');
			}
			images[i].onmouseout = () =>{
				images[i].childNodes[1].classList.remove('gallery-image_hover');
			}
		}
	}
}

let resetImages = (images) => {
	for(image of images){
		image.childNodes[1].style.display = "none";
		image.childNodes[1].src = "";
		image.onclick = () =>{};
		image.onmouseover = () =>{};
		image.onmouseout = () =>{};
	}
}