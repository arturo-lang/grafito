
<p align="center"><img align="center" width="350" src="https://raw.githubusercontent.com/arturo-lang/grafito/master/logo.png"/></p>
<p align="center">
  <b>Portable, Serverless & Lightweight<br>SQLite-based Graph Database</b>
  <br><br>
  <img src="https://img.shields.io/github/license/arturo-lang/grafito?style=flat-square">
  <img src="https://img.shields.io/badge/language-Arturo-orange.svg?style=flat-square">
</p>

---

## Try Grafito!

After having installed the latest version of [Arturo](https://github.com/arturo-lang/arturo), clone this repo
and simple go to the folder via your terminal.

Then:

```
arturo examples/sample1.art
```

And you can see your lightweight graph engine in action!

## How to

### Create a simple Node

```
graph.create "mygraph" [
	is 'person #[name: "John" sex: 'm]
]
```

### Create Relationships between Nodes

```
graph.create "mygraph" [
	john: is 'person #[name: "John" sex: 'm]
	joan: is 'person #[name: "Joan" sex: 'f]

	link john 'marriedTo joan
]
```

### Search Nodes

```
graph "mygraph" [
	inspect fetch 'person #[name: "Joan"] #[]
]
```

### More complex queries

```
graph "mygraph" [
	inspect fetchAll 'person #[sex: "m"] #[
		marriedTo: fetch 'person #[name: "Joan"] #[]
	]
]
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

