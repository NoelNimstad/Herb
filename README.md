# Herb 🌱
Herb is a tiny JavaScript function collection allowing dynamic pages without heavy libraries such as React or Vue.

# Installation
Get the `herb.js` file by running:
```
curl https://raw.githubusercontent.com/NoelNimstad/Herb/refs/heads/master/build/herb.bundle.js > herb.js
```

# Documentation
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
<ul herb map="my_list"
    template="tag('li', $h)"></ul>
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