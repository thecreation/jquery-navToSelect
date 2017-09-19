/* eslint no-unused-vars: "off" */

export default {
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
