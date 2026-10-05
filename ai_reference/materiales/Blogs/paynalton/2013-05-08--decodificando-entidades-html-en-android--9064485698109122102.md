---
title: "Decodificando Entidades HTML en android"
date: "2013-05-08T20:19:00.000-07:00"
updated: "2013-05-08T20:19:43.016-07:00"
original_url: "https://paynalton.blogspot.com/2013/05/decodificando-entidades-html-en-android.html"
blog: "Paynalton"
blog_url: "https://paynalton.blogspot.com/"
blogger_id: "tag:blogger.com,1999:blog-8745616242045931201.post-9064485698109122102"
authors: ["Paynalton"]
tags: ["android", "java", "Strings", "trucos"]
editorial:
  id: M072
  category: tecnicos
  tags:
  - texto-tecnico
  - nota-tecnica
  - programacion
  - android
---

Hace unos momentos se me presentó la siguiente dificultad.<br><br>Una aplicación Android recibe una cadena desde un servidor en internet con acentos codificados con [htmlentities](http://php.net/manual/es/function.htmlentities.php). El resultado era algo así en la aplicación:<br><br>

> Magnífica oportunidad

La solución fue utilizar [html.fromHtml](http://developer.android.com/reference/android/text/Html.html#fromHtml(java.lang.String))<br><br>String titulo=Html.fromHtml(cadenaDelServidor).toString();<br><br>Y el resultado fue:<br><br>

> Magnífica Oportunidad

Suerte con sus aplicaciones.
