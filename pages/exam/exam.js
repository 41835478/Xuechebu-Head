var Zan = require('../../dist/index');
var wxCharts = require('../../utils/wxcharts.js');
var lineChart = null;
var seletedTab = '2'; //查询学生类型1表示报名学员 2表示退学学员  3表示毕业学员
var dateTab = '1'; //1表示七天的 2表示一个月 3表示三个月 4表示本年度
var jgid = wx.getStorageSync('JGID');

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
    ]
  },

  handleZanTabChange(e) {
    
    var componentId = e.componentId;
    var selectedId = e.selectedId;
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
  },

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
  },

  onLoad: function (e) {
    var seletedTab = '2'; 
    var dateTab = '1';
    this.loadData();
  },
  loadData:function() {
    var that = this;
    wx.request({
      url: getApp().globalData.schoolURL + '/SchoolMaster/statisticsdata/getSchoolStatisticsData',
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
        var dataArray = [];
        dataArray.push(res.data.data.keMu1DataList);
        dataArray.push(res.data.data.keMu2DataList);
        dataArray.push(res.data.data.keMu3DataList);
        dataArray.push(res.data.data.keMu4DataList);
        
      }
    })
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
