var Zan = require('../../dist/index');
var wxCharts = require('../../utils/wxcharts.js');
var functions = require('../functions.js');

var lineChart = null;
var seletedTab = '1';
var dateTab = '1';
Page(Object.assign({}, Zan.Tab, {
  data: {
    tab1: {
      list: [{
        id: '1',
        title: '全部收入'
      }, {
        id: '2',
        title: '报名收入'
      }, {
        id: '3',
        title: '考试收入'
      }, {
        id: '4',
        title: '训练收入'
      }, {
        id: '5',
        title: '其他收入'
      }],
      selectedId: '1',
      scroll: false
    },
    show:'film_favorite',
    dateArray: [
      {
        date: '近七天',
        changeColor: 'selected',
        id:'1'
      },
      {
        date: '近一个月',
        changeColor: 'normal',
        id: '2'

      },
      {
        date: '近三个月',
        changeColor: 'normal',
        id: '3'

      },
      {
        date: '本年度',
        changeColor: 'normal',
        id: '4'

      }
    ],
    classifyArray:[
      '收费日期',
      '数量    ',
      ' 总金额 '
    ]
  },
  touchHandler: function (e) {
    lineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
  },

//选择分栏
  handleZanTabChange(e) {
    //重置日期,默认选择近七天
    var that = this;
    var txtArray = [];
    for (var i = 0; i < this.data.dateArray.length; i++) {
      if ('近七天' == that.data.dateArray[i].date) {
        dateTab = that.data.dateArray[i].id;//记录选择的日期
        txtArray.push({ date: that.data.dateArray[i].date, changeColor: 'selected', id: that.data.dateArray[i].id });
      } else {
        txtArray.push({ date: that.data.dateArray[i].date, changeColor: 'normal', id: that.data.dateArray[i].id });
      }
    }
    //刷新日期选择状态
    that.setData({
      dateArray: txtArray
    });
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    seletedTab = selectedId;
    this.setData({ 

      [`${componentId}.selectedId`]: selectedId
    });
    this.loadData();
  },
  
  //改变日期
  setDate(e) {
    var that = this;
    var txtArray = [];
    for (var i = 0; i < that.data.dateArray.length; i++) {
      if (e.currentTarget.dataset.date == that.data.dateArray[i].date) {
        dateTab = that.data.dateArray[i].id;//记录选择的日期
        txtArray.push({ date: that.data.dateArray[i].date, changeColor: 'selected', id: that.data.dateArray[i].id });
      } else {
        txtArray.push({ date: that.data.dateArray[i].date, changeColor: 'normal', id: that.data.dateArray[i].id });
      }
    }
    //刷新日期选择状态
    that.setData({
      dateArray: txtArray
    });
    this.loadData();
  },

  onLoad: function (e) {
    seletedTab = '1';
    dateTab = '1';
    lineChart = null;
    this.loadData();
    
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
  },

  //请求数据
  loadData:function() {
    var that = this;

    wx.request({
      url: wx.getStorageSync('APIURLIOS') + '/jiaxiaoapi/financialStatistics/getfinancialdata',
      method: 'GET',
      data: {
        jgid: wx.getStorageSync('JGID'),
        datetype: dateTab,
        type: seletedTab
      },
      header: {
        "Content-Type": "json",
      },
      success: function (res) {
        //设置数据源
        that.setData({ dataSource: res.data.data })
        if(lineChart == null) {
          that.createChartWithData(res.data.data);
        } else {
          that.createChartWithData(res.data.data);
        }
      }
    })
  },
  updateChartWithData:function(dataSource) {
    var title = '';
    if (seletedTab == '1') {
      title = '总收入';
    }
    if (seletedTab == '2') {
      title = '报名收入';
    }
    if (seletedTab == '3') {
      title = '考试收入'
    }
    if (seletedTab == '4') {
      title = '训练收入'
    }
    if (seletedTab == '5') {
      title = '其他收入'
    }
    var category = [];
    var data = [];
    for (var i = 0; i < dataSource.length; i++) {
      var item = dataSource[i];
      category.push(item.pdate);
      data.push(item.income);
    }
    var series = [{
      name: title,
      data: data,
      format: function (val, name) {
        return '¥' + val;
      }
    }];
    lineChart.updateData({
      categories: category,
      series: series,
    });  
  }
,

  //创建表
  createChartWithData:function(dataSource) {
    lineChart = null;
    var title = '';
    if(seletedTab == '1') {
      title = '总收入';
    }
    if(seletedTab == '2') {
      title = '报名收入';
    }
    if(seletedTab == '3') {
      title = '考试收入'
    }
    if(seletedTab == '4') {
      title = '训练收入'
    }
    if(seletedTab == '5') {
      title = '其他收入'
    }
    var category = [];
    var data = [];
    for(var i = 0; i < dataSource.length; i++) {
      var item = dataSource[i];
      category.push(item.pdate);
      data.push(item.income);
    }

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    //新建表
    var minNum = functions.getMaxNumFromArray(data);
    var yatr = functions.getYAtrWithUnitNum(minNum, '¥');
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: category,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: title,
        data: data,
        format: function (val, name) {
          return '¥' + val;
        }
      }],
      xAxis: {
        disableGrid: true,
        title: title,
        format: function (val) {
          return val.toFixed(0);
        }
      },
      yAxis: yatr,
      width: windowWidth,
      height: 200,
      dataLabel: true,
      dataPointShape: false,
      enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  }
}));
