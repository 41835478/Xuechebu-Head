var Zan = require('../../dist/index');
var wxCharts = require('../../utils/wxcharts.js');
var lineChart = null;
var chartArray = [];
var seletedTab = '1'; //1表示查询空车率 2表示查询预约学员

Page(Object.assign({}, Zan.Tab, {
  data: {
    tab1: {
      list: [{
        id: '1',
        title: '空车率'
      }, {
        id: '2',
        title: '车辆预约'
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
        kemuName: '科目二',
        cavasId: 'kemu2',
        id: 0
      },
      {
        kemuName: '科目三',
        cavasId: 'kemu3',
        id : 1
      }
    ]
  },
  touchHandler: function (e) {
    var newChart = chartArray[e.target.dataset.id];
    newChart.scrollStart(e);
  },
  moveHandler: function (e) {
    var newChart = chartArray[e.target.dataset.id];
    newChart.scroll(e);
  },
  touchEndHandler: function (e) {
    var newChart = chartArray[e.target.dataset.id];
    newChart.scrollEnd(e);
  },
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    seletedTab = selectedId;
    var show = 'film_favorite';
    if(seletedTab == '1') {
      var show = 'film_favorite';
    } else {
      var show = 'film';
    }
    this.setData({
      show: show,

      [`${componentId}.selectedId`]: selectedId
    });
    this.loadData();
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
  
  loadData:function() {
    var that = this;
    wx.request({
      url: getApp().globalData.schoolURL + '/SchoolMaster/cardrill/getcardrilldata',
      method: 'GET',
      data: {
        jgid: '140001',
        type: seletedTab
      },
      header: {
        "Content-Type": "json",
      },
      success: function (res) {
        that.setData({ dataSource: res.data.data })//设置数据源
        that.createChartWithData(res.data);
      }
    })
  },

  //新建表
  createChartWithData: function (data) {
    var category = [];
    var allData = [];

    var category1 = [];
    var data1 = [];
    var category2 = [];
    var data2 = [];
    var result1;
    var result2;
    var title = '';

    if(seletedTab == '1') {
      result1 = data.data.kemu2EmptyPercent;//科二训练空车率
      result2 = data.data.kemu3EmptyPercent;//科三训练空车率
      title = '空车率';
      for (var i = 0; i < result1.length; i++) {
        var item = result1[i];
        category1.push(item.pdate);
        data1.push(item.percentnum);
      }
      for (var i = 0; i < result2.length; i++) {
        var item = result2[i];
        category2.push(item.pdate);
        data2.push(item.percentnum);
      }
    } else if(seletedTab == '2') {
      result1 = data.data.kemu2XunLian;//科二车辆预约
      result2 = data.data.kemu3XunLian;//科三车辆预约
      title = '车辆预约';
      if(!result1.length) {
        category1.push('暂无数据');
        data1.push(0);
        category2.push('暂无数据');
        data2.push(0);
      } else {
        for (var i = 0; i < result1.length; i++) {
          var item = result1[i];
          category1.push(item.pdate);
          data1.push(item.enrollnum);
        }
        for (var i = 0; i < result2.length; i++) {
          var item = result2[i];
          category2.push(item.pdate);
          data2.push(item.enrollnum);
        }
      }
    }
    if(!result1.length) {
      for (var i = 0; i < result1.length; i++) {
        var item = result1[i];
        category1.push(item.pdate);
        data1.push(item.percentnum);
      }
      for (var i = 0; i < result2.length; i++) {
        var item = result2[i];
        category2.push(item.pdate);
        data2.push(item.percentnum);
      }
    }
    category = [category1, category2];
    allData = [data1, data2];

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    if(!chartArray.length) {
      for (var i = 0; i < this.data.kemuArray.length; i++) {
        var chartLine = new wxCharts({
          canvasId: this.data.kemuArray[i].cavasId,
          type: 'line',
          categories: category[i],
          animation: true,
          // background: '#f5f5f5',
          series: [{
            name: this.data.kemuArray[i].kemuName + title,
            data: allData[i],
            format: function (val, name) {
              return val;
            }
          }],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            // title: '成交金额 (万元)',
            format: function (val) {
              return val.toFixed(0);
            },
            min: 0
          },
          width: windowWidth,
          height: 200,
          dataLabel: false,
          dataPointShape: true,
          enableScroll: true,
          extra: {
            lineStyle: 'curve'
          }
        });
        chartArray.push(chartLine);
      }
    } else {
      for (var i = 0; i < this.data.kemuArray.length; i++) {
        var chartLine = chartArray[i];
        var series = [{
          name: this.data.kemuArray[i].kemuName + title,
          data: allData[i],
          format: function (val, name) {
            return val.toFixed(0);
          }
        }];
        chartLine.updateData({
          categories: category[i],
          series: series,
        });
    }
    }
   

    // this.setData({kemuArray:this.data.kemuArray})
  },

  onLoad: function (e) {
    seletedTab = '1';
    chartArray = [];
    this.loadData();
  },

}));
