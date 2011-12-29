<h1>What is this?</h1>
<p>This is a mini-browser module to use in Titanium Appcelerator</p>
<h1>How to use it?</h1>
<p>You have just to instance the MiniBrowser to a variable, and <i>create</i> it. It will return a <i>Window</i>, and you can do what you want. See these examples:</p>
<h2>Modal Window</h2>
<pre>var modalBrowser = new MiniBrowser({
	url:"http://www.google.com/",
    barColor:"#000",
    modal:true
});

var winModalBrowser = modalBrowser.create();

winModalBrowser.open();</pre>
<h2>TabGroup</h2>
<pre>var tabGroupedBrowser = new MiniBrowser({
	url:"http://www.google.com/",
    barColor:"#000"
});

Ti.UI.currentTab.open(tabGroupedBrowser.create());</pre>
<h2>Images</h2>
<p align="center"><img src="http://img3.imageshack.us/img3/7131/screenshot20111229at335.png"><img src="http://img194.imageshack.us/img194/3579/screenshot20111229at930.png"></p>