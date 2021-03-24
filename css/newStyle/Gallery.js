let getNewStyle = () => {
	return "\
#menu_container{\
	width: 100%;\
	height: 100%;\
	max-height: 100%;\
	box-shadow: none;\
	position: fixed;\
	left: 0%;\
}\
\
.flex-menu{\
	flex-direction: row;\
}\
\
.flex-nav{\
	flex-direction: column;\
}\
\
.main{\
	width: 60%;\
	height: 60%;\
	background-color: transparent;\
	top: 20%;\
	left: 20%;\
	color: #000;\
}\
\
.nav{\
	width: 15%;\
	height: 100%;\
	left: 0;\
	top: 0;\
	position: absolute;\
}\
.nav_button{\
	width:100%;\
	height: 5em;\
}\
.nav_button:hover{\
	box-shadow: inset -0.3em 0 1.2em -0.6em rgba(0,0,0,1);\
}\
\
.nav_button__selected, .nav_button__selected:hover{\
	box-shadow: 0 0 0.8em -0.3em rgba(0,0,0,1);\
}\
\
\
.nav_square{\
	width: 100%;\
	width: 3em;\
	height: 3em;\
	z-index: 5;\
	position: absolute;\
	bottom: 22%;\
}\
\
.gallery-title{\
	width: 100%;\
	height: 20%;\
	max-width: 100%;\
	padding: 0;\
	display: flex;\
	justify-content: center;\
}\
\
#pageName{\
	width: 100%;\
	height: 15%;\
	display: flex;\
	justify-content: center;\
}\
\
#galleryLeftButton{\
	left: 0%;\
}\
#galleryRightButton{\
	right: 0%;\
}\
._verticalPlaceholder{\
	width: 100%;\
	height: 23%;\
}\
._horLine{\
	width: 100%;\
	height: 2%;\
}\
\
.gallery-image img{\
	background-color: rgba(255, 255, 255, 0.2);\
}\
.gallery-image img:hover{\
	background-color: rgba(255, 255, 255, 0.5);\
}\
\
\
#toggleTheme, #toggleStyle{\
	align-items: center;\
	justify-content: center;\
	left: auto;\
	right: 0;\
	height: 1em;\
	width: 1.5em;\
	border-radius: 0;\
	color: #42433E;\
	box-shadow: inset -2em 0 2em -1.5em #42433E;\
	color: #fff;\
	transition: box-shadow 0.3s, background-color 0.3s;\
	background-color: rgba(255, 255, 255, 0.2);\
}\
#toggleTheme:hover, #toggleStyle:hover{\
	color: #fff;\
	background-color: rgba(255, 255, 255, 0.8);\
	box-shadow: inset -2em 0 2em -0.5em #42433E;\
}\
\
#toggleTheme{\
	bottom: 2em;\
	border-bottom: 0.1em solid #42433E;\
}\
#toggleStyle{\
	bottom: 0;\
}\
\
.toggleStyle_icon{\
	flex-direction: row;\
}\
.toggleStyle_icon_elem1{\
	width: 25%;\
	margin: 0;\
	background-color: #fff;\
}\
\
.toggleStyle_icon_elem2{\
	width: 85%;\
	height: 60%;\
	background-color: #fff;\
}\
";
}