var TiMiniBrowser = require("lib/MiniBrowser/TiMiniBrowser");
var isAndroid = (Ti.Platform.osname === "android");

var win = Ti.UI.createWindow({
	backgroundColor:"#FFF"
});

var buttonModalBrowser = Ti.UI.createButton({
	left: 50,
	right: 50,
	height: 50,
	top: 100,
	title: "Modal MiniBrowser"
});
win.add(buttonModalBrowser);

var buttonNavBrowser = Ti.UI.createButton({
	left: 50,
	right: 50,
	height: 50,
	top: 200,
	title: "Navigation MiniBrowser"
});
win.add(buttonNavBrowser);

if (isAndroid === false) {
	var winBase = Ti.UI.createWindow();
	
	var nav = Ti.UI.iPhone.createNavigationGroup({
		window: win
	});

	winBase.add(nav);
	winBase.open();
} else {
	win.open();
}

buttonNavBrowser.addEventListener("click", function() {
	var browser = new TiMiniBrowser({
		url: "http://www.nyvra.net",
		barColor: "#FF0000",
		modal: false
	});
	
	if (isAndroid) {
		browser.open();
	} else {
		nav.open(browser.getWindow());
	}
});

buttonModalBrowser.addEventListener("click", function() {
	var browser = new TiMiniBrowser({
		url: "http://www.nyvra.net",
		barColor: "#FF0000"
	});
	
	browser.open();
});