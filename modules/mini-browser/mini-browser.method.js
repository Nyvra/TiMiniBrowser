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
	var shareIntent;
	
	var isAndroid = Ti.Platform.osname=="android"? true : false;
	var elementsToPositionInBar = 3;
	var elementsWidth = 44;
	var interSpace = (Ti.Platform.displayCaps.platformWidth - (elementsToPositionInBar * (elementsWidth / 160) * Ti.Platform.displayCaps.dpi)) / (elementsToPositionInBar + 1);
	
	
	function p(pixels){
		var dpixels = (pixels / 160) * Ti.Platform.displayCaps.dpi;
		return dpixels;
	}
	
	this.create = function()
	{
		windowBrowser = Ti.UI.createWindow({
			barColor:this.barColor,
			backgroundColor:"#FFF"
		});
		alert(this.modal);
		if (this.modal == true) 
		{
			winBase = Ti.UI.createWindow({
				navBarHidden:true,
				modal:false
			});
			
			if(!isAndroid){
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
				});
			}
			else{
				nav = Ti.UI.createView({
					backgroundColor: this.barColor,
					width: "100%",
					height: "44dp",
					top: 0,
					left: 0
				});
				winBase.add(nav);
				
				buttonCloseWindow = Ti.UI.createButton({
					title: "Close",
					height: "30dp",
					width: "80dp",
					top: "5dp",
					left: "15dp"
				});
				buttonCloseWindow.addEventListener("click", function() {
					winBase.close();
				});
				nav.add(buttonCloseWindow);
				
				
			}
			
		}
		
		webViewBrowser = Ti.UI.createWebView({
			url:this.url,
			left:0,
			top:0,
			bottom:"44dp",
			width:"100%",
			loading:false
		});
		windowBrowser.add(webViewBrowser);
		
		webViewBrowser.addEventListener("load", function() {
			
			activityIndicator.hide();
			
			if(!isAndroid) windowBrowser.title = webViewBrowser.evalJS("document.title");
		
			buttonBack.enabled = webViewBrowser.canGoBack();
			buttonForward.enabled = webViewBrowser.canGoForward();
			buttonAction.enabled = true;
			
			if(!isAndroid){
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
			}
		
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
			style: isAndroid? null : Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN
		});
		if(!isAndroid) windowBrowser.rightNavButton = activityIndicator;
		
		this.initToolbar();
		
		return (this.modal == true) ? winBase : windowBrowser;
	}
	
	this.initToolbar = function()
	{
		if(!isAndroid){
			toolbarButtons = Ti.UI.iOS.createToolbar({
				barColor:this.barColor,
				bottom:0,
				height:44
			});
		}
		else{
			toolbarButtons = Ti.UI.createView({
				backgroundColor: this.barColor,
				bottom: 0,
				height: "44dp",
				width: "100%",
				left: 0
			});
		}
		if(!isAndroid){
			buttonBack = Ti.UI.createButton({
				image:"modules/mini-browser/Icon-Back.png",
				enabled:false
			});
		}
		else{
			buttonBack = Ti.UI.createView({
				left : 0,
				width : "44dp",
				top : "0dp",
				height : "44dp",
				backgroundImage : "modules/mini-browser/android_back.png"
			});
		}
		buttonBack.addEventListener("click", function() {
			webViewBrowser.goBack();
		});
		
		
		if(!isAndroid){
			buttonForward = Ti.UI.createButton({
				image:"modules/mini-browser/Icon-Forward.png",
				enabled:false
			});
		}
		else{
			buttonForward = Ti.UI.createView({
				left : interSpace + p(44),
				width : "44dp",
				top : "0dp",
				height : "44dp",
				backgroundImage : "modules/mini-browser/android_forward.png"
			});
		}
		buttonForward.addEventListener("click", function() {
			webViewBrowser.goForward();
		});
		
		
		if(!isAndroid){
			buttonStop = Ti.UI.createButton({
				systemButton:isAndroid? null : Titanium.UI.iPhone.SystemButton.STOP
			});
		}
		if(isAndroid){
			buttonStop = Ti.UI.createView({});
			with(buttonStop){
				backgroundImage = "androidcancel.png";
				height = "34dp";
				width = "34dp";
				top = "5dp";
				left = (interSpace * 2) + p(44+44);
			}
			
		}
		buttonStop.addEventListener("click", function() {
			
			activityIndicator.hide();
			
			webViewBrowser.stopLoading();
		
			buttonBack.enabled = webViewBrowser.canGoBack();
			buttonForward.enabled = webViewBrowser.canGoForward();
			buttonAction.enabled = true;

			actionsDialog.title = webViewBrowser.url;
			
			if(!isAndroid){
			toolbarButtons.items = [
				buttonBack,
				buttonSpace,
				buttonForward,
				buttonSpace,
				buttonRefresh,
				buttonSpace,
				buttonAction
			];
			}
		
		});
		if(!isAndroid){
			buttonRefresh = Ti.UI.createButton({
				systemButton:isAndroid? null : Titanium.UI.iPhone.SystemButton.REFRESH
			});
		}
		if(isAndroid){
			buttonRefresh = Ti.UI.createView({
				backgroundColor : "black",
				backgroundImage : "modules/mini-browser/android_refresh.png",
				height : "44dp",
				width : "44dp",
				top : "0dp",
				left : (interSpace * 2) + p(44+44)	
			});
		}
		buttonRefresh.addEventListener("click", function() {
			webViewBrowser.reload();
		});
		
		if(!isAndroid){
		buttonAction = Ti.UI.createButton({
			systemButton:isAndroid? null : Titanium.UI.iPhone.SystemButton.ACTION,
			enabled:false
		});
		}
		if(isAndroid){
			buttonAction = Ti.UI.createView({
				backgroundImage : "modules/mini-browser/android_share.png",
				height : "48dp",
				width : "48dp",
				top : "0dp",
				left : (interSpace * 3) + p(44 * 3),
				enabled : false
			});
		}
		buttonAction.addEventListener("click", function() {
			if(!isAndroid) actionsDialog.show();
			else Ti.Android.currentActivity.startActivity(shareIntent);
		});
		
		
		if(!isAndroid){
			buttonSpace = Ti.UI.createButton({
				systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
			});
		}
		
		if(isAndroid){
			toolbarButtons.add(buttonBack);
			toolbarButtons.add(buttonForward);
			toolbarButtons.add(buttonRefresh);
			toolbarButtons.add(buttonAction); 
		}
		
		this.initActions();

		windowBrowser.add(toolbarButtons);
	},
	
	this.initActions = function(){
		if(!isAndroid){
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
		else{
			shareIntent = (function createShareIntent(){
			var subject = "";
    		var text = this.url;
 
		    var intent = Ti.Android.createIntent({
		        action: Ti.Android.ACTION_SEND,
		        type: "text/plain",
		    });
		    intent.putExtra(Ti.Android.EXTRA_TEXT,text);
		    intent.putExtra(Ti.Android.EXTRA_SUBJECT,subject);
		    
		    var share = Ti.Android.createIntentChooser(intent,'Share');
		    
		    return share;
		    
		    })();
 			
 			
    		
		}
	}
}