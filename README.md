# [jQuery navToSelect](https://github.com/amazingSurge/jquery-navToSelect) ![bower][bower-image] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![prs-welcome]](#contributing)

> A jQuery plugin used to convert your website navigation into a select drop-down menu for small screen devices.

## Table of contents
- [Main files](#main-files)
- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Development](#development)
- [Changelog](#changelog)
- [Copyright and license](#copyright-and-license)

## Main files
```
dist/
├── jquery-navToSelect.js
├── jquery-navToSelect.es.js
├── jquery-navToSelect.min.js
└── css/
    ├── navToSelect.css
    └── navToSelect.min.css
```

## Quick start
Several quick start options are available:
#### Download the latest build

 * [Development](https://raw.githubusercontent.com/amazingSurge/jquery-navToSelect/master/dist/jquery-navToSelect.js) - unminified
 * [Production](https://raw.githubusercontent.com/amazingSurge/jquery-navToSelect/master/dist/jquery-navToSelect.min.js) - minified

#### Install From Bower
```sh
bower install jquery-navToSelect --save
```

#### Install From Npm
```sh
npm install jquery-navToSelect --save
```

#### Install From Yarn
```sh
yarn add jquery-navToSelect
```

#### Build From Source
If you want build from source:

```sh
git clone git@github.com:amazingSurge/jquery-navToSelect.git
cd jquery-navToSelect
npm install
npm install -g gulp-cli babel-cli
gulp build
```

Done!

## Requirements
`jquery-navToSelect` requires the latest version of [`jQuery`](https://jquery.com/download/).

## Usage
#### Including files:

```html
<link rel="stylesheet" href="/path/to/navToSelect.css">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery-navToSelect.js"></script>
```

#### Required HTML structure

```html
<nav id="nav">
  <ul>
    <li><a href="homepage.html">Homepage</a></li>
    <li><a href="about.html" class="active">About us</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>
```

#### Initialization
All you need to do is call the plugin on the element:

```javascript
jQuery(function($) {
  $("#nav > ul").navToSelect({
    activeClass: 'active',
    indentString: '&ndash;',
    defaultText: 'Navigate to...'
  });
});
```

## Examples
There are some example usages that you can look at to get started. They can be found in the
[examples folder](https://github.com/amazingSurge/jquery-navToSelect/tree/master/examples).

## Options
`jquery-navToSelect` can accept an options object to alter the way it behaves. You can see the default options by call `$.navToSelect.setDefaults()`. The structure of an options object is as follows:

```
{
  maxLevel: 4,
  prependTo: null,
  activeClass: 'active',
  linkSelector: 'a:first',
  indentString: '&ndash;',
  indentSpace: true,
  placeholder: 'Navigate to...',
  useOptgroup: false,
  namespace: 'navToSelect',
  itemFilter($li) {
    return true;
  },
  getItemLabel($li) {
    return $li.find(this.options.linkSelector).text();
  },
  getItemsFromList($list, level) {
    const that = this;
    const _items = [];

    $list.children('li').each(function() {
      const $li = $(this);
      if (!that.options.itemFilter($li)) {
        return;
      }
      const item = {
        value: that.getItemValue($li),
        label: that.options.getItemLabel.call(that, $li),
        linkable: that.isLinkable($li),
        actived: that.isActived($li)
      };
      if ($li.children('ul, ol').length) {
        item.items = [];
        $li.children('ul, ol').each(function() {
          item.items = item.items.concat(that.options.getItemsFromList.call(that, $(this), level + 1));
        });
      }

      _items.push(item);
    });
    return _items;
  },
  onChange() {
    if ($(this).data('linkable') !== false) {
      document.location.href = this.value;
    }
  }
}
```

## Methods
Methods are called on navToSelect instances through the navToSelect method itself.
You can also save the instances to variable for further use.

```javascript
// call directly
$().navToSelect('destroy');

// or
var api = $().data('navToSelect');
api.destroy();
```

#### getSelect()
Get select jquery object.
```javascript
var $select = $().navToSelect('getSelect');
```

#### isBuilded()
Check if select is builded already
```javascript
$().navToSelect('isBuilded');
```

#### enable()
Enable the nav to select functions.
```javascript
$().navToSelect('enable');
```

#### disable()
Disable the scrollbar functions.
```javascript
$().navToSelect('disable');
```

#### destroy()
Destroy the scrollbar instance.
```javascript
$().navToSelect('destroy');
```

## Events
`jquery-navToSelect` provides custom events for the plugin’s unique actions. 

```javascript
$('.the-element').on('navToSelect::ready', function (e) {
  // on instance ready
});

```

Event   | Description
------- | -----------
ready   | Fires when the instance is ready for API use.
enable  | Fired when the `enable` instance method has been called.
disable | Fired when the `disable` instance method has been called.
destroy | Fires when an instance is destroyed. 

## No conflict
If you have to use other plugin with the same namespace, just call the `$.navToSelect.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="jquery-navToSelect.js"></script>
<script>
  $.navToSelect.noConflict();
  // Code that uses other plugin's "$().navToSelect" can follow here.
</script>
```

## Browser support

Tested on all major browsers.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_32x32.png" alt="IE"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing
Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md). Make sure you're using the latest version of `jquery-navToSelect` before submitting an issue. There are several ways to help out:

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* Write test cases for open bug issues
* Contribute to the documentation

## Development
`jquery-navToSelect` is built modularly and uses Gulp as a build system to build its distributable files. To install the necessary dependencies for the build system, please run:

```sh
npm install -g gulp
npm install -g babel-cli
npm install
```

Then you can generate new distributable files from the sources, using:
```
gulp build
```

More gulp tasks can be found [here](CONTRIBUTING.md#available-tasks).

## Changelog
To see the list of recent changes, see [Releases section](https://github.com/amazingSurge/jquery-navToSelect/releases).

## Copyright and license
Copyright (C) 2016 amazingSurge.

Licensed under [the LGPL license](LICENSE).

[⬆ back to top](#table-of-contents)

[bower-image]: https://img.shields.io/bower/v/jquery-navToSelect.svg?style=flat
[bower-link]: https://david-dm.org/amazingSurge/jquery-navToSelect/dev-status.svg
[npm-image]: https://badge.fury.io/js/jquery-navToSelect.svg?style=flat
[npm-url]: https://npmjs.org/package/jquery-navToSelect
[license]: https://img.shields.io/npm/l/jquery-navToSelect.svg?style=flat
[prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[daviddm-image]: https://david-dm.org/amazingSurge/jquery-navToSelect.svg?style=flat
[daviddm-url]: https://david-dm.org/amazingSurge/jquery-navToSelect