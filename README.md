# Tagrhead
Tagrhead is a search bar that comes with autosuggestions and tags features, and supports [Google's Material Design Lite](https://github.com/google/material-design-lite) and [Bootstrap Material Design](https://github.com/FezVrasta/bootstrap-material-design)

## Table of contents
- [Installation](#installation)
- [CDN](#cdn)
- [Basic Usage](#basic-usage)
- [Material Design Lite](#material-design-lite)
- [Bootstrap Material Design](#bootstrap-material-design)
- [Public APIs](#public-apis)
- [Configurations](#configurations)
  - [Tagrhead Config](#tagrhead-config)
  - [Data Sources](#data-sources)

## Installation
You can install Tagrhead using npm or bower:
- npm: `npm install tagrhead`
- bower: `bower install tagrhead`

Since Tagrhead uses [Typeahead](https://github.com/twitter/typeahead.js)'s [Bloodhound](https://github.com/twitter/typeahead.js/blob/master/doc/bloodhound.md) as its suggestion engine, which needs jQuery, make sure you have jQuery installed first.
However, a bundled version of Tagrhead with a built-in is also available, but its file size is comparably larger.

## CDN
You can also include this library in your project using CDN:
- Javascript:
  - js: [https://cdn.jsdelivr.net/npm/tagrhead@2/dist/Tagrhead.js](https://cdn.jsdelivr.net/npm/tagrhead@2/dist/Tagrhead.js)
  - minified js: [https://cdn.jsdelivr.net/npm/tagrhead@2/dist/Tagrhead.min.js](https://cdn.jsdelivr.net/npm/tagrhead@2/dist/Tagrhead.min.js)
  - bundled with jQuery: [https://cdn.jsdelivr.net/npm/tagrhead@2/dist/Tagrhead.bundle.min.js](https://cdn.jsdelivr.net/npm/tagrhead@2/dist/Tagrhead.bundle.min.js)
- CSS:
  - basic: [https://cdn.jsdelivr.net/npm/tagrhead@2/dist/stylesheets/tagrhead.basic.css](https://cdn.jsdelivr.net/npm/tagrhead@2/dist/stylesheets/tagrhead.basic.css)
  - material design lite: [https://cdn.jsdelivr.net/npm/tagrhead@2.1.0/dist/stylesheets/tagrhead.material.css](https://cdn.jsdelivr.net/npm/tagrhead@2.1.0/dist/stylesheets/tagrhead.material.css)
  - bootstrap material design: [https://cdn.jsdelivr.net/npm/tagrhead@2.1.0/dist/stylesheets/tagrhead.bdl.css](https://cdn.jsdelivr.net/npm/tagrhead@2.1.0/dist/stylesheets/tagrhead.mdl.css)

### Basic Usage

- [Sample Code](https://github.com/kevguy/TagrHead/tree/master/examples/basic)
- [Codepen](https://codepen.io/kevlai22/pen/VbqZwZ)

Give you input element and container a unique id, then initialize Tagrhead with your `dataSource`:
```html
<head>
  ...
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tagrhead@2/dist/stylesheets/tagrhead.basic.css">
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/tagrhead@2/dist/Tagrhead.min.js"></script>
  <script type="text/javascript">
    let dataSources = [
      {
        itemHeader: 'TV Shows',
        itemKey: 'id',
        itemValue: 'show',
        mode: 'local', // can be 'remote', 'prefetch', will be supported later
        srchKey: 'show',
        defaultSuggestions: true,
        data: [
          {id: 1, show: 'Rick and Morty'},
          {id: 2, show: 'How I Met Your Mother'},
          {id: 3, show: 'Unbreakable Kimmy Schimidtt'},
          {id: 4, show: 'Scrubs'},
          {id: 5, show: 'Brooklyn Nine Nine'}
        ]
      }
    ]

    window.onload = () => {
        var tagrhead = new Tagrhead('tagrhead-input', 'tagrhead-container', dataSources, {
          manual: false,
          wrap: true
        })
    }
  </script>
  <body>
    <div id="tagrhead-container">
      <input id="tagrhead-input" type="text" name="" value="">
    </div>

    <!-- OR -->
    <input id="tagrhead-input" type="text" name="" value="">
    <div id="tagrhead-container"></div>
  </body>
</head>
```
## Material Design Lite

- [Materia Design Lite](https://github.com/google/material-design-lite)
- [Sample Code](https://github.com/kevguy/TagrHead/tree/master/examples/material-design-lite)
- [Codepen](https://codepen.io/kevlai22/pen/ZKmqGj)

```html
<head>
  ...
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tagrhead@2/dist/stylesheets/tagrhead.material.css">
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/tagrhead@2/dist/Tagrhead.min.js"></script>
  <script type="text/javascript">
    let dataSources = [...]
    window.onload = () => {
        var tagrhead = new Tagrhead('tagrhead-input', 'tagrhead-container', dataSources, {
          manual: false,
          wrap: true,
          style: 'mdl'
        })
    }
  </script>
</head>
<body>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer
              mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <div class="mdl-layout-spacer"></div>
        <div class="tagrhead-mdl-search-form" search-placeholder="Search">
          <div id="tagrhead-container"></div>
          <div class="tagrhead-mdl-searchbox">
            <div class="tagrhead-mdl-search-image material-icons"></div>
            <input id="tagrhead-input" placeholder="Search" type="text" class="tagrhead-mdl-search-field tagrhead-mdl-search-query"  autocomplete="off">
          </div>
        </div>
      </div>
    </header>
  </div>
</body>
```

## Bootstrap Material Design

- [Bootstrap Material Design](https://github.com/FezVrasta/bootstrap-material-design)
- [Sample Code](https://github.com/kevguy/TagrHead/tree/master/examples/bootstrap-material-design)
- [Codepen](https://codepen.io/kevlai22/pen/rmQEXy)

```html
<head>
  ...
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tagrhead@2/dist/stylesheets/tagrhead.bdl.css">
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/tagrhead@2/dist/Tagrhead.min.js"></script>
  <script type="text/javascript">
    let dataSources = [...]
    window.onload = () => {
        var tagrhead = new Tagrhead('tagrhead-input', 'tagrhead-container', dataSources, {
          manual: false,
          wrap: false,
          style: 'bootstrap-material-design'
        })
    }
  </script>
</head>
<body>
  <div class="navbar navbar-default">
    ...
    <div class="navbar-collapse collapse navbar-responsive-collapse">
      ...
      <form class="navbar-form navbar-left">
          <input type="text" class="form-control col-lg-8 tagrhead-input" placeholder="Search" id="tagrhead-input">
      </form>
      ...
    </div>
    <div id="tagrhead-container" class="navbar-collapse collapse navbar-material-light-blue-collapse">
    </div>
  </div>
  ...
</body>
```

## Public APIs
  * [`new Tagrhead(inputId, containerId, dataSources, config)`](#new-tagrhead)
  * [`Tagrhead.getTags()`](#tagrheadgettags)
  * [`Tagrhead.clearTags()`](#tagrheadcleartags)
  * [`Tagrhead.addTags(data)`](#tagrheadaddtags)

### new Tagrhead(inputId, containerId, dataSources, config)
The constructor function. It takes the id of the input element, the id of the container, [data sources](#data-sources) and an [config](#tagrhead-config) as its arguments.
The [config](#tagrhead-config) argument is optional.

``` javascript
var tagrhead = new Tagrhead('tagrhead-input', 'tagrhead-container', dataSources, {
  manual: false,
  wrap: true
})
```

### Tagrhead.getTags()
Returns the current tags stored in an array.

``` javascript
var tags = tagrhead.getTags()
```

### Tagrhead.clearTags()
Clear all the current tags.

```javascript
tagrhead.clearTags()

console.log(tagrhead.getTags()) // []
```

### Tagrhead.addTags(data)
Takes an object or an array of objects and add them to the current tags.

```javascript
tagrhead.addTags({
  header: 'header name',
  key: 'id_val',
  value: 'value_val'
})

var arr = [
  {
    header: 'header name',
    key: 'id_val1',
    value: 'value_val1'
  },
  {
    header: 'header name',
    key: 'id_val2',
    value: 'value_val2'
  },
  {
    header: 'header name2',
    key: 'id_val3',
    value: 'value_val3'
  }
]

tagrhead.addTags(arr)
```

## Configurations
### Tagrhead Config
When instantiating tagrhead, there are a number of options you can configure.

* `manual` - Defaults to be `false`. It set to true, the user can add whatever they type on the search bar
   as a tag with the enter key. The tag' s `header`, `key`, `value` are all set to the text input.
* `wrap` - Defaults to be `true`. Tagrhead adds all the tags inside the container and if `wrap` is set to be `true`, it assumes you've put the
   `input element` inside the `container`. If set to `false`, you have to take the `input element` outside of of the `container`.
* `style` - Tagrhead can add tags that supports both Material Design Lite and Bootstrap Material Design. Specify which `style` you want with `mdl` or `bootstrap-material-design`.
    If none is set, Tagrhead will just create a basic tag.

### Data Sources
The data source is an array of data you want Tagrhead to do autosuggestion from with a number of options you can configure.

  * `itemHeader` - The header or category name you want to give to the array of data
  * `itemKey` - The unique key for find the element inside your data
  * `itemValue` - The value/text you want to show on the autosuggestion list
  * `srchKey` - The property inside your `data` that you want the search to be based on
  * `defaultSuggestions` - Whether you want to give some random suggestions if the search bar is empty (not counting the prefix)
  * `data` - the array that stores your data, in which each object should contains at least one property (`band`, for instance, in the example)

Example:
```javascript
var dataSource = [
  {
    itemHeader: 'Bands',
    itemKey: 'id',
    itemValue: 'band',
    srchKey: 'band',
    defaultSuggestions: true,
    data: [
      {id: 1, band: 'Chvrches'}, {id: 2, band: 'Linkin Park'}, {id: 3, band: 'Green Day'},
      {id: 4, band: 'Muse'}, {id: 5, band: 'Sum 41'}, {id: 6, band: 'Death Cab For Cutie'},
      {id: 7, band: 'Twenty One Pilots'}, {id: 8, band: 'Oasis'}, {id: 9, band: 'Beatles'},
      {id: 10, band: 'Gorillaz'}, {id: 11, band: 'Radiohead'}, {id: 12, band: 'Coldplay'},
      {id: 13, band: 'Evanescence'}, {id: 14, band: 'Fall Out Boy'}, {id: 15, band: 'Fort Minor'},
      {id: 16, band: 'Florence + The Machine'}, {id: 17, band: 'Foo Fighters'}, {id: 18, band: 'The Glitch Mob'},
      {id: 19, band: 'Daft Punk'}, {id: 20, band: 'Clean Bandit'}, {id: 21, band: 'AWOLNATION'},
      {id: 22, band: 'Bon Jovi'}, {id: 23, band: 'Arcade Fire'}, {id: 24, band: 'Avenged Sevenfold'},
      {id: 25, band: 'Aerosmith'}, {id: 26, band: 'AC/DC'}, {id: 27, band: 'HaleStorm'},
      {id: 28, band: 'Straight Outta Compton'}, {id: 29, band: 'Lady Antebellum'}, {id: 30, state: 'M83'}
    ]
  }
]
```

## License
[MIT License](https://github.com/kevguy/TagrHead/blob/master/LICENSE.txt)
