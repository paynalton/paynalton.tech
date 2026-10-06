A few moments ago, I encountered the following problem.<br><br>An Android application receives a string from a server on the internet with accents encoded using [htmlentities](http://php.net/manual/es/function.htmlentities.php). The result was something like this in the application:<br><br>

> Magnífica oportunidad

The solution was to use [html.fromHtml](http://developer.android.com/reference/android/text/Html.html#fromHtml(java.lang.String))<br><br>String titulo=Html.fromHtml(cadenaDelServidor).toString();<br><br>And the result was:<br><br>

> Magnífica Oportunidad

Good luck with your applications.
