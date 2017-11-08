var wxCharts = require('../../utils/wxcharts.js');
var functions = require('../functions.js')
var url = wx.getStorageSync('APIURLIOS') +'/CsxqSchoolmaster/statisticsdata/getSchoolStatisticsData';
// var url = 'https://xzzstest1.xuechebu.com/CsxqSchoolmaster/statisticsdata/getSchoolStatisticsData';
// var jgid = 140001;
// var jgid = wx.getStorageSync('JGID');

var app = getApp();
var lineChart = null;
var lineChart2 = null;
var chartsArray = [];
var dataSource = [];



Page({
    data: {
      chartsList:[],
      todayTime:'',
      infoList:[],
      screenHeight: 0,
    },
    touchHandler: function (e) {
        console.log(e);
        var ds = e.target.dataset;
        lineChart = chartsArray[ds.id];
        lineChart.showToolTip(e, {
            // background: '#7cb5ec',
            format: function (item, category) {
                return category + ' ' + item.name + ':' + item.data 
            }
        });
    },    
    createSimulationData: function () {
        var categories = [];
        var data = [];
        for (var i = 0; i < 10; i++) {
            categories.push('2016-' + (i + 1));
            data.push(Math.random()*(20-10)+10);
        }
        // data[4] = null;
        return {
            categories: categories,
            data: data
        }
    },
    updateData: function (lineChart, info) {
        var series = [{
            name: info.title,
            data: info.data,
            color: info.color,
            format: function (val, name) {
                return val + info.unit;
            }
        }];
        lineChart.updateData({
            categories: info.categories,
            series: series,
             xAxis: {
              disableGrid: true,
              title: info.Xdes,
              format: function (val) {
                return val.toFixed(0) + info.unit;
              }
            },
            yAxis: {
              title: info.Ydes,
              format: function (val) {
                return val.toFixed(0) + info.unit;
              },
              min: 0
            },
        });
       
    },
    onLoad: function (e) {
      var that = this
      var newData = this.createSimulationData;
      var jgid = wx.getStorageSync('JGID');
      functions.fetchChartList(url, jgid, function(data){

       console.log(url);
       console.log(jgid);

        var infoArray = [];
        infoArray.push(
          {title:'报名人数',
            num:  data.data.enrollCount+'人'
          }
        );
        infoArray.push(
          {
            title: '退学人数',
            num: data.data.leaveCount+'人'
          }
        );
        infoArray.push(
          {
            title: '收入',
            num: (data.data.revenue/10000).toFixed(2)+'万元'
          }
        );
        var category1 = [];
        var data1 = [];
        var category2 = [];
        var data2 = [];
        var category3 = [];
        var data3 = [];
        var category4 = [];
        var data4 = [];
        var category5 = [];
        var data5 = [];
        var category6 = [];
        var data6 = [];
        var category7 = [];
        var data7 = [];
        var category8 = [];
        var data8 = [];
        var result1 = data.data.enrollweekData;//报名人数
        var result2 = data.data.revenueWeekData;//收入
        var result3 = data.data.kemu2EmptyWeekData;//科二训练空车率
        var result4 = data.data.kemu3EmptyWeekData;//科三训练空车率
        var result5 = data.data.kemu1EeamWeekData;//科一考试通过率
        var result6 = data.data.kemu2EeamWeekData;//科二考试通过率
        var result7 = data.data.kemu3EeamWeekData;//科三考试通过率
        var result8 = data.data.kemu4EeamWeekData;//科四考试通过率
        for (var i = 0; i < result1.length; i++) {
          var item = result1[i];
          category1.push(item.pdate);
          data1.push(item.enrollnum);
        }
        dataSource.push({
          categories: category1,
          data: data1,
          title: '报名人数',
          Ydes:'报名人数',
          Xdes:'报名人数',
          unit: '',
          id:0,
          color: '#0fb442',
          point: false
          });
      for (var i = 0; i < result2.length; i++) {
        var item = result2[i];
        category2.push(item.pdate);
        data2.push((item.enrollnum/100).toFixed(2));
      }
      dataSource.push({
        categories: category2,
        data: data2,
        title: '收入',
        Ydes: '收入(万元)',
        Xdes: '收入',
        unit: '万元',
        id: 1,
        color: '#069fed',
        point: true
      });

      for (var i = 0; i < result3.length; i++) {
        var item = result3[i];
        category3.push(item.pdate);
        data3.push(item.percentnum);
      }
      dataSource.push({
        categories: category3,
        data: data3,
        title: '科二训练空车率',
        Ydes: '科二训练空车率(%)',
        Xdes: '科二训练空车率',
        unit: '%',
        id: 2,
        color:'#ff3c3c',
        point: false
      });

      for (var i = 0; i < result4.length; i++) {
        var item = result4[i];
        category4.push(item.pdate);
        data4.push(item.percentnum);
      }
      dataSource.push({
        categories: category4,
        data: data4,
        title: '科三训练空车率',
        Ydes: '科三训练空车率(%)',
        Xdes: '科三训练空车率',
        unit: '%',
        id: 3,
        color: '#ffa911',
        point: false
      });
      for (var i = 0; i < result5.length; i++) {
        var item = result5[i];
        category5.push(item.pdate);
        data5.push(item.percentnum);
      }
      dataSource.push({
        categories: category5,
        data: data5,
        title: '科一考试通过率',
        Ydes: '科一考试通过率(%)',
        Xdes: '科一考试通过率',
        unit: '%',
        id: 4,
        color: '#ffa911',
        point: false
      });

      for (var i = 0; i < result6.length; i++) {
        var item = result6[i];
        category6.push(item.pdate);
        data6.push(item.percentnum);
      }
      dataSource.push({
        categories: category6,
        data: data6,
        title: '科二考试通过率',
        Ydes: '科二考试通过率(%)',
        Xdes: '科二考试通过率',
        unit: '%',
        id: 5,
        color: '#ffa911',
        point: false
      });

      for (var i = 0; i < result7.length; i++) {
        var item = result7[i];
        category7.push(item.pdate);
        data7.push(item.percentnum);
      }
      dataSource.push({
        categories: category7,
        data: data7,
        title: '科三考试通过率',
        Ydes: '科三考试通过率(%)',
        Xdes: '科三考试通过率',
        unit: '%',
        id: 6,
        color: '#ffa911',
        point: false
      });
      for (var i = 0; i < result8.length; i++) {
        var item = result8[i];
        category8.push(item.pdate);
        data8.push(item.percentnum);
      }
      dataSource.push({
        categories: category8,
        data: data8,
        title: '科四考试通过率',
        Ydes: '科四考试通过率(%)',
        Xdes: '科四考试通过率',
        unit: '%',
        id: 7,
        color: '#ffa911',
        point: false
      });
      for (var i = 0; i < 8; i++) {
        var info = dataSource[i];
        var series = [{
          name: info.Xdes,
          data: info.data,
          format: function (val, name) {
            return val.toFixed(2);
          }
        }];
        chartsArray.push(new wxCharts({
          name: info.title,
          canvasId: 'lineCanvas' + i,
          type: 'line',
          categories: info.categories,
          animation: true,
          background: '#f5f5f5',
          series: series,
          xAxis: {
            disableGrid: true,
            title: info.Xdes,
            format: function (val) {
              return val.toFixed(0);
            }
          },
          yAxis: {
            title: info.Ydes,
            format: function (val) {
              return val.toFixed(0);
            },
            min: 0
          },
          width: windowWidth,
          height: 200,
          dataLabel: true,
          dataPointShape: info.point,
          extra: {
            lineStyle: 'curve'
          }
        }));
      } 
      that.setData({
        chartsList: dataSource,
        todayTime: data.data.todaytime,
        infoList: infoArray,
        screenHeight: wx.getSystemInfoSync().windowHeight - 90
      });  
      that.updateData(chartsArray[1], dataSource[1]);
      that.updateData(chartsArray[2], dataSource[2]);
      that.updateData(chartsArray[0], dataSource[0]);
      that.updateData(chartsArray[3], dataSource[3]);
      that.updateData(chartsArray[4], dataSource[4]);
      that.updateData(chartsArray[5], dataSource[5]);
      that.updateData(chartsArray[6], dataSource[6]);
      that.updateData(chartsArray[7], dataSource[7]);

   });
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        
        // for (var i = 0;i < 5; i++) {
        //   var simulationData = this.createSimulationData();
        //   chartsArray.push(new wxCharts({
        //     canvasId: 'lineCanvas'+i,
        //     type: 'line',
        //     categories: simulationData.categories,
        //     animation: true,
        //     background: '#f5f5f5',
        //     series: [{
        //       name: '成交量1',
        //       data: simulationData.data,
        //       format: function (val, name) {
        //         return val.toFixed(2) + '万';
        //       }
        //     }, {
        //       name: '成交量2',
        //       data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
        //       format: function (val, name) {
        //         return val.toFixed(2) + '万';
        //       }
        //     }],
        //     xAxis: {
        //       disableGrid: true
        //     },
        //     yAxis: {
        //       // title: '成交金额 (万元)',
        //       format: function (val) {
        //         return val.toFixed(2);
        //       },
        //       min: 0
        //     },
        //     width: windowWidth,
        //     height: 200,
        //     dataLabel: true,
        //     dataPointShape: true,
        //     extra: {
        //       lineStyle: 'curve'
        //     }
        //   }));
        // }
}});