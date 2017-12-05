var Zan = require('../../dist/index');

Page(Object.assign({}, Zan.Tab, {
  data: {
    tab1: {
      list: [{
        id: 'all',
        title: '报名人数'
      }, {
        id: 'topay',
        title: '退学人数'
      }, {
        id: 'tosend',
        title: '毕业人数'
      }],
      selectedId: 'all',
      scroll: false
    },
    tab2: {
      list: [{
        id: '1',
        title: '最新商品1'
      }, {
        id: '2',
        title: '最新商品2'
      }, {
        id: '3',
        title: '最新商品3'
      }, {
        id: '4',
        title: '最新商品4'
      }, {
        id: '5',
        title: '最新商品5'
      }, {
        id: '6',
        title: '最新商品6'
      }],
      selectedId: '1',
      scroll: true,
      height: 45
    },
    tab3: {
      list: [{
        id: '1',
        title: '商品1'
      }, {
        id: '2',
        title: '商品2'
      }, {
        id: '3',
        title: '商品3'
      }, {
        id: '4',
        title: '商品4'
      }, {
        id: '5',
        title: '商品5'
      }, {
        id: '6',
        title: '商品6'
      }],
      selectedId: '1',
      scroll: true,
      height: 45
    }
  },

  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });
  }
}));
