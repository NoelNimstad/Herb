⚠️ This library uses `eval` for arbitrary JavaScript execution.
If your project has any form of UGC which would be processed by this library – then don't use this library.
`eval` is dangerous if used carelessly.

# Herb 🌱
Herb is a tiny JavaScript function collection allowing dynamic pages without heavy libraries such as React or Vue.

## Installation
Get the [`herb.js`](./build/herb.bundle.js) file by running:
```
curl https://raw.githubusercontent.com/NoelNimstad/Herb/refs/heads/master/build/herb.bundle.js > herb.js
```

## Example
Basic example ([see file](./tests/title.html))
```html
<!-- Input -->
<h1 herb>title</h1>
<script>
    var title = "Hello World";
    herb.start();
</script>

<!-- Output -->
<h1>Hello World</h1>
```

List example ([see file](./tests/list.html))
```html
<!-- Input -->
<ul herb map="my_list">tag("li", $h)</ul>
<script>
    var my_list =
    [
        "Apple",
        "Banana",
        "Orange"
    ];
    herb.start();
</script>

<!-- Output -->
<ul>
    <li>Apple</li>
    <li>Banana</li>
    <li>Orange</li>
</ul>
```

## Beta features
Note, all of the following must be manually enabled upon initialisation and are unstable and prone to changes or removal.

### FauxML
A light regex-based version of JSX with a few differences.
Mainly, content inside a tag is automatically treated as Javascript content, as a normal herb would.
Secondly, all attributes have the same names (e.g. no `className` instead of `class`).
Note that the algorithm for parsing FauxML tags is recursive, so you running into stack overflow errors is possible.

FauxML list example ([see file](./tests/list_FauxML.html))
```html
<!-- input -->
<ul herb map="my_list">
    <li>$h</li>
</ul>
<script>
    var my_list =
    [
        "Apple",
        "Banana",
        "Orange"
    ];

    herb.start("FauxML");
</script>

<!-- Output -->
<ul>
    <li>Apple</li>
    <li>Banana</li>
    <li>Orange</li>
</ul>
```