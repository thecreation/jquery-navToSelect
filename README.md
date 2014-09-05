# NavToSelect

navToSelect is jQuery plugin used to convert your website navigation into a select drop-down menu for small screen devices.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/amazingSurge/jquery-navToSelect/master/dist/jquery-navToSelect.min.js
[max]: https://raw.github.com/amazingSurge/jquery-navToSelect/master/dist/jquery-navToSelect.js

In your web page:

### Html structure
```html
<nav id="nav">
	<ul>
		<li><a href="homepage.html">Homepage</a></li>
		<li><a href="about.html" class="active">About us</a></li>
		<li><a href="contact.html">Contact</a></li>
	</ul>
</nav>
```

### JavaScript
```html
<script src="jquery.js"></script>
<script src="dist/jquery.navToSelect.min.js"></script>
<script>
jQuery(function($) {
  $("#nav > ul").navToSelect({
  	activeClass: 'active',
  	indentString: '&ndash;',
    defaultText: 'Navigate to...'
  });
});
</script>
```

### CSS
```css
.nav2select { display: none; }

/* Mobile device */
@media only screen and (max-width: 767px) {
  #nav > ul { display: none; }
  .nav2select { display: block; }
}
```

## License
Copyright (c) 2014 amazingSurge  
Licensed under the GPL license.