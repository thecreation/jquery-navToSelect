import $ from 'jquery';
import DEFAULTS from './defaults';

const NAMESPACE = 'navToSelect';

/**
 * Plugin constructor
 **/
class navToSelect {
  constructor(element, options) {
    this.element = element;
    this.$element = $(element);
    this._isBuilded = false;

    this.options = $.extend(DEFAULTS, options);
    this.init();
  }

  init() {
    const items = this.getItems();
    this.build(items);

    this.$select.on('change', this.options.onChange);

    /* fix orientation change issue */
    $(window).on("orientationchange", () => {
      if (this.$select.is(':hidden') && this.$select.is(':focus')) {
        this.$select.blur();
      }
    });

    this.trigger('ready');
  }

  build(items) {
    this.$select = $('<select />', {
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
    $.each(items, (index, item) => {
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
    let data = [this].concat(...params);

    // event
    this.$element.trigger(`${NAMESPACE}::${eventType}`, data);

    // callback
    eventType = eventType.replace(/\b\w+\b/g, (word) => {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
    let onFunction = `on${eventType}`;

    if (typeof this.options[onFunction] === 'function') {
      this.options[onFunction].apply(this, ...params);
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
    $.extend(DEFAULTS, $.isPlainObject(options) && options);
  }
}

$.navToSelect = navToSelect;
export default navToSelect;
