/*! jQuery NavToSelect - v0.2.4 - 2014-09-06
* https://github.com/amazingSurge/jquery-navToSelect
* Copyright (c) 2014 amazingSurge; Licensed GPL */
(function(window, document, $, undefined) {
    'use strict';

    // Constructor
    var NavToSelect = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this._isBuilded = false;

        this.options = $.extend(NavToSelect.defaults, options);

        var self = this;
        $.extend(self, {
            init: function() {
                var items = self.getItems();
                self.build(items);

                self.$select.on('change', self.options.onChange);
                self.$element.trigger('navToSelect::ready');

                /* fix orientation change issue */
                $(window).on("orientationchange", function() {
                    if (self.$select.is(':hidden') && self.$select.is(':focus')) {
                        self.$select.blur();
                    }
                });
            },
            build: function(items) {
                self.$select = $('<select />', {
                    'class': self.options.namespace
                }).html(self.buildOptions(items, 1));

                if (self.options.prependTo === null) {
                    self.$element.after(self.$select);
                } else {
                    self.$select.prependTo(self.options.prependTo);
                }
                self._isBuilded = true;
            },
            buildOption: function(item, level) {
                var indent = new Array(level).join(self.options.indentString);
                if (level !== 1 && self.options.indentSpace) {
                    indent += '&nbsp;';
                }
                return '<option value="' + item.value + '"' +
                    (item.linkable === false ? ' data-linkable="false"' : '') +
                    (item.actived === true ? ' selected="selected"' : '') +
                    '>' + indent + item.label + '</option>';
            },
            buildOptions: function(items, level) {
                if (level > self.options.maxLevel) {
                    return '';
                }
                var options = '';
                $.each(items, function(index, item) {
                    if (item.linkable === false && typeof item.items !== 'undefined' && level === 1 && self.options.useOptgroup) {
                        options += '<optgroup label="' + item.label + '">';
                        options += self.buildOptions(item.items, level + 1);
                        options += '</optgroup>';
                    }
                    if (typeof item.items !== 'undefined') {
                        options += self.buildOption(item, level);
                        options += self.buildOptions(item.items, level + 1);
                    } else {
                        options += self.buildOption(item, level);
                    }
                });
                return options;
            },
            getItems: function() {
                var items = [];
                if (self.options.placeholder) {
                    items = items.concat({
                        value: "#",
                        label: self.options.placeholder,
                        linkable: false
                    });
                }

                items = items.concat(self.options.getItemsFromList.call(self, self.$element, 1));
                return items;
            },

            // Get link url
            getItemValue: function($li) {
                return $li.find(self.options.linkSelector).attr('href');
            },

            // Check if a item can link
            isLinkable: function($li) {
                return self.getItemValue($li) !== '#';
            },

            // Check if a item is actived
            isActived: function($li) {
                return $li.is('.' + self.options.activeClass);
            },

            // Check if select is builded already
            isBuilded: function() {
                return self._isBuilded;
            }
        });
        this.init();
    };

    // Default options for the plugin as a simple object
    NavToSelect.defaults = {
        maxLevel: 4,
        prependTo: null,
        activeClass: 'active',
        linkSelector: 'a:first',
        indentString: '&ndash;',
        indentSpace: true,
        placeholder: 'Navigate to...',
        useOptgroup: false,
        namespace: 'navToSelect',
        itemFilter: function($li) {
            return true;
        },
        getItemLabel: function($li) {
            return $li.find(this.options.linkSelector).text();
        },
        getItemsFromList: function($list, level) {
            var self = this;
            var _items = [];

            $list.children('li').each(function() {
                var $li = $(this);
                if (!self.options.itemFilter($li)) {
                    return;
                }
                var item = {
                    value: self.getItemValue($li),
                    label: self.options.getItemLabel.call(self, $li),
                    linkable: self.isLinkable($li),
                    actived: self.isActived($li)
                };
                if ($li.children('ul, ol').length) {
                    item.items = [];
                    $li.children('ul, ol').each(function() {
                        item.items = item.items.concat(self.options.getItemsFromList.call(self, $(this), level + 1));
                    });
                }

                _items.push(item);
            });
            return _items;
        },
        onChange: function() {
            if ($(this).data('linkable') !== false) {
                document.location.href = this.value;
            }
        }
    };

    NavToSelect.prototype = {
        constructor: NavToSelect,

        getSelect: function() {
            return this.$select;
        },
        destroy: function() {
            this.$select.remove();
            this.$element.data('NavToSelect', null);
        }
    };

    // Collection method.
    $.fn.navToSelect = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = Array.prototype.slice.call(arguments, 1);

            if (/^(getSelect)$/.test(method)) {
                var api = this.first().data('navToSelect');
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, 'navToSelect');
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                var api = $.data(this, 'navToSelect');
                if (!api) {
                    api = new NavToSelect(this, options);
                    $.data(this, 'navToSelect', api);
                }
            });
        }
    };
}(window, document, jQuery));
