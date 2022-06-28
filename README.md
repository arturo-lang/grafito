
<p align="center"><img align="center" width="350" src="https://raw.githubusercontent.com/arturo-lang/grafito/master/logo.png"/></p>
<p align="center">
  <b>Portable, Serverless & Lightweight<br>SQLite-based Graph Database</b>
  <br><br>
  <img src="https://img.shields.io/github/license/arturo-lang/grafito?style=for-the-badge">
  <img src="https://img.shields.io/badge/language-Arturo-orange.svg?style=for-the-badge">
  <img src="https://img.shields.io/github/workflow/status/arturo-lang/grafito/Build%20%26%20Test?style=for-the-badge">
</p>

<p align="center"><img width="90%" align="center" src="https://raw.githubusercontent.com/arturo-lang/grafito/master/ui-screenshot.png"/></p>

--- 

<!--ts-->

* [At A Glance](#at-a-glance)
* [Try Grafito](#try-grafito)
    * [Docker](#docker)
    * [Installation](#installation)
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
* [Filter Reference](#filter-reference)
    * [contains](#contains)
    * [less](#less)
    * [greater](#greater)
    * [lessOrEqual](#lessOrEqual)
    * [greaterOrEqual](#greaterOrEqual)
    * [not](#not)
    * [in](#in)
* [Community](#community)
* [License](#license)   

<!--te-->
 
---

## At A Glance

I know you really don't care about long explanations and want to have a look at working code right away, so... here you are (this is the code that creates the graph in the image above):

```red
;---------------------------------------------
; Import Grafito
; and ... let's rock'n'roll! :)
;---------------------------------------------
do.import {grafito.art}

do [
    ;---------------------------------------------
    ; Set up a new graph environment
    ; with a local database named "sample11"
    ;---------------------------------------------
    graph .helpers: [person movie country book]
          .create
          .palette: 'default
          "sample11" 
    [
        unless dbExists? [
            ;---------------------------------------------
            ; Populate the database
            ;---------------------------------------------

            uk: country.new [name: "United Kingdom"]
            au: country.new [name: "Australia"]
            us: country.new [name: "United States"] 
            ca: country.new [name: "Canada"]
            fr: country.new [name: "France"]
            de: country.new [name: "Germany"]
            se: country.new [name: "Sweden"]
            es: country.new [name: "Spain"]
            pl: country.new [name: "Poland"]

            nolan:      person.new [name: "Christopher Nolan" birthday: 1970 sex: "m"]
            pearce:     person.new [name: "Guy Pearce" birthday: 1967 sex: "m"]
            hanson:     person.new [name: "Curtis Hanson" birthday: 1945 sex: "m"]
            spacey:     person.new [name: "Kevin Spacey" birthday: 1959 sex: "m"]
            dicaprio:   person.new [name: "Leonardo DiCaprio" birthday: 1974 sex: "m"]
            hardy:      person.new [name: "Tom Hardy" birthday: 1977 sex: "m"]
            cotillard:  person.new [name: "Marion Cotillard" birthday: 1975 sex: "f"]
            moss:       person.new [name: "Carrie-Ann Moss" birthday: 1967 sex: "f"]
            kidman:     person.new [name: "Nicole Kidman" birthday: 1967 sex: "f"]
            cruise:     person.new [name: "Tom Cruise" birthday: 1962 sex: "m"]
            kubrick:    person.new [name: "Stanley Kubrick" birthday: 1928 died: 1999 sex: "m" alive: false]
            burton:     person.new [name: "Tim Burton" birthday: 1958 sex: "m"]
            depp:       person.new [name: "Johny Depp" birthday: 1965 sex: "m"]
            hallstrom:  person.new [name: "Lasse Hallström" birthday: 1946 sex: "m"]
            scorsese:   person.new [name: "Martin Scorsese" birthday: 1942 sex: "m"]
            sydow:      person.new [name: "Max von Sydow" birthday: 1929 died: 2020 sex: "m" alive: false]
            binoche:    person.new [name: "Juliette Binoche" birthday: 1964 sex: "f"]
            dench:      person.new [name: "Judi Dench" birthday: 1934 sex: "f"]
            eastwood:   person.new [name: "Clint Eastwood" birthday: 1930 sex: "m"]
            polanski:   person.new [name: "Roman Polanski" birthday: 1933 sex: "m"]
            olin:       person.new [name: "Lena Olin" birthday: 1955 sex: "f"]
            zimmer:     person.new [name: "Hans Zimmer" birthday: 1957 sex: "m"]
            pook:       person.new [name: "Jocelyn Pook" birthday: 1960 sex: "f"]
            lehane:     person.new [name: "Dennis Lehane" birthday: 1965 sex: "m"]
            penn:       person.new [name: "Sean Penn" birthday: 1960 sex: "m"]
            malick:     person.new [name: "Terrence Malick" birthday: 1943 sex: "m"]
            brody:      person.new [name: "Adrien Brody" birthday: 1973 sex: "m"]
            wach1:      person.new [name: "Lana Wachowski" birthday: 1965 sex: "f"]
            wach2:      person.new [name: "Lilly Wachowski" birthday: 1967 sex: "f"]

            memento:        movie.new [title: "Memento" year: 2000]
            inception:      movie.new [title: "Inception" year: 2010]
            laconfidential: movie.new [title: "L.A. Confidential" year: 1997]
            matrix:         movie.new [title: "The Matrix" year: 1999]
            eyes:           movie.new [title: "Eyes Wide Shut" year: 1999]
            bigfish:        movie.new [title: "Big Fish" year: 2003]
            sleepyhollow:   movie.new [title: "Sleepy Hollow" year: 1999]
            chocolat:       movie.new [title: "Chocolat" year: 2000]
            jedgar:         movie.new [title: "J. Edgar" year: 2011]
            ninthgate:      movie.new [title: "The Ninth Gate" year: 1999]
            shutter:        movie.new [title: "Shutter Island" year: 2010]
            mystic:         movie.new [title: "Mystic River" year: 2003]
            redline:        movie.new [title: "Thin Red Line" year: 1998]
            pianist:        movie.new [title: "The Pianist" year: 2002]

            mysticB:        book.new [title: "Mystic River" year: 2001 language: "en"]

            ;---------------------------------------------
            ; Define the relationships
            ; between our nodes
            ;---------------------------------------------

            [nolan hardy dench pook] ~> 'isFrom uk
            [pearce kidman] ~> 'isFrom au
            [malick brody hanson spacey dicaprio wach1 wach2 cruise kubrick burton depp eastwood scorsese lehane penn] ~> 'isFrom us
            moss ~> 'isFrom ca
            [cotillard binoche] ~> 'isFrom fr
            polanski ~> 'isFrom [fr pl]
            [hallstrom olin sydow] ~> 'isFrom se
            zimmer ~> 'isFrom de

            nolan ~> 'directed [memento inception]
            hanson ~> 'directed laconfidential
            [wach1 wach2] ~> 'directed matrix
            kubrick ~> 'directed eyes
            burton ~> 'directed [bigfish sleepyhollow]
            hallstrom ~> 'directed chocolat
            eastwood ~> 'directed [jedgar mystic]
            polanski ~> 'directed [pianist ninthgate]
            scorsese ~> 'directed shutter
            malick ~> 'directed [pianist redline]

            pearce ~> 'actedIn [memento laconfidential]
            spacey ~> 'actedIn laconfidential
            [dicaprio hardy cotillard] ~> 'actedIn inception
            [dicaprio sydow] ~> 'actedIn shutter
            cotillard ~> 'actedIn bigfish
            moss ~> 'actedIn [memento matrix chocolat]
            [cruise kidman] ~> 'actedIn eyes
            depp ~> 'actedIn [chocolat sleepyhollow]
            [binoche dench olin] ~> 'actedIn chocolat
            [dicaprio dench] ~> 'actedIn jedgar
            [depp olin] ~> 'actedIn ninthgate
            penn ~> 'actedIn [mystic redline]
            brody ~> 'actedIn [redline pianist]

            zimmer ~> 'composed inception
            pook ~> 'composed eyes

            nolan ~> 'written inception

            lehane ~> 'written mysticB
            mystic ~> 'basedOn mysticB

            [redline bigfish memento laconfidential jedgar shutter mystic] ~> 'origin us
            matrix ~> 'origin [us au]
            [inception eyes chocolat] ~> 'origin [uk us]
            sleepyhollow ~> 'origin [us de]
            ninthgate ~> 'origin [us fr es]
            pianist ~> 'origin [uk fr de pl]

            wach1 ~> 'sibling wach2
            cruise ~> 'married kidman
        ]

        ;---------------------------------------------
        ; Fetch every "person" &
        ; open the Desktop app for visualization
        ;---------------------------------------------
        
        preview fetch 'person ø
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

### Installation

To install local, first you have to have installed the latest version of [Arturo](https://github.com/arturo-lang/arturo).

Then, just clone this repo and simply go to the folder via your terminal.


#### As a Library

After having installed the latest version of Arturo, you can use Grafito from any Arturo script as a library.

For example, here's how to run the above example:

```
arturo examples/sample11.art
```

#### As a Standalone tool

Of course, you can also run Grafito as a tool on it own:

```
./grafito.art <database>
```

(If you pass a name, it will use it as your database file. If not, the database will be in-memory)

<p align="center"><img width="100%" align="center" src="https://raw.githubusercontent.com/arturo-lang/grafito/master/console-screenshot.png"/></p>

And you can see your lightweight graph engine in action!

## How To

### Create a simple Node

```red
graph.create "mygraph" [
	put'person [name: "John" sex: 'm]
]
```

### Create Relationships between Nodes

```red
graph.create "mygraph" [
	john: put 'person [name: "John" sex: 'm]
	joan: put 'person [name: "Joan" sex: 'f]

	link john 'marriedTo joan
]
```

### Search Nodes

```red
graph "mygraph" [
	inspect fetch 'person [name: "Joan"]
]
```


### Delete an existing Node

```red
graph "mygraph" [
	unput fetch 'person [name: "John"]
]
```

### Delete an existing Relationship

```red
graph "mygraph" [
	unlink fetch 'person [name: "John"] 'marriedTo 
           fetch 'person [name: "Joan"]
]
```

### More complex queries

```red
graph "mygraph" [
	inspect fetch'person [
		sex: "m"
		marriedTo: fetch 'person [name: "Joan"]
	]
]
```

#### Using filters

```red
graph "mygraph" [
	fetch 'person [
		surname:"Doe"
		age: -> greater: 30
	]
]
```

### Preview a Set of Nodes

```red
graph "mygraph" [
	preview fetch 'person ø
]
```

(If you run the `sample4` in the *examples* folder, you'll be a minimal movie database. Running the command `preview` will open up the Desktop app with the image you see above ;-))

## Command Reference

All of the following commands must run within a `graph` environment. In order to set it up, use:

```red
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

Insert new node(s) to graph with given name and attributes.

#### Usage

<pre>
<b>put</b> <ins>name</ins> <i>:literal</i>, <i>:string</i>
    <ins>attributes</ins> <i>:dictionary</i>, <i>:block</i>
</pre>

#### Returns

- *:dictionary* (node)
- *:block* (of nodes)

#### Examples

```red
put 'person [name: "John" surname: "Doe" birthday: 1986]
```

### unput

#### Description

Remove given node(s) from graph.

#### Usage

<pre>
<b>unput</b> <ins>node</ins> <i>:dictionary</i>, <i>:block</i>
</pre>

#### Examples

```red
x: put 'person [name: "John" surname: "Doe" birthday: 1986]
unput x
```

### link

#### Description

Create a connection from source to target node with given name.

#### Usage

<pre>
<b>link</b> <ins>source</ins> <i>:dictionary</i> (node), <i>:block</i> (of nodes)
     <ins>name</ins> <i>:literal</i>, <i>:string</i>
     <ins>target</ins> <i>:dictionary</i> (node), <i>:block</i> (of nodes)
</pre>

#### Returns

- *:dictionary* (edge)

#### Examples

```red
link put 'person [name: "John" surname: "Doe" birthday: 1986] 'marriedTo 
     put 'person [name: "Mary" surname: "Doe" birthday: 1986]
```

### unlink

#### Description

Remove connection from source to target node with given name

#### Usage

<pre>
<b>unlink</b> <ins>source</ins> <i>:dictionary</i> (node), <i>:block</i> (of nodes)
       <ins>name</ins> <i>:literal</i>, <i>:string</i>
       <ins>target</ins> <i>:dictionary</i> (node), <i>:block</i> (of nodes)
</pre>

#### Examples

```red
x: put 'person [name: "John" surname: "Doe" birthday: 1986]
y: put 'person [name: "Mary" surname: "Doe" birthday: 1986]

link 'marriedTo x y
unlink 'marriedTo x y
```

### fetch

#### Description

Retrieves nodes with name that match all given attributes.

#### Usage

<pre>
<b>fetch</b> <ins>name</ins> <i>:literal</i>, <i>:string</i>
      <ins>properties</ins> <i>:block</i> <i>:dictionary</i> <i>:null</i>
</pre>

#### Returns

- *:block* of *:dictionary* (node)

#### Examples

```red
print fetch 'person [surname: "Doe"]
print fetch 'person [
	surname: "Doe"
	marriedTo: fetch'person [name: "Mary"]
]
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
preview fetch 'person [surname: "Doe"]
```

## Filter Reference

When querying - e.g. with `fetch` or `what` - you can search for results, not only for exact matches, but also using one of the filters below.

```red
fetch'person [
	surname: "Doe" 	; here, we are looking for an exact match
			; that is: people with the surname Doe
]
```

```red
fetch'person [
	surname: [
		contains: "D"	; here, we are using the 'contains filter
			        ; that is: people whose surname contains the letter D
	]
]
```

(The above, using Arturo's powerful syntax, could also be written like: 
```red
fetch'person [ surname: -> contains: "D" ]
```

### contains

Get rows that *contain* the given text.

### prefix

Get rows that start with, or "have as prefix", the given text.

### suffix

Get rows that end with, or "have as suffix", the given text.

### under

Get rows with a numeric value *less than* the given one.

### over

Get rows with a numeric value *greater than* the given one.

### underOrEqual

Get rows with a numeric value *less than or equal to* the given one.

### overOrEqual

Get rows with a numeric value *greater than or equal to* the given one.

### not

Get rows with a value *not equal to* the given one (or block of given values).

### in

Get rows with a numeric value *equal* to *one of those in* the given block.


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

