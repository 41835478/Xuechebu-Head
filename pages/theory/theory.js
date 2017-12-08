var Zan = require('../../dist/index');
var wxCharts = require('../../utils/wxcharts.js');
var lineChart = null;

Page(Object.assign({}, Zan.Tab, {
  data: {
    tab1: {
      list: [{
        id: 'all',
        title: '满学时统计'
      }, {
        id: 'topay',
        title: '满学时未约考统计'
      }],
      selectedId: 'all',
      scroll: false
    },
    show: 'film_favorite',
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
    ],
    classifyArray: [
      '报名时间',
      '报名人数',
      '数据变化'
    ],
    kemuArray: [
      {
        kemuName: '科目一',
        cavasId: 'kemu1'
      },
      {
        kemuName: '科目四',
        cavasId: 'kemu4'
      }
    ]
  },

  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      show: 'film_favorite',

      [`${componentId}.selectedId`]: selectedId
    });
  },

  setDate(e) {
    var that = this;
    var txtArray = [];
    for (var i = 0; i < that.data.dateArray.length; i++) {
      if (e.currentTarget.dataset.date == that.data.dateArray[i].date) {
        txtArray.push({ date: that.data.dateArray[i].date, changeColor: 'selected' });
      } else {
        txtArray.push({ date: that.data.dateArray[i].date, changeColor: 'normal' });
      }
    }
    that.setData({
      dateArray: txtArray
    });
  },

  onLoad: function (e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    for (var i = 0; i < this.data.kemuArray.length; i++) {
      var simulationData = this.createSimulationData();
      lineChart = new wxCharts({
        canvasId: this.data.kemuArray[i].cavasId,
        type: 'line',
        categories: simulationData.categories,
        animation: true,
        // background: '#f5f5f5',
        series: [{
          name: '满学时人数',
          data: simulationData.data,
          format: function (val, name) {
            return val.toFixed(2) + '万';
          }
        }, {
            name: '满学时人数',
          data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
          format: function (val, name) {
            return val.toFixed(2) + '万';
          }
        }],
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          // title: '成交金额 (万元)',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0
        },
        width: windowWidth,
        height: 200,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
    }
  },

  createSimulationData: function () {
    var categories = [];
    var data = [];
    for (var i = 0; i < 10; i++) {
      categories.push('2016-' + (i + 1));
      data.push(Math.random() * (20 - 10) + 10);
    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  }

}));
