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
    show:'film_favorite',
    dateArray: [
      {
        date: '近七天',
        changeColor: 'selected'
      },
      {
        date: '近一个月',
        changeColor: 'normal'
      },
      {
        date: '近三个月',
        changeColor: 'normal'
      },
      {
        date: '本年度',
        changeColor: 'normal'
      }
    ]
  },

  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({    show: 'film_favorite',

      [`${componentId}.selectedId`]: selectedId
    });
  },
  
  setDate(e) {
    var that = this;
    var txtArray = [];
    for (var i = 0; i < that.data.dateArray.length; i++) {
      if (e.currentTarget.dataset.date == that.data.dateArray[i].date) {
        txtArray.push({date:that.data.dateArray[i].date, changeColor:'selected'});
      } else {
        txtArray.push({ date: that.data.dateArray[i].date, changeColor: 'normal' });
      }
    }
    that.setData({
      dateArray:txtArray
    });
  }
}));
