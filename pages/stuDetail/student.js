var Zan = require('../../dist/index');
var wxCharts = require('../../utils/wxcharts.js');
var lineChart = null;
var seletedTab = '1'; //查询学生类型1表示报名学员 2表示退学学员  3表示毕业学员
var dateTab = '1'; //1表示七天的 2表示一个月 3表示三个月 4表示本年度
Page(Object.assign({}, Zan.Tab, {
  data: {
    tab1: {
      list: [{
        id: '1',
        title: '报名人数'
      }, {
        id: '2',
        title: '退学人数'
      }, {
        id: '3',
        title: '毕业人数'
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
        id:'2'
      },
      {
        date: '近三个月',
        changeColor: 'normal',
        id:'3'
      },
      {
        date: '本年度',
        changeColor: 'normal',
        id:'4'
      }
    ],
    classifyArray:[
      '报名时间',
      '报名人数',
      '数据变化'
    ]
  },

//选择分类事件
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    seletedTab = selectedId;
    this.setData({    show: 'film_favorite',

      [`${componentId}.selectedId`]: selectedId
    });
  },
  
//选择日期事件
  setDate(e) {
    var that = this;
    var txtArray = [];
    for (var i = 0; i < that.data.dateArray.length; i++) {
      if (e.currentTarget.dataset.date == that.data.dateArray[i].date) {
        dateTab = that.data.dateArray[i].id;//记录选择的日期
        txtArray.push({date:that.data.dateArray[i].date, changeColor:'selected'});
      } else {
        txtArray.push({ date: that.data.dateArray[i].date, changeColor: 'normal' });
      }
    }
    that.setData({
      dateArray:txtArray
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

    this.loadData();
    //请求报名人数数据

    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '成交量1',
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }, {
        name: '成交量2',
        data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '成交金额 (万元)',
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

  loadData:function() {
    var that = this;
    wx.request({
      url: 'https://xzzstest1.xuechebu.com/SchoolMaster/statisticsdata/getSchoolStatisticsData',
      method: 'GET',
      data: {
        jgid: '14001',
        datetype : dateTab,
        studenttype : seletedTab
      },
      header: {
        "Content-Type": "json",
      },
      success: function (res) {
        that.setData({ dataSource: res.data })
      }
    })
  }

}));
