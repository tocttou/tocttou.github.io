---
title: Making an automated content downloader using Fiddler
---

There are times when you want to download some video but it is available only for streaming. You can use various online video downloaders for that purpose and they work well enough for popular websites. What if you want to do a batch download? There are plenty of video download managers available online and most of them are malware vectors like [this chrome extension](http://rdiodownloader.com/) which has obfuscated javascript so you don't even know what it is doing in the background. Another solution is to write a scrapper in your favourite scripting language.

I'll introduce you to another way to download videos/songs automatically in the background while you enjoy the content using [Fiddler](http://www.telerik.com/fiddler). Fiddler is an awesome tool to inspect inbound/outbound data from your devices and play with it. In this post we'll make a video downloader (**Windows alert!**) Fiddler add-on for [Vimeo](https://vimeo.com/) but it can also be extended for other websites given that they use ['Progressive Download' and not 'Streaming'](http://www.onlinevideo.net/2011/05/streaming-vs-progressive-download-vs-adaptive-streaming/) but most popular services use streaming server these days. Lynda.com (and another e-learing service which I subscribe to so I won't name it), to my surprise, uses progressive download.

**Objective:**

* Whenever we start a video at vimeo.com, the application will download and store the video at a pre-specified location in background.

Lets get started.

First of all we'll need Fiddler2. Dowload it from [here](http://www.telerik.com/download/fiddler/fiddler2). Fire up Visual Studio (any version will do) and create a new project. Select `Class Library` targeted at **.Net Framework 3.5** from the installed templates.

![Create a new app]({{ site.baseurl}}images/posts/create_app.png)

Open `Solutions Explorer` pane from `View` menu -> `Solutions Explorer`. Right click `VimeoDownloader` project and add Fiddler.exe as a resource (typically found at `C:\Program Files (x86)\Fiddler2`) as shown in the image.

![adding Fiddler.exe as a resource]({{ site.baseurl}}images/posts/fiddler_reference.png)

Edit `AssemblyInfo.cs` and add reference to Fiddler as shown in the image.

![Assembly.cs]({{ site.baseurl}}images/posts/assembly.png)

We will now implement the two interfaces Fiddler provides, namely 'IAutoTamper' and 'IFiddlerExtension'. Open `Class1.cs` file and edit it to add the basic structure like in this gist. Edit the value of `downDir` variable accordingly.

<script src="https://gist.github.com/yankee101/c7af43bfd92b0df02e48.js"></script>

Make a new class named `Vimeo` with variables `url` and `downloadPath` and a constructor to initialise them.


{% highlight java linenos %}
private string url, downloadPath;
public Vimeo(string url, string downloadPath)
{
    this.url = url;
    this.downloadPath = downloadPath;
}
{% endhighlight %}

<br>

Also add a function `Download` to the class `Vimeo` that implements downloading.

{% highlight java linenos %}
public void Download()
{
    var webClient = new WebClient();
    webClient.DownloadFileAsync(new Uri(url), downloadPath);
}
{% endhighlight %}

<br>

Let us now find out the URL for the video stream. Chrome dev-tools tell us that the videos on Vimeo either have domain `vimeocdn.com` or `akamaihd.net`. If a browser makes http requests to either of the two domains, and the URI contains '.mp4', we will initiate a download. Here is the implemention of `AutoTamperRequestBefore` function (which tampers requests before forwarding it to websites) in `Class1`.  File name is derived from a part of the URL.

**Note:** It is recommended to use Fiddler to inspect the requests instead of chrome-dev tools.



{% highlight java linenos %}
public void AutoTamperRequestBefore(Session oSession)
{
    if (oSession.uriContains("vimeocdn.com") || oSession.uriContains("akamaihd.net"))
    {
        if (oSession.uriContains(".mp4"))
        {
            var spl = oSession.url.Split('/');
            var vid_name = spl[5].Split('.')[0];
            var file = downDir + vid_name + ".mp4";
            if (!File.Exists(file))
            {
                var vimeo = new Vimeo("https://" + oSession.url, file);
                var thread = new Thread(new ThreadStart(vimeo.Download));
                thread.Start();
            }
        }
    }
}
{% endhighlight %}

<br>

Notice that we have used `"https://" + oSession.url` as a parameter to instantiate the Vimeo class. We can use `http://` as well and it would work if you load the video directly in the browser but won't work if you load it through vimeo.com as it uses HTTP Strict Transport Security (HSTS). A workaround is to configure Fiddler to decrypt HTTPS traffic. The option can be activated from within Fiddler -> `Tools` menu -> `Fiddler Options` -> `HTTPS` tab -> `Decrypt HTTPS traffic`.

![decrypt HTTPS]({{ site.baseurl}}images/posts/decrypt.png)

 It will ask you to add a root certificate generated by Fiddler.

![trust Fiddler?]({{ site.baseurl}}images/posts/trust.png)

 [**Trust Fiddler at your own risk!**](http://security.stackexchange.com/a/65976) **but you must trust it if you want this program to work at all**. It is better to add these certificates when you want to download content from a site that uses https and remove them afterwards. It is a clumsy process but better safe than sorry.

**Note:** If you want to download tutorials from lynda.com (with a limited subscription that only allows streaming), just change

{% highlight java linenos %} oSession.uriContains("vimeocdn.com") || oSession.uriContains("akamaihd.net") {% endhighlight %} 
<br>
=>

{% highlight java linenos %} oSession.uriContains("files2.lynda.com") || oSession.uriContains("files3.lynda.com"). {% endhighlight %}

<br>

 Use `"http://" + oSession.url` with lynda.com as both the cdn and site use http. So you do not even need to add Fiddler's root certificates. Also change the code to save tutorials with a better filename and preferably organised in separate folders as per the course.

Here is the final `Class1.cs` file:

<script src="https://gist.github.com/yankee101/ff718917dd27d85c21a0.js"></script>

Now that we have written the code, build it. The generated files can be found in `\bin\Debug` in your project directory, for example `C:\Users\Ashish\Documents\Visual Studio 2015\Projects\VimeoDownloader\VimeoDownloader\bin\Debug`. Copy all files from this folder to the `Scripts` folder in your Fiddler installation, typically found at `C:\Program Files (x86)\Fiddler2\Scripts`.

Thats it! Just run fiddler now, minimise it, and start watcing videos on vimeo.com from your browser. All videos will get downloaded in the background to the specified directory as you enjoy your content.

In the coming weeks, I'll write some posts about using Fiddler to test the security of your webapps & APIs. So many things to write about, not enough  ink :p
