import $ from 'jquery';
import navToSelect from './navToSelect';
import info from './info';

const NAMESPACE = 'navToSelect';
const OtherNavToSelect = $.fn.navToSelect;

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
        const instance = $.data(this, NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function() {
    if (!$(this).data(NAMESPACE)) {
      $(this).data(NAMESPACE, new navToSelect(this, options));
    }
  });
};

$.fn.navToSelect = jQueryNavToSelect;

$.navToSelect = $.extend({
  setDefaults: navToSelect.setDefaults,
  noConflict: function() {
    $.fn.navToSelect = OtherNavToSelect;
    return jQueryNavToSelect;
  }
}, info);
