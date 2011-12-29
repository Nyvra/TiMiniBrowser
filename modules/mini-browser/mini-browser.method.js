var MiniBrowser = function(dictionary) 
{
	this.url = dictionary.url;
	this.barColor = (dictionary.barColor) ? dictionary.barColor : Ti.UI.currentWindow.barColor;
	this.modal = (dictionary.modal) ? dictionary.modal : false;

	var winBase;
	var nav;
	var windowBrowser;
	var webViewBrowser;
	var buttonCloseWindow;
	var activityIndicator;

	var toolbarButtons;
	var buttonBack;
	var buttonForward;
	var buttonStop;
	var buttonRefresh;
	var buttonAction;
	var buttonSpace;
	
	var actionDialog;
	
	this.create = function()
	{
		windowBrowser = Ti.UI.createWindow({
			barColor:this.barColor,
			backgroundColor:"#FFF"
		});
		
		if (this.modal == true) 
		{
			winBase = Ti.UI.createWindow({
				navBarHidden:true,
				modal:true
			});
			nav = Ti.UI.iPhone.createNavigationGroup({
				window:windowBrowser
			});
			winBase.add(nav);
			
			buttonCloseWindow = Ti.UI.createButton({
				title:"Fechar",
				style:Ti.UI.iPhone.SystemButtonStyle.DONE
			});
			windowBrowser.leftNavButton = buttonCloseWindow;
			
			buttonCloseWindow.addEventListener("click", function() {
				winBase.close();
			})
		}
		
		webViewBrowser = Ti.UI.createWebView({
			url:this.url,
			left:0,
			top:0,
			bottom:44,
			width:"100%",
			loading:false
		});
		windowBrowser.add(webViewBrowser);
		
		webViewBrowser.addEventListener("load", function() {
			
			activityIndicator.hide();
			
			windowBrowser.title = webViewBrowser.evalJS("document.title");
		
			buttonBack.enabled = webViewBrowser.canGoBack();
			buttonForward.enabled = webViewBrowser.canGoForward();
			buttonAction.enabled = true;
			
			actionsDialog.title = webViewBrowser.url;
			
			toolbarButtons.items = [
				buttonBack,
				buttonSpace,
				buttonForward,
				buttonSpace,
				buttonRefresh,
				buttonSpace,
				buttonAction
			];
		
		});
		
		webViewBrowser.addEventListener("beforeload", function() {

			activityIndicator.show();
			
			buttonAction.enabled = false;
		
			toolbarButtons.items = [
				buttonBack,
				buttonSpace,
				buttonForward,
				buttonSpace,
				buttonStop,
				buttonSpace,
				buttonAction
			];
		
		});
		
		webViewBrowser.addEventListener("error", function() {

			activityIndicator.hide();

			buttonBack.enabled = webViewBrowser.canGoBack();
			buttonForward.enabled = webViewBrowser.canGoForward();
			buttonAction.enabled = true;
			
			actionsDialog.title = webViewBrowser.url;
			
			toolbarButtons.items = [
				buttonBack,
				buttonSpace,
				buttonForward,
				buttonSpace,
				buttonRefresh,
				buttonSpace,
				buttonAction
			];
		
		});
		
		activityIndicator = Ti.UI.createActivityIndicator({
			style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN
		});
		windowBrowser.rightNavButton = activityIndicator;
		
		this.initToolbar();
		
		return (this.modal == true) ? winBase : windowBrowser;
	}
	
	this.initToolbar = function()
	{
		toolbarButtons = Ti.UI.iOS.createToolbar({
			barColor:this.barColor,
			bottom:0,
			height:44
		});
		
		buttonBack = Ti.UI.createButton({
			image:"modules/mini-browser/Icon-Back.png",
			enabled:false
		});
		buttonBack.addEventListener("click", function() {
			webViewBrowser.goBack();
		});
		
		buttonForward = Ti.UI.createButton({
			image:"modules/mini-browser/Icon-Forward.png",
			enabled:false
		});
		buttonForward.addEventListener("click", function() {
			webViewBrowser.goForward();
		});
		
		buttonStop = Ti.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.STOP
		});
		buttonStop.addEventListener("click", function() {
			
			activityIndicator.hide();
			
			webViewBrowser.stopLoading();
		
			buttonBack.enabled = webViewBrowser.canGoBack();
			buttonForward.enabled = webViewBrowser.canGoForward();
			buttonAction.enabled = true;

			actionsDialog.title = webViewBrowser.url;

			toolbarButtons.items = [
				buttonBack,
				buttonSpace,
				buttonForward,
				buttonSpace,
				buttonRefresh,
				buttonSpace,
				buttonAction
			];
		
		});
		
		buttonRefresh = Ti.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
		});
		buttonRefresh.addEventListener("click", function() {
			webViewBrowser.reload();
		});
		
		buttonAction = Ti.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.ACTION,
			enabled:false
		});
		buttonAction.addEventListener("click", function() {
			actionsDialog.show();
		});
		
		buttonSpace = Ti.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
		
		this.initActions();

		windowBrowser.add(toolbarButtons);
	},
	
	this.initActions = function()
	{
		actionsDialog = Ti.UI.createOptionDialog({
			options:["Copiar Link","Abrir no Safari","Enviar Link por e-mail","Cancelar"],
			cancel:3
		});

		actionsDialog.addEventListener("click", function(e) {
			switch(e.index) {
				case 0: 
					Titanium.UI.Clipboard.setText(webViewBrowser.url);
					break;
				case 1: 
					if (Titanium.Platform.canOpenURL(webViewBrowser.url)) {
						Titanium.Platform.openURL(webViewBrowser.url);
					}
					break;
				case 2:
					var emailDialog = Titanium.UI.createEmailDialog({
						barColor:windowBrowser.barColor
					});
					
					emailDialog.subject = windowBrowser.title;
					emailDialog.messageBody = webViewBrowser.url;
					emailDialog.open();
					break;
				default:
					break;
			}
		});
		
	}
}