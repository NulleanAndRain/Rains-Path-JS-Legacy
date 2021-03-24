let getDarkTheme = () => {
	return "\
.main{\
	background-color: rgba(40, 41, 35, 0.6);\
	color: #fff;\
}\
.main_bright{\
	background-color: #282923;\
}\
.main a{\
	color: #fff;\
}\
#portraitOrient{\
	background-color: #282923;\
	color: #fff;\
}\
#portraitOk{\
	background-color: #B28BBE;\
}\
#portraitOk:hover{\
	background-color: #9A58B4;\
}\
\
.nav{\
	background-color: rgba(160, 87, 182, 0.6);\
	box-shadow: inset 0 -0.3em 2em -0.6em #000, 1.2em 1.2em 5em 6.5em #282923;\
}\
\
.nav_bright{\
	background-color: #9A58B4;\
}\
\
.nav_button:hover{\
	background-color: #BC7FD9;\
}\
\
.nav_button__selected, .nav_button__selected:hover{\
	background-color: #282923;\
	color: #fff;\
}\
._horLine{\
	background-color: #282923;\
}\
\
.pause_nav{\
	box-shadow: inset 0 -0.3em 1em -0.6em #000, 0 0 5em 2.5em #282923;\
}\
\
.tab-button{\
	background-color: #42433E;\
}\
.tab-button:hover{\
	background-color: #939491;\
}\
\
.game-tab_title h1{\
	color: #fff\
}\
\
\
.setting{\
	color: #fff;\
	background-color: rgba(40, 41, 35, 0.4);\
}\
.setting_checkbox{\
	margin: 0;\
	margin-right: 0.5em;\
}\
\
.keyboard_key, .keyboard_key_alt{\
	background-color: #42433E;\
}\
\
\
.bot-button{\
	background-color: rgba(40, 41, 35, 0.6);\
	color: rgba(255, 255, 255, 0.6);\
}\
.bot-button__pale{\
	background-color: rgba(40, 41, 35, 0.3);\
	color: rgba(255, 255, 255, 0.3);\
}\
.bot-button__hover{\
	background-color: rgb(40, 41, 35);\
	color: rgb(255, 255, 255);\
}\
#toggleTheme{\
	background-color: rgba(255, 255, 255, 0.3);\
	color: #42433E;\
}\
#toggleTheme:hover{\
	background-color: #fff;\
	color: #42433E;\
}\
#toggleStyle{\
	background-color: rgba(255, 255, 255, 0.3);\
	color: #000;\
}\
#toggleStyle:hover{\
	background-color: #fff;\
	color: #000;\
}\
.toggleStyle_icon_elem1, .toggleStyle_icon_elem2{\
	background-color: #42433E;\
}\
\
\
.gallery-title{\
	background-color: #282923;\
	color: #fff;\
}\
\
#pauseTitle{\
	color: '#fff';\
}\
";
}
