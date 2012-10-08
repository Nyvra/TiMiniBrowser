# TiMiniBrowser

This is a module to Titanium Appcelerator. It simules a MiniBrowser insides your application, with some options.

## How can I use it?

You have to use it following CommonJS rules. You can open the MiniBrowser in a Modal Window (default), or you can open it in a NavigationGroup or TabGroup. Below you will se examples that simules both.

In Android, always when you will try open MiniBrowser, it will fire an Intent to user. I really believe that this is more apropriate to Android platform.

## Examples

### Modal Window

	var TiMiniBrowser = require("lib/MiniBrowser/TiMiniBrowser");
	
	var browser = new TiMiniBrowser({
		url: "http://www.nyvra.net",
		barColor: "#FF0000"
	});
	
	browser.open();
	
### NavigationGroup or TabGroup

	var TiMiniBrowser = require("lib/MiniBrowser/TiMiniBrowser");
	
	var browser = new TiMiniBrowser({
		url: "http://www.nyvra.net",
		barColor: "#FF0000"
	});
	
	navGroup.open(browser.getWinodow());

## Parameters

* **url***: Here, you set the first URL that your MiniBrowser will open. 
* **barColor**: You can set an hexadecimal color to MiniBrowser barColor. This color will be applied to NavigationBar, Toolbar and EmailDialog. Default is *undefined*.
* **modal**: Here, you set if the Window will be modal or not. If it's not modal, the leftNavButton of Window will be *undefined*, and you can open it using method *getWindow* and opening with a NavigationGroup or a TabGroup. Default is *true*.

## Methods

* **open**: In iOS, this method will simple open the Window (probably Window have to be modal). In Android, will open an Intent.
* **getWindow**: Return the MiniBrowser Window instance, to open with others components (like NavigationGroup and TabGroup).

## Internationalization

The default strings language in this browser is in English. If you wanna translate the strings, you can use the following ids:

* copy_link
* open_browser
* send_by_email
* cancel
* close

If you don't know how to internationalize your application, please read this [https://wiki.appcelerator.org/display/guides/Internationalization](Wiki - Internationalization).

## Images
![TiMiniBrowser](http://img3.imageshack.us/img3/7131/screenshot20111229at335.png "TiMiniBrowser")
![TiMiniBrowser](http://img194.imageshack.us/img194/3579/screenshot20111229at930.png "TiMiniBrowser")

## Issues

* Make a CoffeeScript version of this Module.