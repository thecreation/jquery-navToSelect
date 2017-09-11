/**
* jQuery NavToSelect v0.5.2
* https://github.com/amazingSurge/jquery-navToSelect
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jQuery);
    global.jqueryNavToSelectEs = mod.exports;
  }
})(this, function(_jquery) {
  'use strict';

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule
      ? obj
      : {
          default: obj
        };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  /* eslint no-unused-vars: "off" */

  var DEFAULTS = {
    maxLevel: 4,
    prependTo: null,
    activeClass: 'active',
    linkSelector: 'a:first',
    indentString: '&ndash;',
    indentSpace: true,
    placeholder: 'Navigate to...',
    useOptgroup: false,
    namespace: 'navToSelect',
    itemFilter: function itemFilter($li) {
      return true;
    },
    getItemLabel: function getItemLabel($li) {
      return $li.find(this.options.linkSelector).text();
    },
    getItemsFromList: function getItemsFromList($list, level) {
      var that = this;
      var _items = [];

      $list.children('li').each(function() {
        var $li = $(this);
        if (!that.options.itemFilter($li)) {
          return;
        }
        var item = {
          value: that.getItemValue($li),
          label: that.options.getItemLabel.call(that, $li),
          linkable: that.isLinkable($li),
          actived: that.isActived($li)
        };
        if ($li.children('ul, ol').length) {
          item.items = [];
          $li.children('ul, ol').each(function() {
            item.items = item.items.concat(
              that.options.getItemsFromList.call(that, $(this), level + 1)
            );
          });
        }

        _items.push(item);
      });
      return _items;
    },
    onChange: function onChange() {
      if ($(this).data('linkable') !== false) {
        document.location.href = this.value;
      }
    }
  };

  var NAMESPACE$1 = 'navToSelect';

  /**
   * Plugin constructor
   **/

  var navToSelect = (function() {
    function navToSelect(element, options) {
      _classCallCheck(this, navToSelect);

      this.element = element;
      this.$element = (0, _jquery2.default)(element);
      this._isBuilded = false;

      this.options = _jquery2.default.extend({}, DEFAULTS, options);
      this.init();
    }

    _createClass(
      navToSelect,
      [
        {
          key: 'init',
          value: function init() {
            var _this = this;

            var items = this.getItems();
            this.build(items);

            this.$select.on('change', this.options.onChange);

            /* fix orientation change issue */
            (0, _jquery2.default)(window).on('orientationchange', function() {
              if (_this.$select.is(':hidden') && _this.$select.is(':focus')) {
                _this.$select.blur();
              }
            });

            this.trigger('ready');
          }
        },
        {
          key: 'build',
          value: function build(items) {
            this.$select = (0, _jquery2.default)('<select />', {
              class: this.options.namespace
            }).html(this.buildOptions(items, 1));

            if (this.options.prependTo === null) {
              this.$element.after(this.$select);
            } else {
              this.$select.prependTo(this.options.prependTo);
            }
            this._isBuilded = true;
          }
        },
        {
          key: 'buildOption',
          value: function buildOption(item, level) {
            var indent = new Array(level).join(this.options.indentString);
            if (level !== 1 && this.options.indentSpace) {
              indent += '&nbsp;';
            }
            return (
              '<option value="' +
              item.value +
              '"' +
              (item.linkable === false ? ' data-linkable="false"' : '') +
              (item.actived === true ? ' selected="selected"' : '') +
              '>' +
              indent +
              item.label +
              '</option>'
            );
          }
        },
        {
          key: 'buildOptions',
          value: function buildOptions(items, level) {
            var _this2 = this;

            if (level > this.options.maxLevel) {
              return '';
            }
            var options = '';
            _jquery2.default.each(items, function(index, item) {
              if (
                item.linkable === false &&
                typeof item.items !== 'undefined' &&
                level === 1 &&
                _this2.options.useOptgroup
              ) {
                options += '<optgroup label="' + item.label + '">';
                options += _this2.buildOptions(item.items, level + 1);
                options += '</optgroup>';
              }
              if (typeof item.items !== 'undefined') {
                options += _this2.buildOption(item, level);
                options += _this2.buildOptions(item.items, level + 1);
              } else {
                options += _this2.buildOption(item, level);
              }
            });
            return options;
          }
        },
        {
          key: 'getItems',
          value: function getItems() {
            var items = [];
            if (this.options.placeholder) {
              items = items.concat({
                value: '#',
                label: this.options.placeholder,
                linkable: false
              });
            }

            items = items.concat(
              this.options.getItemsFromList.call(this, this.$element, 1)
            );
            return items;
          }
        },
        {
          key: 'getItemValue',
          value: function getItemValue($li) {
            return $li.find(this.options.linkSelector).attr('href');
          }
        },
        {
          key: 'isLinkable',
          value: function isLinkable($li) {
            return this.getItemValue($li) !== '#';
          }
        },
        {
          key: 'isActived',
          value: function isActived($li) {
            return $li.is('.' + this.options.activeClass);
          }
        },
        {
          key: 'isBuilded',
          value: function isBuilded() {
            return this._isBuilded;
          }
        },
        {
          key: 'trigger',
          value: function trigger(eventType) {
            for (
              var _len = arguments.length,
                params = Array(_len > 1 ? _len - 1 : 0),
                _key = 1;
              _key < _len;
              _key++
            ) {
              params[_key - 1] = arguments[_key];
            }

            var data = [this].concat(params);

            // event
            this.$element.trigger(NAMESPACE$1 + '::' + eventType, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
              return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;

            if (typeof this.options[onFunction] === 'function') {
              this.options[onFunction].apply(this, params);
            }
          }
        },
        {
          key: 'getSelect',
          value: function getSelect() {
            return this.$select;
          }
        },
        {
          key: 'destroy',
          value: function destroy() {
            this.$select.remove();
            this.$element.data('NavToSelect', null);

            this.trigger('destroy');
          }
        }
      ],
      [
        {
          key: 'setDefaults',
          value: function setDefaults(options) {
            _jquery2.default.extend(
              DEFAULTS,
              _jquery2.default.isPlainObject(options) && options
            );
          }
        }
      ]
    );

    return navToSelect;
  })();

  _jquery2.default.navToSelect = navToSelect;

  var info = {
    version: '0.5.2'
  };

  var NAMESPACE = 'navToSelect';
  var OtherNavToSelect = _jquery2.default.fn.navToSelect;

  var jQueryNavToSelect = function jQueryNavToSelect(options) {
    for (
      var _len2 = arguments.length,
        args = Array(_len2 > 1 ? _len2 - 1 : 0),
        _key2 = 1;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2 - 1] = arguments[_key2];
    }

    if (typeof options === 'string') {
      var method = options;

      if (/^_/.test(method)) {
        return false;
      } else if (/^(get)/.test(method)) {
        var instance = this.first().data(NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          return instance[method].apply(instance, args);
        }
      } else {
        return this.each(function() {
          var instance = _jquery2.default.data(this, NAMESPACE);
          if (instance && typeof instance[method] === 'function') {
            instance[method].apply(instance, args);
          }
        });
      }
    }

    return this.each(function() {
      if (!(0, _jquery2.default)(this).data(NAMESPACE)) {
        (0, _jquery2.default)(this).data(
          NAMESPACE,
          new navToSelect(this, options)
        );
      }
    });
  };

  _jquery2.default.fn.navToSelect = jQueryNavToSelect;

  _jquery2.default.navToSelect = _jquery2.default.extend(
    {
      setDefaults: navToSelect.setDefaults,
      noConflict: function noConflict() {
        _jquery2.default.fn.navToSelect = OtherNavToSelect;
        return jQueryNavToSelect;
      }
    },
    info
  );
});
