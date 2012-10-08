var isAndroid = (Ti.Platform.osname === "android");

var TiMiniBrowser = function(dict) {
	this.dict = dict;
	this.c = {};

	if (!isAndroid) {
		this.createComponents();
	}
}


TiMiniBrowser.prototype.createComponents = function() {
	var self = this;

	// Create ActivitIndicator
	this.c.activityIndicator = Ti.UI.createActivityIndicator();
	this.c.activityIndicator.show();

	// Create Window
	this.c.window = Ti.UI.createWindow({
		rightNavButton: this.c.activityIndicator,
		modal: (typeof this.dict.modal !== "undefined") ? this.dict.modal : true,
		barColor: this.dict.barColor,
		title: (typeof this.dict.title !== "undefined") ? this.dict.title : undefined,
		orientationModes: [
			Ti.UI.LANDSCAPE_LEFT, 
			Ti.UI.LANDSCAPE_RIGHT,
			Ti.UI.PORTRAIT
		]
	});

	// Create Close Button if Window is Modal
	if (typeof this.dict.modal === "undefined" || this.dict.modal === true) {

		this.c.closeButton = Ti.UI.createButton({
			title: L("close", "Close")
		});
		this.c.window.setLeftNavButton(this.c.closeButton);

		this.c.closeButton.addEventListener("click", function() {
			self.c.window.close();
		});
		
	}

	// Create WebView
	this.c.webView = Ti.UI.createWebView({
		url: this.dict.url,
		bottom: (this.dict.showToolbar == true) ? 44 : 0,
		loading: false
	});
	this.c.window.add(this.c.webView);

	// ActionsDialog
	this.c.actionsDialog = Ti.UI.createOptionDialog({
		options: [
			L("copy_link", "Copy link"), 
			L("open_browser", "Open in Browser"), 
			L("send_by_email", "Send by email"), 
			L("cancel", "Cancel")
		],
		cancel: 3
	});

	// Create Toolbar components
	if (typeof this.dict.showToolbar === "undefined" || this.dict.showToolbar === true) {
		
		this.c.buttonAction = Ti.UI.createButton({
			systemButton: Titanium.UI.iPhone.SystemButton.ACTION,
			enabled: false
		});

		this.c.buttonBack = Ti.UI.createButton({
			image: "/lib/MiniBrowser/Icon-Back.png",
			enabled: false
		});

		this.c.buttonForward = Ti.UI.createButton({
			image: "/lib/MiniBrowser/Icon-Forward.png",
			enabled: false
		});

		this.c.buttonStop = Ti.UI.createButton({
			systemButton: Titanium.UI.iPhone.SystemButton.STOP
		});

		this.c.buttonRefresh = Ti.UI.createButton({
			systemButton: Titanium.UI.iPhone.SystemButton.REFRESH
		});
		
		this.c.buttonSpace = Ti.UI.createButton({
			systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});

		this.c.toolbar = Ti.UI.iOS.createToolbar({
			barColor: this.dict.barColor,
			bottom: 0,
			height: 44,
			items: [
				this.c.buttonBack, 
				this.c.buttonSpace, 
				this.c.buttonForward, 
				this.c.buttonSpace, 
				this.c.buttonRefresh,
				this.c.buttonSpace,
				this.c.buttonAction
			]
		});
		this.c.window.add(this.c.toolbar);
			

		// Toolbar Events Handlers
		this.c.buttonBack.addEventListener("click", function() {
			self.c.webView.goBack();
		});

		this.c.buttonForward.addEventListener("click", function() {
			self.c.webView.goForward();
		});

		this.c.buttonStop.addEventListener("click", function() {
			self.c.activityIndicator.hide();
			self.c.webView.stopLoading();

			self.c.buttonBack.setEnabled(self.c.webView.canGoBack());
			self.c.buttonForward.setEnabled(self.c.webView.canGoForward());
			self.c.buttonAction.setEnabled(true);

			self.c.actionsDialog.setTitle(self.c.webView.getUrl());

			self.updateToolbarItems(false);
		});

		this.c.buttonRefresh.addEventListener("click", function() {
			self.c.webView.reload();
		});

		this.c.buttonAction.addEventListener("click", function() {
			self.c.actionsDialog.show();
		});

	}


	// Events Handlers
	this.c.webView.addEventListener("load", function() {
		// Hide ActivityIndicator
		self.c.window.setRightNavButton(null);
		
		// Change components title
		self.updateComponentsTitle();

		// Enable and Disable buttons in Toolbar
		self.updateToolbarItems(false);
	});

	this.c.webView.addEventListener("beforeload", function() {
		// Show ActivityIndicator
		self.c.window.setRightNavButton(self.c.activityIndicator);

		// Enable and Disable buttons in Toolbar
		self.updateToolbarItems(true);
	});

	this.c.webView.addEventListener("error", function() {
		// Hide ActivityIndicator
		self.c.window.setRightNavButton(null);

		// Change components title
		self.updateComponentsTitle();
		
		// Enable and Disable buttons in Toolbar
		self.updateToolbarItems(false);
	});

	this.c.actionsDialog.addEventListener("click", function(e) {
		switch (e.index) {

			case 0:
				// Copy link to Clipboard
				Ti.UI.Clipboard.setText(self.c.webView.getUrl());
				break;

			case 1:
				// Open URL in Safari
				var url = self.c.webView.getUrl();
				if (Ti.Platform.canOpenURL(url)) {
					Ti.Platform.openURL(url);
				}
				break;

			case 2:
				// Send URL by email
				var emailDialog = Ti.UI.createEmailDialog({
					barColor: self.c.window.barColor
				});

				emailDialog.subject = self.c.window.getTitle();
				emailDialog.messageBody = self.c.webView.getUrl();
				emailDialog.open();
				break;

		}
	});
}


TiMiniBrowser.prototype.updateComponentsTitle = function() {
	// Change Window title, if none was configured
	if (typeof this.dict.title === "undefined") {
		this.c.window.setTitle(this.c.webView.evalJS("document.title"));
	}

	// Change ActionDialog title
	this.c.actionsDialog.title = this.c.webView.getUrl();
}


TiMiniBrowser.prototype.updateToolbarItems = function(isLoading) {
	// isLoading something?
	if (typeof isLoading === "undefined") {
		isLoading = false;
	}

	// If page is not loading
	if (isLoading === false) {
		// Verify if canBack or canForward
		this.c.buttonBack.enabled = this.c.webView.canGoBack();
		this.c.buttonForward.enabled = this.c.webView.canGoForward();
		this.c.buttonAction.enabled = true;

		this.c.toolbar.items = [
			this.c.buttonBack, 
			this.c.buttonSpace, 
			this.c.buttonForward, 
			this.c.buttonSpace, 
			this.c.buttonRefresh, 
			this.c.buttonSpace, 
			this.c.buttonAction
		];
	} else {
		// Disable Actions button
		this.c.buttonAction.setEnabled(false);

		this.c.toolbar.items = [
			this.c.buttonBack, 
			this.c.buttonSpace, 
			this.c.buttonForward, 
			this.c.buttonSpace, 
			this.c.buttonStop, 
			this.c.buttonSpace, 
			this.c.buttonAction
		];
	}
}


TiMiniBrowser.prototype.open = function() {
	if (isAndroid) {
		Ti.Platform.openURL(this.dict.url);
	} else {
		this.c.window.open();
	}
}

TiMiniBrowser.prototype.getWindow = function() {
	return this.c.window;
}


module.exports = TiMiniBrowser;