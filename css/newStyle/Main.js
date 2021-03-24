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
	width: 70%;\
	height: 60%;\
	background-color: transparent;\
	top: -80%;\
	left: 15%;\
	color: #000;\
}\
\
.nav{\
	width: 15%;\
	height: 100%;\
}\
.nav_button{\
	width:100%;\
	height: 15%;\
}\
.nav_button:hover{\
	box-shadow: inset -0.3em 0 1.2em -0.6em rgba(0,0,0,1);\
}\
\
.nav_button__selected, .nav_button__selected:hover{\
	box-shadow: 0 0 0.8em -0.3em rgba(0,0,0,1);\
}\
\
.game-tab_title h1{\
	color: #000;\
	font-size: 6em;\
}\
\
.about_link-wrapper a{\
	color: #000;\
}\
.tab_80perc{\
	align-items: flex-start;\
	align-content: flex-start;\
	padding-left: 5%;\
	width: 95%;\
}\
.tab_20perc, .settings-tab_buttons{\
	z-index: 5;\
	justify-content: flex-start;\
	align-items: flex-start;\
}\
.settings-tab_buttons{\
	width: 85%;\
	padding-left: 15%;\
}\
\
.keyboard_info, .keyboard_info_spacer{\
	background-color: rgba(255, 255, 255, 0.8);\
	height: 3.2em;\
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
";
}