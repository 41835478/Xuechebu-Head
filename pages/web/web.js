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
  if (e.id == 0 || e.id == '') {
    url = 'https://jptest5.xuechebu.com/xuechebu/information.html?pdcode=XZD_XWZX';
  } else {
    url = 'https://jptest5.xuechebu.com/xuechebu/article.html?id=' + e.id;
  }

  this.setData({
    url: url
  });

  }
})
