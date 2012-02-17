<h1>What is this?</h1>
<p>This is a mini-browser module to use in Titanium Appcelerator</p>

<h1>How to use it?</h1>
<p>You have just to instance the MiniBrowser to a variable, and <i>create</i> it. It will return a <i>Window</i>, and you can do what you want. See these examples:</p>

<h1>Parameters</h1>
<ul>
	<li><b>url:</b> (STRING) This parameter is the URL to open in the browser</li>
	<li><b>barColor:</b> (STRING) The color of navigationBar and toolbar of the browser (example: #000)</li>
	<li><b>modal:</b> (BOOL) If you wanna open the browser in a modal window, set it as true. Default is false.</li>
	<li><b>showToolbar:</b> (BOOL) If you wanna hide the toolbar of the browser, set it as false. Default is true.</li>
</ul>

<h1>Methods</h1>
<p><b>openBrowser:</b> This method will open your browser (modal or not) in your application.</p>
<p><b>returnBrowser:</b> This method will return the window of your browser, to open with an TabGroup or customize the Window</p>

<h1>Internationalization</h1>
<p>The default strings language in this browser is in English. If you wanna translate the strings, you can use the following ids:</p>
<ul>
	<li>copy_link</li>
	<li>open_safari</li>
	<li>send_by_email</li>
	<li>cancel</li>
	<li>close</li>
</ul>
<p>If you don't know how to internationalize your application, please read this (<a href="https://wiki.appcelerator.org/display/guides/Internationalization">Wiki - Internationalization</a>)</p>

<h1>Examples</h1>
<h2>Modal Window</h2>
<pre>var modalBrowser = new MiniBrowser({
	url:"http://www.google.com/",
    barColor:"#000",
    modal:true
});

modalBrowser.openBrowser();</pre>
<h2>TabGroup</h2>
<pre>var broser = new MiniBrowser({
	url:"http://www.google.com/",
    barColor:"#000"
});

Ti.UI.currentTab.open(browser.returnBrowser());</pre>

<h2>Images</h2>
<p align="center"><img src="http://img3.imageshack.us/img3/7131/screenshot20111229at335.png"><img src="http://img194.imageshack.us/img194/3579/screenshot20111229at930.png"></p>