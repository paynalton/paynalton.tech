Hace unos momentos se me presentó la siguiente dificultad.<br><br>Una aplicación Android recibe una cadena desde un servidor en internet con acentos codificados con [htmlentities](http://php.net/manual/es/function.htmlentities.php). El resultado era algo así en la aplicación:<br><br>

> Magnífica oportunidad

La solución fue utilizar [html.fromHtml](http://developer.android.com/reference/android/text/Html.html#fromHtml(java.lang.String))<br><br>String titulo=Html.fromHtml(cadenaDelServidor).toString();<br><br>Y el resultado fue:<br><br>

> Magnífica Oportunidad

Suerte con sus aplicaciones.
