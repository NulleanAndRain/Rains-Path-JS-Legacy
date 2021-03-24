var _user = navigator.userAgent;
// console.log(_user);
if(!_user.match(/Trident/) && !_user.match(/rv:/) && !_user.match(/MSIE/)){} else {
	window.addEventListener('load', function(){
		document.getElementById('bg').style.display = 'none';
		document.getElementById('portraitOrient').style.display = 'none';
		document.getElementsByClassName('interface').item(0).style.display = 'none';
		document.getElementsByClassName('bot-button-wrapper').item(0).style.display = 'none';
		document.body.innerHTML = '<p style="color: #fff">If you see this message, please use other browser</p>';
	});
}