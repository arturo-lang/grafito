
<p align="center"><img align="center" width="350" src="https://raw.githubusercontent.com/arturo-lang/grafito/master/logo.png"/></p>
<p align="center">
  <b>Portable, Serverless & Lightweight<br>SQLite-based Graph Database</b>
  <br><br>
  <img src="https://img.shields.io/github/license/arturo-lang/grafito?style=flat-square">
  <img src="https://img.shields.io/badge/language-Arturo-orange.svg?style=flat-square">
</p>

---

<p align="center"><img align="center" src="https://raw.githubusercontent.com/arturo-lang/grafito/master/screenshot.png"/></p>

## Try Grafito!

After having installed the latest version of [Arturo](https://github.com/arturo-lang/arturo), clone this repo
and simply go to the folder via your terminal.

Then, run one of the examples:

```
arturo examples/sample3.art
```

Or, fire up the interactive console:

```
./grafito.art
```

(If you pass a name, it will use it as your database file. If not, the database will be in-memory)

And you can see your lightweight graph engine in action!

## How to

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

### Preview a set of Nodes

```
graph "mygraph" [
	preview fetch 'person ø ø
]
```

(If you run the `sample3` in the *examples* folder, the image you'll get is the one you see above ;-))

## Command Reference

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
     <ins>source</ins> <i>:dictionary</i> (node)
     <ins>target</ins> <i>:dictionary</i> (node)
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

