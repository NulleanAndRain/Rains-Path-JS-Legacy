let getNewStyle = () => {
	return "\
	#pause_container{\
	width: 100%;\
	max-width: 100%;\
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
	position: absolute;\
	width: 25%;\
	height: 60%;\
	background-color: transparent;\
	top: 25%;\
	left: 5%;\
	color: #000;\
	justify-content: flex-start;\
	align-items: flex-start;\
}\
\
.nav{\
	width: 5%;\
	height: 100%;\
	left: 0;\
	top: 0;\
	position: absolute;\
	justify-content: flex-start;\
	overflow: visible;\
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
#pauseTitle{\
	position: fixed;\
	top: 25%;\
	left: 7%;\
}\
\
.game-tab_button{\
	z-index: 5;\
	width: 13em;\
	padding-left: 1em;\
	justify-content: flex-start;\
}\
.tab_80perc{\
	height: 80%;\
	padding-top: 20%;\
	margin: 0;\
}\
.tab_20perc{\
	z-index: 5;\
	justify-content: flex-start;\
	padding-left: 10%;\
	width: 90%;\
	bottom: -20%;\
}\
\
#toggleTheme, #toggleStyle{\
	align-items: center;\
	justify-content: center;\
	left: auto;\
	right: 0;\
	height: 1em;\
	width: 1.5em;\
	border-radius: 0;\
	background-color: transparent;\
	color: #42433E;\
	box-shadow: inset -2em 0 2em -1.5em #42433E;\
	color: #fff;\
	transition: box-shadow 0.3s, background-color 0.3s;\
	background-color: rgba(255, 255, 255, 0.2);\
}\
#toggleTheme:hover, #toggleStyle:hover{\
	color: #fff;\
	background-color: rgba(255, 255, 255, 0.4);\
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
.alphaVer{\
	left: 5.8%;\
}\
";
}