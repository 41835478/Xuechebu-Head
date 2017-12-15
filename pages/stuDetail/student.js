var Zan = require('../../dist/index');
var wxCharts = require('../../utils/wxcharts.js');
var lineChart = null;
var seletedTab = '1'; //查询学生类型1表示报名学员 2表示退学学员  3表示毕业学员
var dateTab = '1'; //1表示七天的 2表示一个月 3表示三个月 4表示本年度
var jgid = wx.getStorageSync('JGID');

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

//选择分类事件 - 重绘表格
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    seletedTab = selectedId;
    if (selectedId == '1') {
      this.setData({
      classifyArray: [
        '报名时间',
        '报名人数',
        '数据变化'
        ]
      })
    } else if(selectedId == '2') {
      this.setData({
        classifyArray: [
          '退学时间',
          '退学人数',
          '数据变化'
        ]
      })
    } else if(selectedId == '3') {
      this.setData({
        classifyArray: [
          '毕业时间',
          '毕业人数',
          '数据变化'
        ]
      })
    }
    this.setData({    
      show: 'film_favorite',
      [`${componentId}.selectedId`]: selectedId
    });
  },
  
//选择日期事件 - 更新表格
  setDate(e) {
    var that = this;
    var txtArray = [];
    for (var i = 0; i < that.data.dateArray.length; i++) {
      if (e.currentTarget.dataset.date == that.data.dateArray[i].date) {
        dateTab = that.data.dateArray[i].id;//记录选择的日期
        txtArray.push({ date: that.data.dateArray[i].date, changeColor: 'selected', id: that.data.dateArray[i].id});
      } else {
        txtArray.push({ date: that.data.dateArray[i].date, changeColor: 'normal', id:that.data.dateArray[i].id });
      }
    }
    //刷新日期选择状态
    that.setData({
      dateArray:txtArray
    });
    this.loadData(false);
  },

  onLoad: function (e) {
    seletedTab = '1';
    dateTab = '1';
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    this.loadData(true);//新建表
    //请求报名人数数据
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

  loadData:function(changeTab) {
    var that = this;
    wx.request({
      url: getApp().globalData.schoolURL +'/SchoolMaster/statisticsdata/getSchoolStatisticsData',
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
        that.setData({ dataSource: res.data.data })//设置数据源
        if (changeTab) {
          that.createChart(res.data);//创建图表
        } else {
          that.updateChart(res.data);//更新图表
        }
      }
    })
  },

  //新建表
  createChart:function(data) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var category = this.getCategory(data);
    var data = this.getChartData(data);

    //新建表
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: category,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '报名人数',
        data: data,
        format: function (val, name) {
          return val.toFixed(0);
        }
      }],
      xAxis: {
        disableGrid: true,
        title: '报名人数',
        format: function (val) {
          return val.toFixed(0);
        }
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
      dataLabel: true,
      dataPointShape: false,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  updateChart:function(data) {
    //更新表
 
    var category = this.getCategory(data);
    var data = this.getChartData(data);
    var title = '';
    if (seletedTab == '1') {
      title = '报名人数';
    } else if (seletedTab == '2') {
      title = '退学人数';
    } else if (seletedTab == '3') {
      title = '毕业人数';
    }
    var series = [{
      name: title,
      data: data,
      format: function (val, name) {
        return val;
      }
    }];
    lineChart.updateData({
      categories: category,
      series: series
    });
  },

  //获取图标 横轴数据
  getCategory: function(data) {
    var category = [];
    for (var i = 0; i < data.data.length; i++) {
      category.push(data.data[i].pdate);
    }
    return category;

  },
  //获取图标的 纵轴数据
  getChartData: function(data) {
    var chartData = [];
    for (var i = 0; i < data.data.length; i++) {
      chartData.push(data.data[i].enrollnum);
    }

    return chartData;
  }
}));
