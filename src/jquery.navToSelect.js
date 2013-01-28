(function (document, $, undefined) {
  "use strict";

  var namespace = 'navToSelect';

  // Constructor
  var Plugin = $.navToSelect = function (nav, settings) {
    this.nav = nav;
    this.$nav = $(nav);

    this._isBuilded = false;

    // Merge the settings given by the user with the defaults
    this.settings = $.extend({}, Plugin.defaults, settings);

    // Initialization code to get the ball rolling
    this.init();
  };

  // Default options for the plugin as a simple object
  Plugin.defaults = {
    maxLevel: 4,
    prependTo: null,
    activeClass: 'active',
    linkSelector: 'a:first',
    className: 'nav2select',
    indentString: '&ndash;',
    indentSpace: true,
    defaultText: 'Navigate to...',
    useOptgroup: false,
    changeEvent: function(){
      if($(this).data('linkable')!==false){
        Plugin.goTo(this.value);
      }
    }
  };

  // Plugin initializer - prepare your plugin.
  Plugin.prototype.init = function () {
    var items = this.getItems();
    this.build(items);

    this.$select.on('change', this.settings.changeEvent);

  };

  Plugin.prototype.build = function(items){
    this.$select = $('<select />', {
      'class':this.settings.className
    }).html(this.generateOptionsString(items,1));

    if(this.settings.prependTo === null){
      this.$nav.after(this.$select);
    }else{
      this.$select.prependTo(this.settings.prependTo);
    }
    this._isBuilded = true;
  };

  Plugin.prototype.generateOptionString = function(item, level){
    var indent = new Array( level ).join( this.settings.indentString);
    if(level !== 1 && this.settings.indentSpace) {
      indent += '&nbsp;';
    }
    return '<option value="'+item.value+'"'+
      (item.linkable === false?' data-linkable="false"':'')+
      (item.actived === true?' selected="selected"':'')+
      '>'+indent+item.label+'</option>';
  };

  Plugin.prototype.generateOptionsString = function(items, level){
    if (level > this.settings.maxLevel){
      return '';
    }
    var options = '';
    var self = this;
      $.each(items, function(index, item){
        if(item.linkable === false && typeof item.items !== 'undefined' && level === 1 && self.settings.useOptgroup){
          options += '<optgroup label="'+item.label+'">';
          options += self.generateOptionsString(item.items,level+1);
          options += '</optgroup>';
        }if(typeof item.items !== 'undefined'){
          options += self.generateOptionString(item, level);
          options += self.generateOptionsString(item.items,level+1);
        }else{
          options += self.generateOptionString(item, level);
        }
      });
      return options;
  };

  Plugin.prototype.getItems = function() {
    var items = [];
    if(this.settings.defaultText){
      items = items.concat({
        value:"#",
        label: this.settings.defaultText,
        linkable: false
      });
    }
    var self = this;

    //recursion
    function _getItemsFromList($list, level){
      var _items = [];

      $list.children('li').each(function(){
        var $li = $(this);
        var item = {
          value: self.getItemValue($li),
          label: self.getItemLabel($li),
          linkable: self.isLinkable($li),
          actived: self.isActived($li)
        };
        if($li.children('ul, ol').length){
          item.items = [];
          $li.children('ul, ol').each(function(){
            item.items = item.items.concat( _getItemsFromList($(this), level+1));
          });
        }

        _items.push(item);
      });
      return _items;
    }

    items = items.concat(_getItemsFromList(this.$nav,1));
    return items;
  };

  // Get link url
  Plugin.prototype.getItemValue = function($li){
    return $li.find(this.settings.linkSelector).attr('href');
  };

  // Check if a item can link
  Plugin.prototype.isLinkable = function($li){
    return this.getItemValue($li) !== '#';
  };

  // Check if a item is actived
  Plugin.prototype.isActived = function($li){
    return $li.is('.'+this.settings.activeClass);
  };

  // Get link label
  Plugin.prototype.getItemLabel = function($li, level){
    return $li.find(this.settings.linkSelector).text();
  };

  // Check if select is builded already
  Plugin.prototype.isBuilded = function() {
    return this._isBuilded;
  };

  // Go to page
  Plugin.goTo = function(url) {
    document.location.href = url;
  };

  // Collection method.
  $.fn.navToSelect = function (options) {
    return this.each(function () {
      if (!$.data(this, namespace)) {
        $.data(this, namespace, new Plugin(this, options));
      }
    });
  };
}(document, jQuery));