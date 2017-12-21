var store = require('./store.js')
var config = require('./config.js')
var imageURL = getApp().globalData.imageURL; 
var webURL = getApp().globalData.webURL; 
var schoolURL = getApp().globalData.schoolURL;

module.exports = {
  getLocation: function (cb) {
    var location = store.location
    if (location) {
      cb(location)
      return;
    }
    wx.getLocation({
      success: function (res) {
        var locationParam = res.latitude + ',' + res.longitude
        wx.request({
          url: 'https://api.map.baidu.com/geocoder/v2/?ak=' + config.baiduAK + '&location=' + locationParam + '1&output=json&pois=1',
          header: {
            "Content-Type": "json",
          },
          success: function (res) {
            var data = res.data
            store.location = data.result
            cb(data.result)
          }
        })
      }
    })
  },
  getCity: function (cb) {
    this.getLocation(function (location) {
      cb(location.addressComponent.city.replace('市', ''))
    })
  },
  fetchFilms: function (url, city, start, count, cb) {
    var that = this
    wx.request({
      url: url + '?city=' + city + '&start=' + start + '&count=' + count,
      header: {
        "Content-Type": "json",
      },
      success: function (res) {
        var data = res.data
        if (data.subjects.length === 0) {
          that.setData({
            hasMore: false,
          })
        } else {
          that.setData({
            films: that.data.films.concat(data.subjects),
            start: that.data.start + data.subjects.length
          })
        }
        cb(data)
      }
    })
  },
  getMaxNumFromArray:function(array) {
    var max = 0;
    for(var i = 0; i < array.length; i ++) {
      if(array[i] > max) {
        max = array[i];
      }
    }
    return max;
  },
  getYAtrWithNum:function(minNum) {
    var yatr = {};
    if (minNum >= 5) {
      yatr = {
        // title: '成交金额 (万元)',
        format: function (val) {
          return val.toFixed(0);
        },
        min: 0,
      }
    } else {
      yatr = {
        // title: '成交金额 (万元)',
        format: function (val) {
          return val.toFixed(0);
        },
        min: 0,
        max: 5
      }
    }
    return yatr;
  },
  getYAtrWithNumUnit: function (minNum, unit) {
    var yatr = {};
    if(unit == '%') {
      if (minNum >= 5) {
        yatr = {
          // title: '成交金额 (万元)',
          format: function (val) {
            return val.toFixed(0) + unit;
          },
          min: 0,
          max:100
        }
      } else {
        yatr = {
          // title: '成交金额 (万元)',
          format: function (val) {
            return val.toFixed(0) + unit;
          },
          min: 0,
          max: 100
        }
      }
    } else {
      if (minNum >= 5) {
        yatr = {
          // title: '成交金额 (万元)',
          format: function (val) {
            return val.toFixed(0) + unit;
          },
          min: 0,
        }
      } else {
        yatr = {
          // title: '成交金额 (万元)',
          format: function (val) {
            return val.toFixed(0) + unit;
          },
          min: 0,
          max: 5
        }
      }
    }
    
    return yatr;
  },
  getYAtrWithUnitNum: function (minNum, unit) {
    var yatr = {};
    if (minNum >= 5) {
      yatr = {
        // title: '成交金额 (万元)',
        format: function (val) {
          return unit + val.toFixed(0);
        },
        min: 0,
      }
    } else {
      yatr = {
        // title: '成交金额 (万元)',
        format: function (val) {
          return unit + val.toFixed(0);
        },
        min: 0,
        max: 5
      }
    }
    return yatr;
  }
  ,
  fetchChartList: function (url, jgid, cb) {
    var that = this
    wx.request({
      url: url ,
      data: {jgid: jgid
      },
      header: {
        "Content-Type": "json",
      },
      success: function (res) {
        var data = res.data
        // if (data.subjects.length === 0) {
        //   that.setData({
        //     hasMore: false,
        //   })
        // } else {
        //     films: that.data.films.concat(data.subjects),
        //   that.setData({
        //     start: that.data.start + data.subjects.length
        //   })
        // }
        cb(data)
      }
    })
  },
  getVeriCode:function(url,parameters,callback){
    var that = this
    wx.request({
      url: url,
      data: parameters,
      header: {
        "Content-Type": "json",
      },
      success: function (res) {
        var data = res.data
        // if (data.subjects.length === 0) {
        //   that.setData({
        //     hasMore: false,
        //   })
        // } else {
        //   that.setData({
        //     films: that.data.films.concat(data.subjects),
        //     start: that.data.start + data.subjects.length
        //   })
        // }
        cb(data)
      }
    })
  }
}
