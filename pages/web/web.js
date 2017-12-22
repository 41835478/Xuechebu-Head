//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '什么👻',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../login/login'
    })
  },
  logOut: function() {
    wx.clearStorage();
    wx.redirectTo({
      url: '../login/login',
    })
  },
  onLoad: function (e) {
  //   console.log('onLoad')
  //   var that = this
  //  // 调用应用实例的方法获取全局数据
  //   app.getUserInfo(function(userInfo){
  //     //更新数据
  //     that.setData({
  //       userInfo:userInfo
  //     })
  //   })
  var url = '';
  if (e.type == 1) {
    if (e.id == 0 || e.id == '') {
      url = getApp().globalData.webDetail + '/xuechebu/information.html?pdcode=XZD_XWZX';
    } else {
      url = getApp().globalData.webDetail + '/xuechebu/article.html?id=' + e.id;
    }
  } else {
    var data = wx.getStorageSync('ScrollData');
    for (var i = 0;i < data.length; i++) {
      var item = data[i];
      if(e.id == item.id) {
        url = item.url;
      }
    }
  }
  

  this.setData({
    url: url
  });

  }
})
