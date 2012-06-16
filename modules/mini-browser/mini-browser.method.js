var MiniBrowser = function(dictionary) {

	var isUndefined = function(value, type) {
		if (typeof dictionary[value] != 'undefined')
			if (typeof type == 'undefined' || typeof dictionary[value] == type)
				return false;
		return true;
	}

	this.url = dictionary.url;
	this.backgroundColor = (isUndefined('backgroundColor')) ? '#FFF' : dictionary.backgroundColor;
	this.barColor = (isUndefined('barColor')) ? undefined : dictionary.barColor;
	this.modal = (isUndefined('modal')) ? false : dictionary.modal;
	this.modalStyle = (isUndefined('modalStyle')) ? false : dictionary.modalStyle;
	this.showToolbar = (isUndefined('showToolbar', 'boolean')) ? true : dictionary.showToolbar;
	this.html = (isUndefined('html')) ? null : dictionary.html;
	this.windowRef = (isUndefined('windowRef')) ? false : dictionary.windowRef;
	this.shareButton = (isUndefined('shareButton')) ? true : dictionary.shareButton;
	this.windowTitle = (isUndefined('windowTitle')) ? false : dictionary.windowTitle;
	this.showActivity = (isUndefined('showActivity', 'boolean')) ? false : dictionary.showActivity;
	this.scaleToFit = (isUndefined('scaleToFit')) ? false : dictionary.scaleToFit;
	this.activityMessage = (isUndefined('activityMessage')) ? "Loading" : dictionary.activityMessage;
	this.activityStyle = (isUndefined('activityStyle')) ? Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN : dictionary.activityStyle;

	var winBase, nav, windowBrowser, webViewBrowser, buttonCloseWindow, activityIndicator, toolbarButtons, buttonBack, buttonForward, buttonStop, buttonRefresh, buttonAction, buttonSpace, actionDialog, osname, actionsDialog, loadURL, items, spacerWidth, that, closeWindow, menu, shareItems, actionsAct, errMsg, toolbar, isAndroid;

	this.initToolbar = function() {

		buttonAction = Ti.UI.createButton({
			enabled : false
		});
		
		buttonBack = Ti.UI.createButton({
			image : "/modules/mini-browser/Icon-Back.png",
			enabled : false
		});
		
		buttonBack.addEventListener("click", function () {
			webViewBrowser.goBack();
		});
		
		buttonForward = Ti.UI.createButton({
			image : "/modules/mini-browser/Icon-Forward.png",
			enabled : false
		});
		
		buttonForward.addEventListener("click", function () {
			webViewBrowser.goForward();
		});

		buttonStop = Ti.UI.createButton();

		if (!isAndroid) {
			buttonStop.systemButton = Titanium.UI.iPhone.SystemButton.STOP
		} else {
			buttonStop.image = '/modules/mini-browser/Icon-Stop.png';
		}

		buttonStop.addEventListener("click", function () {
			activityIndicator.hide();
			webViewBrowser.stopLoading();
			buttonBack.enabled = webViewBrowser.canGoBack();
			buttonForward.enabled = webViewBrowser.canGoForward();
			buttonAction.enabled = true;
			actionsDialog.title = webViewBrowser.url;

			toolbarButtons.items = [buttonBack, buttonSpace, buttonForward, buttonSpace, buttonRefresh, buttonSpace, buttonAction];
		});

		buttonRefresh = Ti.UI.createButton();

		if (!isAndroid) {
			buttonRefresh.systemButton = Titanium.UI.iPhone.SystemButton.REFRESH;
		} else {
			buttonRefresh.image = '/modules/mini-browser/Icon-Reload.png';
		}
	buttonRefresh.addEventListener("click", function() {
			webViewBrowser.reload();
		});

		if (!isAndroid && this.shareButton) {
			buttonAction.systemButton = Titanium.UI.iPhone.SystemButton.ACTION;
			buttonAction.addEventListener("click", function () {
				actionsDialog.show();
			});
		}

		if (!isAndroid) {
			buttonSpace = Ti.UI.createButton({
				systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
			});

			toolbarButtons = Ti.UI.iOS.createToolbar({
				barColor : this.barColor,
				bottom : 0,
				height : 44
			});

			items = [buttonBack, buttonSpace, buttonForward, buttonSpace, buttonRefresh];
			if (this.shareButton) {
				items.push(buttonSpace);
				items.push(buttonAction);
			}
			toolbarButtons.items = items;

		} else {
			toolbarButtons = Ti.UI.createView({
				height : 54,
				bottom : 0,
				backgroundColor : this.barColor,
				layout : 'horizontal'
			});

			spacerWidth = (Ti.Platform.displayCaps.platformWidth - (44)) / 4;

			buttonBack.left = spacerWidth;
			buttonForward.left = spacerWidth;
			buttonRefresh.left = spacerWidth;
			toolbarButtons.add(buttonBack);
			toolbarButtons.add(buttonForward);
			toolbarButtons.add(buttonRefresh);
		}
		return toolbarButtons;

	};

	this.header = function () {
		return '<!DOCTYPE HTML> 	<html> 	<head> 		<meta http-equiv="Content-type" content="text/html; charset=utf-8"> 		<title>Page Title</title> 	<link rel="stylesheet" type="text/css" href="./modules/mini-browser/local.css" />	</head> 	<body>';
	};

	this.footer = function () {
		return '</body> 	 	</html>';
	};
	/**
	 * Initialise the options dialog for the loaded URL
	 */
	this.initActions = function () {
		actionsDialog = Ti.UI.createOptionDialog({
			options : [
				L("copy_link", "Copy link"), 
				L("open_browser", "Open in Browser"), 
				L("send_by_email", "Send by email"), 
				L("cancel", "Cancel")
			],
			cancel : 3
		});

		actionsDialog.addEventListener("click", function(e) {

			switch (e.index) {

				case 0:
					Titanium.UI.Clipboard.setText(webViewBrowser.url);
					break;

				case 1:
					if (!isAndroid) {
						if (Titanium.Platform.canOpenURL(webViewBrowser.url)) {
							var loadURL = true;
						}
					} else {
						loadURL = true
					}
					if (loadURL)
						Titanium.Platform.openURL(webViewBrowser.url);
					break;

				case 2:
					var emailDialog = Titanium.UI.createEmailDialog({
						barColor : windowBrowser.barColor
					});

					emailDialog.subject = windowBrowser.title;
					emailDialog.messageBody = webViewBrowser.url;
					emailDialog.open();
					break;

				default:
					break;
			}
		});
	};
	/*
	 * Allow the browser to be attached to an existing window within your
	 * application, or create a new window object
	 */
	if (!this.windowRef) {
		windowBrowser = Ti.UI.createWindow({
			backgroundColor : this.backgroundColor
		});
	} else {
		windowBrowser = this.windowRef;
		Titanium.API.info('window object passed thorugh is: ' + this.windowRef);
	}

	if (!isAndroid) {
		windowBrowser.barColor = this.barColor;
	}

	this.initActions();

	that = this;
	if (isAndroid) {

		var actionsAct = windowBrowser.activity;
		actionsAct.onCreateOptionsMenu = function(e) {
			var menu = e.menu;
			
			if (that.shareButton) {
				var shareItems = menu.add({
					title: "Share"
				});
				shareItems.addEventListener("click", function () {
					actionsDialog.show();
				});
			}

			closeWindow = menu.add({
				title: "Close"
			});

			closeWindow.addEventListener("click", function() {
				windowBrowser.close();
			});
		}

	}

	if (this.modal === true) {
		winBase = Ti.UI.createWindow({
			navBarHidden : true,
			modal : true
		});

		if (!isAndroid) {
			nav = Ti.UI.iPhone.createNavigationGroup({
				window : windowBrowser
			});
			winBase.add(nav);
			buttonCloseWindow = Ti.UI.createButton({
				title : L("close", "Close"),
				style : Ti.UI.iPhone.SystemButtonStyle.DONE
			});
			windowBrowser.leftNavButton = buttonCloseWindow;

			buttonCloseWindow.addEventListener("click", function () {
				winBase.close();
			});
			winBase.addEventListener("close", function () {
				windowBrowser = null;
				this.windowRef = null;
				nav = null;
				buttonCloseWindow = null;
				webViewBrowser = null;
				toolbarButtons = null;
				buttonBack = null;
				buttonForward = null;
				buttonStop = null;
				buttonRefresh = null;
				buttonAction = null;
				buttonSpace = null;
				winBase = null;
			});
		} else {
			windowBrowser.modal = true;
		}
	}

	webViewBrowser = Ti.UI.createWebView({
		left: 0,
		top: 0,
		bottom: (this.showToolbar) ? 44 : 0,
		loading: false
	});

	try {
		if (!this.html) {
			webViewBrowser.url = this.url;
		} else {
			var localHTML = this.header();
			localHTML += this.html;
			localHTML += this.footer();
			Ti.API.info(localHTML);
			webViewBrowser.html = localHTML;
		}
	} catch (e) {
		if (isAndroid) {
			errMsg = e.toString();
		} else {
			errMsg = e.message;
		}
		alert('Error ' + errMsg);
	}

	webViewBrowser.title = (this.windowTitle) ? this.windowTitle : false;
	windowBrowser.add(webViewBrowser);
    that = this;
	webViewBrowser.addEventListener("load", function () {

		if (!isAndroid)
			windowBrowser.setRightNavButton(null);

		activityIndicator.hide();
		
		windowBrowser.title = (webViewBrowser.title) ? webViewBrowser.title : webViewBrowser.evalJS("document.title");
		actionsDialog.title = webViewBrowser.url;

		if (buttonBack) {
			buttonBack.enabled = webViewBrowser.canGoBack();
			buttonForward.enabled = webViewBrowser.canGoForward();
			buttonAction.enabled = true;

			var items = [buttonBack, buttonSpace, buttonForward, buttonSpace, buttonRefresh];
            if (that.shareButton) {
                items.push(buttonSpace);
                items.push(buttonAction);
            }
            toolbarButtons.items = items;
		}

	});
    that = this;
	webViewBrowser.addEventListener("beforeload", function () {

		if (!isAndroid)
			windowBrowser.setRightNavButton(activityIndicator);

		activityIndicator.show();

		if (buttonAction) {
			buttonAction.enabled = false;
			if (!isAndroid) {
				items = [buttonBack, buttonSpace, buttonForward, buttonSpace, buttonStop];
                if (that.shareButton) {
                    items.push(buttonSpace);
                    items.push(buttonAction);
                }
                toolbarButtons.items = items;
			}
		}

	});

	webViewBrowser.addEventListener("error", function () {

		activityIndicator.hide();
		actionsDialog.title = webViewBrowser.url;
		if (buttonBack) {
			buttonBack.enabled = webViewBrowser.canGoBack();
			buttonForward.enabled = webViewBrowser.canGoForward();
			buttonAction.enabled = true;

			toolbarButtons.items = [buttonBack, buttonSpace, buttonForward, buttonSpace, buttonStop];
			if (that.shareButton) {
			    toolbarButtons.items.push(buttonSpace);
			    toolbarButtons.items.push(buttonAction);
			}
		}

	});

	if (this.showToolbar) {
		toolbar = this.initToolbar();
		windowBrowser.add(toolbar);
	}
	activityIndicator = Ti.UI.createActivityIndicator({
		message : this.activityMessage
	});

	if (!isAndroid) {
		activityIndicator.setStyle(this.activityStyle);
		windowBrowser.setRightNavButton(activityIndicator);
		activityIndicator.message = null;
	}

	this.openBrowser = function() {
		
		var win = (this.modal === true && !isAndroid) ? winBase : windowBrowser;
		
		try {
			if (!isAndroid && this.modalStyle && this.modal) {
				win.open({
					modal : true,
					modalTransitionStyle : this.modalStyle
				});
			} else {
				win.open();
			}

		} catch (e) {
			Ti.API.error(e.message);
		}

	};
	this.returnBrowser = function () {
		return windowBrowser;
	};
	this.returnWebView = function () {
		return webViewBrowser;
	};
};
//create a blank object, just in case the user is still using the old Ti.include
// method
exports = exports || {};
exports.MiniBrowser = MiniBrowser;