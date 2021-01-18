
<p align="center"><img align="center" width="350" src="https://raw.githubusercontent.com/arturo-lang/grafito/master/logo.png"/></p>
<p align="center">
  <b>Portable, Serverless & Lightweight<br>SQLite-based Graph Database</b>
  <br><br>
  <img src="https://img.shields.io/github/license/arturo-lang/grafito?style=flat-square">
  <img src="https://img.shields.io/badge/language-Arturo-orange.svg?style=flat-square">
  <img src="https://img.shields.io/github/workflow/status/arturo-lang/grafito/Run%20Tests?style=flat-square">
</p>

<p align="center"><img width="90%" align="center" src="https://raw.githubusercontent.com/arturo-lang/grafito/master/screenshot.png"/></p>

---

<!--ts-->

* [At A Glance](#at-a-glance)
* [Try Grafito](#try-grafito)
    * [Docker](#docker)
    * [As a Library](#as-a-library)
    * [As a Standalone tool](#as-a-standalone-tool)
* [How To](#how-to)
    * [Create a simple Node](#create-a-simple-node)
    * [Create Relationships between Nodes](#create-relationships-between-nodes)
    * [Search Nodes](#search-nodes)
    * [Delete an existing Node](#delete-an-existing-node)
    * [Delete an existing Relationship](#delete-an-existing-relationship)
    * [More complex queries](#more-complex-queries)
    	* [Using filters](#using-filters)
    * [Preview a Set of Nodes](#preview-a-set-of-nodes)
* [Command Reference](#command-reference)
    * [put](#put)
    * [unput](#unput)
    * [link](#link)
    * [unlink](#unlink)
    * [what](#what)
    * [fetch](#fetch)
    * [preview](#preview)
* [Community](#community)
* [License](#license)   

<!--te-->

---

## At A Glance

I know you really don't care about long explanations and want to have a look at working code right away, so... here you are (this is the code the creates the graph in the image above):

```red
do.import {grafito.art}

do [
    graph.create "sample4" [
        uk: put 'country #[name: "United Kingdom"]
        au: put 'country #[name: "Australia"]
        us: put 'country #[name: "United States"] 
        ca: put 'country #[name: "Canada"]

        nolan: put 'person #[name: "Christopher Nolan" birthday: 1970 sex: "m"]
        pearce: put 'person #[name: "Guy Pearce" birthday: 1967 sex: "m"]
        hanson: put 'person #[name: "Curtis Hanson" birthday: 1945 sex: "m"]
        spacey: put 'person #[name: "Kevin Spacey" birthday: 1959 sex: "m"]
        dicaprio: put 'person #[name: "Leonardo DiCaprio" birthday: 1974 sex: "m"]
        moss: put 'person #[name: "Carrie-Ann Moss" birthday: 1967 sex: "f"]

        wach1: put 'person #[name: "Lana Wachowski" birthday: 1965 sex: "f"]
        wach2: put 'person #[name: "Lilly Wachowski" birthday: 1967 sex: "f"]

        memento: put 'movie #[title: "Memento" year: 2000]
        inception: put 'movie #[title: "Inception" year: 2010]
        laconfidential: put 'movie #[title: "L.A. Confidential" year: 1997]
        matrix: put 'movie #[title: "The Matrix" year: 1999]

        link'isFrom nolan uk
        link'isFrom pearce au
        link'isFrom @[hanson spacey dicaprio wach1 wach2] us
        link'isFrom moss ca

        link'directed nolan @[memento inception]
        link'directed hanson laconfidential
        link'directed @[wach1 wach2] matrix
        link'actedIn pearce @[memento laconfidential]
        link'actedIn spacey laconfidential
        link'actedIn dicaprio inception
        link'actedIn moss @[memento matrix]
        

        preview fetch 'person øø
    ]
]
```

## Try Grafito!

### Docker

The easiest way to try Grafito is using Docker (although, without support for the Desktop app - yet)

```
docker run -it arturolang/grafito
```

or, if you want to run a specific script:

```
docker run -it -v $(pwd):/home arturolang/grafito <yourscript>
```

### As a Library

After having installed the latest version of [Arturo](https://github.com/arturo-lang/arturo), clone this repo
and simply go to the folder via your terminal.

Then, run one of the examples:

```
arturo examples/sample3.art
```

### As a Standalone tool

Or, fire up the interactive console:

```
./grafito.art
```

(If you pass a name, it will use it as your database file. If not, the database will be in-memory)

<p align="center"><img width="100%" align="center" src="https://raw.githubusercontent.com/arturo-lang/grafito/master/console.png"/></p>

And you can see your lightweight graph engine in action!

## How To

### Create a simple Node

```
graph.create "mygraph" [
	put 'person #[name: "John" sex: 'm]
]
```

### Create Relationships between Nodes

```
graph.create "mygraph" [
	john: put 'person #[name: "John" sex: 'm]
	joan: put 'person #[name: "Joan" sex: 'f]

	link 'marriedTo john joan
]
```

### Search Nodes

```
graph "mygraph" [
	inspect what 'person #[name: "Joan"] #[]
]
```


### Delete an existing Node

```
graph "mygraph" [
	unput what'person #[name: "John"] ø
]
```

### Delete an existing Relationship

```
graph "mygraph" [
	unlink'marriedTo what'person #[name: "John"] ø
                     what'person #[name: "Joan"] ø
]
```

### More complex queries

```
graph "mygraph" [
	inspect fetch 'person #[sex: "m"] #[
		marriedTo: what 'person #[name: "Joan"] #[]
	]
]
```

#### Using filters

```
graph "mygraph" [
	fetch'person [
		surname:"Doe"
		age: -> greater: 30
	] ø
]
```

### Preview a Set of Nodes

```
graph "mygraph" [
	preview fetch 'person ø ø
]
```

(If you run the `sample4` in the *examples* folder, you'll be a minimal movie database. Running the command `preview` will open up the Desktop app with the image you see above ;-))

## Command Reference

All of the following commands must run within a `graph` environment. In order to set it up, use:

```
graph <database> [
	;; your code goes here
]
```
> ⚠️  The `graph` command is not needed when you run Grafito as a tool, since the "environment" is already set up for you. ;-) 

If you pass `null` (or `ø`) then the database will be *in-memory*. If you want to save to a file on disk, then pass a string with the desired database name. If the database already exists, it will be re-opened. If not, it will be created from scratch.

> 💡  You may force the database to be re-created from scratch, regardless of whether it exists, by setting the `.create` attribute. E.g.
> ```
> graph.create "mygraph" [
> 	;; your code goes here
> ]
> ```

### put

#### Description

Create a new node of given type and with given properties.

#### Usage

<pre>
<b>put</b> <ins>type</ins> <i>:literal</i>
    <ins>properties</ins> <i>:dictionary</i>
</pre>

#### Returns

- *:dictionary* (node)

#### Examples

```red
put 'person #[name: "John" surname: "Doe" birthday: 1986]
```

### unput

#### Description

Delete given node

#### Usage

<pre>
<b>unput</b> <ins>node</ins> <i>:dictionary</i>
</pre>

#### Examples

```red
x: put 'person #[name: "John" surname: "Doe" birthday: 1986]
unput x
```

### link

#### Description

Create a new relationship of given type between given nodes.

#### Usage

<pre>
<b>link</b> <ins>type</ins> <i>:literal</i>
     <ins>source</ins> <i>:dictionary</i> (node), <i>:block</i> of <i>:dictionary</i> (node)
     <ins>target</ins> <i>:dictionary</i> (node), <i>:block</i> of <i>:dictionary</i> (node)
</pre>

#### Returns

- *:dictionary* (edge)

#### Examples

```red
link 'marriedTo put 'person #[name: "John" surname: "Doe" birthday: 1986] 
                put 'person #[name: "Mary" surname: "Doe" birthday: 1986]
```

### unlink

#### Description

Delete given relationship between given nodes

#### Usage

<pre>
<b>unlink</b> <ins>type</ins> <i>:literal</i>
       <ins>source</ins> <i>:dictionary</i> (node)
       <ins>target</ins> <i>:dictionary</i> (node)
</pre>

#### Examples

```red
x: put 'person #[name: "John" surname: "Doe" birthday: 1986]
y: put 'person #[name: "Mary" surname: "Doe" birthday: 1986]
link 'marriedTo x y
unlink 'marriedTo x y
```

### what

#### Description

Get the first node of given type, that satisfies all of given properties and relationships

#### Usage

<pre>
<b>what</b> <ins>type</ins> <i>:literal</i>
     <ins>properties</ins> <i>:dictionary</i> <i>:null</i>
     <ins>relationships</ins> <i>:dictionary</i> <i>:null</i>
</pre>

#### Returns

- *:dictionary* (node)

#### Examples

```red
print what 'person #[name: "John"] #[]
```

### fetch

#### Description

Get all nodes of given type, that satisfy all of given properties and relationships

#### Usage

<pre>
<b>fetch</b> <ins>type</ins> <i>:literal</i>
      <ins>properties</ins> <i>:dictionary</i> <i>:null</i>
      <ins>relationships</ins> <i>:dictionary</i> <i>:null</i>
</pre>

#### Returns

- *:block* of *:dictionary* (node)

#### Examples

```red
print fetch 'person #[surname: "Doe"] #[]
print fetch 'person #[surname: "Doe"] #[marriedTo: what'person #[name: "Mary"]#[]]
```

### preview

#### Description

Preview given array of nodes in Desktop app.

#### Usage

<pre>
<b>preview</b> <ins>nodes</ins> <i>:block</i>
</pre>

#### Examples

```red
preview fetch 'person #[surname: "Doe"] #[]
```

Community
------------------------------

In case you want to ask a question, suggest an idea, or practically anything related to Grafito (or Arturo) - feel free! Everything and everyone is welcome.

For that, the most convenient place for me would be the [GitHub Issues](https://github.com/arturo-lang/grafito/issues) page.

[![Stargazers over time](https://starchart.cc/arturo-lang/grafito.svg)](https://starchart.cc/arturo-lang/grafito)

## License

MIT License

Copyright (c) 2021 Yanis Zafirópulos

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

