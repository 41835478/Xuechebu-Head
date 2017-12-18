var Zan = require('../../dist/index');
var wxCharts = require('../../utils/wxcharts.js');
var lineChart = null;
var seletedTab = '1'; //查询学生类型1表示报名学员 2表示退学学员  3表示毕业学员
var dateTab = '1'; //1表示七天的 2表示一个月 3表示三个月 4表示本年度
var jgid = wx.getStorageSync('JGID');
var chartArray = [];
var chartPassArray = [];
Page(Object.assign({}, Zan.Tab, {
  data: {
    tab1: {
      list: [{
        id: '1',
        title: '考试次数'
      }, {
        id: '2',
        title: '考试预约'
      }, {
        id: '3',
        title: '考试通过率'
      }],
      selectedId: '1',
      scroll: false
    },
    show: 'exam-time',
    dateArray: [
      {
        date: '最近一天',
        changeColor: 'selected',
        id:'1'
      },
      {
        date: '近七天',
        changeColor: 'normal',
        id:'2'
      },
      {
        date: '近一个月',
        changeColor: 'normal',
        id:'3'
      }
    ],
    classifyArray: [
      '考试次数',
      '通过人数',
      '未通过人数'
    ],
    kemuArray:[
      '科目一',
      '科目二',
      '科目三',
      '科目四',
    ],
    bookDataSource: []
  },

  touchHandler: function (e) {

    var newChart;
    if (seletedTab == '2') {
      newChart = chartArray[e.target.dataset.id];
    } else {
      newChart = chartPassArray[e.target.dataset.id];
    }
    newChart.scrollStart(e);
  },
  moveHandler: function (e) {
    var newChart;
    if (seletedTab == '2') {
      newChart = chartArray[e.target.dataset.id];
    } else {
      newChart = chartPassArray[e.target.dataset.id];
    }
    newChart.scroll(e);
  },
  touchEndHandler: function (e) {
    var newChart;
    if (seletedTab == '2') {
      newChart = chartArray[e.target.dataset.id];
    } else {
      newChart = chartPassArray[e.target.dataset.id];
    }
    newChart.scrollEnd(e);
  },

//选择分类栏目
  handleZanTabChange(e) {
    
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    //重置日期,默认选择近七天
    var that = this;
    var txtArray = [];
    // for (var i = 0; i < this.data.dateArray.length; i++) {
    //   if ('近七天' == that.data.dateArray[i].date) {
    //     dateTab = that.data.dateArray[i].id;//记录选择的日期
    //     txtArray.push({ date: that.data.dateArray[i].date, changeColor: 'selected', id: that.data.dateArray[i].id });
    //   } else {
    //     txtArray.push({ date: that.data.dateArray[i].date, changeColor: 'normal', id: that.data.dateArray[i].id });
    //   }
    // }
    // //刷新日期选择状态
    // that.setData({
    //   dateArray: txtArray
    // });
    seletedTab = selectedId;
    if (selectedId == '1') {
      this.setData({
        show: 'exam-time'
      })
    } else if (selectedId == '2') {
      this.setData({
        show: 'exam-book'

      })
    } else if (selectedId == '3') {
      this.setData({
        show: 'exam-pass'
      })
    }
    this.setData({

      [`${componentId}.selectedId`]: selectedId
    });
    if (seletedTab == '2') {
      if(!chartArray.length) {
        this.loadData();
      }
    }
    if (seletedTab == '3') {
      if (!chartPassArray.length) {
        this.loadData();
      }
    }
  },

//选择日期
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
    that.setData({
      dateArray: txtArray
    });
    this.loadData();
  },

  onLoad: function (e) {
    seletedTab = '1'; 
    dateTab = '1';
    chartArray = [];
    this.loadData();
  },
  loadData:function() {
    var kemuA = ['科目一', '科目二', '科目三', '科目四'];
    var that = this;
    wx.request({
      url: getApp().globalData.schoolURL + '/SchoolMaster/exam/getExamDate',
      method: 'GET',
      data: {
        jgid: '140001',
        datetype: dateTab,
        type : seletedTab
      },
      header: {
        "Content-Type": "json",
      },
      success: function (res) {
        var result = res.data;
        if(seletedTab == '1') {
          //考试次数
          var dataArray = [];
        } else if (seletedTab == '2') {
          //考试预约
          var dataArray = [];
          dataArray.push(result.data.keMu1DataList);
          dataArray.push(result.data.keMu2DataList);
          dataArray.push(result.data.keMu3DataList);
          dataArray.push(result.data.keMu4DataList);
          var bookSource = [];//预约数据源
          for (var i = 0; i < dataArray.length; i++) {
            var dataItem = dataArray[i];
            var categoryBook = [];
            var dataBook = [];
            for (var j = 0; j < dataItem.length; j++) {
              var item = dataItem[j];
              categoryBook.push(item.pdate);
              dataBook.push(item.enrollnum);
            }
            bookSource.push({
              category: categoryBook,
              data: dataBook,
              title: that.data.kemuArray[i] + '考试预约',
              cavasID: 'book'+i,
              kemuName : kemuA[i],
              id: i
            });
          }

          that.setData({
            bookDataSource: bookSource
          });
          //创建表单
          that.createBookChart(bookSource);
        } else if (seletedTab == '3'){
          //考试通过率
          var dataArray = [];
          dataArray.push(result.data.keMu1DataList);
          dataArray.push(result.data.keMu2DataList);
          dataArray.push(result.data.keMu3DataList);
          dataArray.push(result.data.keMu4DataList);
          var bookSource = [];//预约数据源
          for (var i = 0; i < dataArray.length; i++) {
            var dataItem = dataArray[i];
            var categoryBook = [];
            var dataBook = [];
            for (var j = 0; j < dataItem.length; j++) {
              var item = dataItem[j];
              categoryBook.push(item.pdate);
              dataBook.push(item.percentnum);
            }
            bookSource.push({
              category: categoryBook,
              data: dataBook,
              title: that.data.kemuArray[i] + '考试通过率',
              cavasID: 'pass' + i,
              kemuName: kemuA[i],
              id: i
            });
          }

          that.setData({
            passDataSource: bookSource
          });
          //创建表单
          that.createPassChart(bookSource);
        }
        
      }
    })
  },

// 创建预约表格
  createBookChart:function(dataSource) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    for (var i = 0; i < dataSource.length; i++) {
      var item = dataSource[i];
        var chartLine = new wxCharts({
          canvasId: item.cavasID,
          type: 'line',
          categories: item.category,
          animation: true,
          // background: '#f5f5f5',
          series: [{
            name: item.title,
            data: item.data,
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
    // this.setData({
    //   bookDataSource: dataSource
    // });
  },

  //创建通过率表格
  createPassChart: function (dataSource) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    for (var i = 0; i < dataSource.length; i++) {
      var item = dataSource[i];
      var chartLine = new wxCharts({
        canvasId: item.cavasID,
        type: 'line',
        categories: item.category,
        animation: true,
        // background: '#f5f5f5',
        series: [{
          name: item.title,
          data: item.data,
          format: function (val, name) {
            return val + '%';
          }
        }],
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          // title: '成交金额 (万元)',
          format: function (val) {
            return val.toFixed(0) + '%';
          },
          min: 0
        },
        width: windowWidth,
        height: 200,
        dataLabel: true,
        dataPointShape: true,
        enableScroll: true,
        extra: {
          lineStyle: 'curve'
        }
      });
      chartPassArray.push(chartLine);
    }
  }
  ,

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
