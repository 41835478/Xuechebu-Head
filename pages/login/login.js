//获取应用实例
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    has_get_vcode: false,//默认
    mobile_login: false,//默认
    vcodeGetTime: 0,
    inputVcode: '',
    userInfo: {},
    inputMobileNumber: '',
    checkMobilePass: false,
    systemInfo: {},
    fromPage: '',
    motto: '什么👻',
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },

  // onLoad: function (obj) {
  //   var that = this;
  //   var fromPage;
  //   console.log(obj);
  //   if (obj && obj.fromPage) {
  //     fromPage = obj.fromPage.replace("pages", "..");
  //     that.setData({
  //       fromPage: fromPage
  //     });
  //   }

  //   wx.getSystemInfo({
  //     success: function (res) {
  //       that.setData({
  //         systemInfo: res
  //       });
  //     }
  //   })
  // },
  onShow: function () {

  },
  //选择微信号登录
  tapWeixinLogin: function (cal) {
    var that = this;
    var userInfo = {};
    wx.showToast({
      title: '加载中……',
      icon: 'loading',
      duration: 3000
    });
    wx.login({
      success: function (wxRes) {
        if (wxRes.code) {
          util.JFrequest({
            url: 'https://t.superabc.cn/c/s/wxapplogin',
            param: {
              js_code: wxRes.code,
            },
            success: function (res) {
              if (res && res.statusCode == 200 && res.data && res.data.code == 0) {
                userInfo = {
                  mobile_no: res.data.data.mobile_no,
                  openid: res.data.data.openid,
                  portrait: res.data.data.portrait,
                  user_id: res.data.data.user_id,
                  user_name: res.data.data.user_name
                };
                //种下utoken
                wx.setStorage({
                  key: "utoken",
                  data: res.data.data.utoken
                });
                //存储个人信息
                app.setUserInfo(userInfo);
                wx.hideToast();
                //跳转到首页
                wx.navigateTo({
                  url: '../index/index'
                });

                if (typeof cal == 'function') {
                  cal(res.data.data);
                }
              } else {
                wx.navigateTo({
                  url: '../index/index'
                });
                wx.showToast({
                  title: '当前环境无法使用wx.login，请使用手机号登录',
                  icon: 'success',
                  duration: 3000
                });
              }
            }
          });
        } else {
          console.log("调用wx.login获取code失败");
        }
      }
    })
  },


  //选择手机号登录
  tapMobileLogin: function () {
    this.setData({
      mobile_login: true,
    })
  },
  tapGetVcode: function (e) {
    //获取vcode
    var that = this;
    if (that.data.checkMobilePass) {
      that._initVcodeTimer();
      //执行请求，获取vcode
      that.getVcode(function (data) {
        if (data.vcode) {
          that.setData({
            inputVcode: data.vcode
          })
        }
      });
    } else {
      return false;
    }

  },
  //获取验证码
  getVcode: function (cal) {
    var that = this;
    util.JFrequest({
      url: 'https://jptest2.xuechebu.com/sms/GetSmsRandCode',
      param: {
        mobile_no: that.data.inputMobileNumber,
        islogin: '1'
      },
      success: function (res) {
        if (res && res.statusCode == 200 && res.data && res.data.code == 0) {
          if (typeof cal == 'function') {
            cal(res.data.data);
          }
        } else {
          wx.showToast({
            title: res.err_msg,
            icon: 'success',
            duration: 1000
          });
          //
        }
      }
  
    });
  },
  //tapMobileLoginSubmit
  tapMobileLoginSubmit: function (cal) {
    wx.switchTab({
      url: '../line/line'
    });
    // var that = this;
    // var userInfo = {};
    // util.JFrequest({
    //   url: 'https://t.superabc.cn/c/s/mobilelogin',
    //   param: {
    //     mobile_no: that.data.inputMobileNumber,
    //     vcode: that.data.inputVcode
    //   },
    //   success: function (res) {
    //     if (res && res.statusCode == 200 && res.data && res.data.code == 0) {
    //       userInfo = {
    //         mobile_no: res.data.data.mobile_no,
    //         openid: res.data.data.openid,
    //         portrait: res.data.data.portrait,
    //         user_id: res.data.data.user_id,
    //         user_name: res.data.data.user_name
    //       };
    //       //种下utoken
    //       wx.setStorage({
    //         key: "utoken",
    //         data: res.data.data.utoken
    //       });
    //       //存储个人信息
    //       app.setUserInfo(userInfo);
    //       //跳转到首页
    //       wx.switchTab({
    //         url: '../line/line'
    //       });


    //       if (typeof cal == 'function') {
    //         cal(res.data.data);
    //       }
    //     } else {
    //       console.log("请求数据失败，读取缓存");
    //     }


    //   }
    // });
  },

  //校验手机号
  checkMobileRegExp: function (e) {
    var that = this;
    var number = e.detail.value;
    if (number.isPhoneNumber()) {
      that.setData({
        checkMobilePass: true,
        inputMobileNumber: number
      });
    } else {
      that.setData({
        checkMobilePass: false,
      });
    }
  },
  _initVcodeTimer: function () {
    var that = this;
    var initTime = 60;
    that.setData({
      has_get_vcode: true,
      vcodeGetTime: initTime
    });
    var vcodeTimer = setInterval(function () {
      initTime--;
      that.setData({
        vcodeGetTime: initTime
      });
      if (initTime <= 0) {
        clearInterval(vcodeTimer);
        that.setData({
          has_get_vcode: false
        });
      }
    }, 1000);
  }

});
