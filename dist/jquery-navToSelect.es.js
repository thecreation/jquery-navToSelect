/**
* jQuery NavToSelect v0.5.2
* https://github.com/amazingSurge/jquery-navToSelect
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
import $$1 from 'jquery';

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
};

const NAMESPACE$1 = 'navToSelect';

/**
 * Plugin constructor
 **/
class navToSelect {
  constructor(element, options) {
    this.element = element;
    this.$element = $$1(element);
    this._isBuilded = false;

    this.options = $$1.extend({}, DEFAULTS, options);
    this.init();
  }

  init() {
    const items = this.getItems();
    this.build(items);

    this.$select.on('change', this.options.onChange);

    /* fix orientation change issue */
    $$1(window).on("orientationchange", () => {
      if (this.$select.is(':hidden') && this.$select.is(':focus')) {
        this.$select.blur();
      }
    });

    this.trigger('ready');
  }

  build(items) {
    this.$select = $$1('<select />', {
      'class': this.options.namespace
    }).html(this.buildOptions(items, 1));

    if (this.options.prependTo === null) {
      this.$element.after(this.$select);
    } else {
      this.$select.prependTo(this.options.prependTo);
    }
    this._isBuilded = true;
  }

  buildOption(item, level) {
    let indent = new Array(level).join(this.options.indentString);
    if (level !== 1 && this.options.indentSpace) {
      indent += '&nbsp;';
    }
    return `<option value="${item.value}"${item.linkable === false ? ' data-linkable="false"' : ''}${item.actived === true ? ' selected="selected"' : ''}>${indent}${item.label}</option>`;
  }

  buildOptions(items, level) {
    if (level > this.options.maxLevel) {
      return '';
    }
    let options = '';
    $$1.each(items, (index, item) => {
      if (item.linkable === false && typeof item.items !== 'undefined' && level === 1 && this.options.useOptgroup) {
        options += `<optgroup label="${item.label}">`;
        options += this.buildOptions(item.items, level + 1);
        options += '</optgroup>';
      }
      if (typeof item.items !== 'undefined') {
        options += this.buildOption(item, level);
        options += this.buildOptions(item.items, level + 1);
      } else {
        options += this.buildOption(item, level);
      }
    });
    return options;
  }

  getItems() {
    let items = [];
    if (this.options.placeholder) {
      items = items.concat({
        value: "#",
        label: this.options.placeholder,
        linkable: false
      });
    }

    items = items.concat(this.options.getItemsFromList.call(this, this.$element, 1));
    return items;
  }

  // Get link url
  getItemValue($li) {
    return $li.find(this.options.linkSelector).attr('href');
  }

  // Check if a item can link
  isLinkable($li) {
    return this.getItemValue($li) !== '#';
  }

  // Check if a item is actived
  isActived($li) {
    return $li.is(`.${this.options.activeClass}`);
  }

  // Check if select is builded already
  isBuilded() {
    return this._isBuilded;
  }

  trigger(eventType, ...params) {
    let data = [this].concat(params);

    // event
    this.$element.trigger(`${NAMESPACE$1}::${eventType}`, data);

    // callback
    eventType = eventType.replace(/\b\w+\b/g, (word) => {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
    let onFunction = `on${eventType}`;

    if (typeof this.options[onFunction] === 'function') {
      this.options[onFunction].apply(this, params);
    }
  }

  getSelect() {
    return this.$select;
  }

  destroy() {
    this.$select.remove();
    this.$element.data('NavToSelect', null);

    this.trigger('destroy');
  }

  static setDefaults(options) {
    $$1.extend(DEFAULTS, $$1.isPlainObject(options) && options);
  }
}

$$1.navToSelect = navToSelect;

var info = {
  version:'0.5.2'
};

const NAMESPACE = 'navToSelect';
const OtherNavToSelect = $$1.fn.navToSelect;

const jQueryNavToSelect = function(options, ...args) {
  if (typeof options === 'string') {
    const method = options;

    if (/^_/.test(method)) {
      return false;
    } else if ((/^(get)/.test(method))) {
      const instance = this.first().data(NAMESPACE);
      if (instance && typeof instance[method] === 'function') {
        return instance[method](...args);
      }
    } else {
      return this.each(function() {
        const instance = $$1.data(this, NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function() {
    if (!$$1(this).data(NAMESPACE)) {
      $$1(this).data(NAMESPACE, new navToSelect(this, options));
    }
  });
};

$$1.fn.navToSelect = jQueryNavToSelect;

$$1.navToSelect = $$1.extend({
  setDefaults: navToSelect.setDefaults,
  noConflict: function() {
    $$1.fn.navToSelect = OtherNavToSelect;
    return jQueryNavToSelect;
  }
}, info);
