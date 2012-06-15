var browser = require("modules/mini-browser/mini-browser.method");

var windowBase = Ti.UI.createWindow({
	backgroundColor:"#FFF"
});

var buttonOpenMobileBrowser = Ti.UI.createButton({
	left:50,
	right:50,
	height:50,
	title:"Open MiniBrowser"
});
windowBase.add(buttonOpenMobileBrowser);

buttonOpenMobileBrowser.addEventListener("click", function() {

	browser.MiniBrowser({
		url:"http://www.treinamentos.mobi",
		barColor:"#000",
		showToolbar: true,
		modal: true,
		windowTitle: 'Mini Browser',
		activityMessage: 'Loading Page'
	});
	
	browser.openBrowser();
	
});

windowBase.open();