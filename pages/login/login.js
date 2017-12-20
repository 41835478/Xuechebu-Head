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


  // //选择手机号登录
  // tapMobileLogin: function () {
  //   this.setData({
  //     mobile_login: true,
  //   })
  // },
  tapGetVcode: function (e) {
    //获取vcode
    var that = this;
    if (that.data.checkMobilePass) {
      //执行请求，获取vcode
      that.getVcode(function (data) {
        // if (data.vcode) {
        //   that.setData({
        //     inputVcode: data.vcode
        //   })
        // }
      });
    } else {
      return false;
    }

  },
  //获取验证码
  getVcode: function (cal) {
    var that = this;
    wx.request({
      url: getApp().globalData.imageURL + '/sms/GetSmsRandCode',
      // url:  'https:/jptest2.xuechebu.com/sms/GetSmsRandCode',
      data: {
        phonenum: that.data.inputMobileNumber,
        codemark: "1",
        islogin: "1",
        divcetype: '7'
      },
      header: {
        'content-type': 'application/json' 
              },
      success: function (res) {
        var data = res.data
        if (data.code==0){
          that._initVcodeTimer();
          that.setData({
            has_get_vcode: true,
          })
       
        }else{
          that.showAlert(true, data.message);
        }
      }
    })
  
  },
  //tapMobileLoginSubmit
  tapMobileLoginSubmit: function (cal) {
    // wx.switchTab({
    //   url: '../line/line'
    // });

    //获取vcode
    var that = this;
    if (that.data.inputMobileNumber){
      if (that.data.has_get_vcode) {
        //执行网络请求，进行登录
        that.loginByPhone(function (data) {
          //回调
        });
      } else {
        new app.WeToast()
        that.showAlert(true, '请获取验证码!');

       
        return false;
      }

    }else{
      new app.WeToast()
      that.showAlert(true, '请输入手机号!');
      return false;
    }
  },

 loginByPhone:function(e){
   var that = this;
   var userInfo = {};
   wx.request({
     url: getApp().globalData.imageURL +'/UserCenter/UserInfo/LoginCode',
    //  url: 'https:/jptest2.xuechebu.com/UserCenter/UserInfo/LoginCode',

     data: { username: that.data.inputMobileNumber,
           code: that.data.inputVcode,
           usertype:'4',  
        },

    header: {
      'content-type': 'application/json' 
     },
     success: function (res) {
       var data = res.data

       if (data.code == 0) {
         //设置用户的数据
        wx.setStorageSync("userInfo", data.data),
        wx.setStorageSync('isLoginByPhone','true'),
        wx.setStorageSync('APIURLIOS', data.data.SchoolMasterUrl),
        wx.setStorageSync('JGID', data.data.JGID)
         that.setData({
           mobile_login: true,
         })
        
        wx.switchTab({
          url: '../main/index',
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          } 
         });
         
       } else {
        //  wx.showModal({
        //    title: data.message,
        //    content: '',
        //  })
        //  wx.showToast({
        //    title: data.message,
        //  })
         new app.WeToast()
         that.showAlert(true, data.message);
       }
     }
   })


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

  getInputVcode:function(e) {
    var that = this;
    var number = e.detail.value;
    if (number) {
      that.setData({
        has_get_vcode: true,
        inputVcode: number
      });
    } else {
      that.setData({
        has_get_vcode: false,
      });
    }
  }
  ,
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
      } else {
        that.setData({
          has_get_vcode: true
        });
      }
    }, 1000);
  },

  callPhone:function(){
    var that = this;
    wx.makePhoneCall({
      phoneNumber: '400-969-8088',
    })


  },
  showAlert:function(sucess, title) {
    // var image = '';
    // if(sucess) {
    //   image = 'data: image / png; base64, iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAMAAAApB0NrAAAAb1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8v0wLRAAAAJHRSTlMAnJiIn3CQg310ZwhMGg6iZHprXFFOGBNhVT+Ni0hDHxanqzycuq9OAAABM0lEQVQ4y32T3XaDIBCEWVTUEDUxWhtj/tp5/2fsAm1JFJgb4fgddnYZhBCtSKi1f3s1JZgqMwhBPaLIUYGhgYDLPUzoikAHXow5UDZBLwVAvV3uKQxpRvLP3838xdDHhmHkefrfzQRk65PqDtIjrlw2vTedQ7LdNfR4bVpC7t4Q113mPdUEVWwcjpKNT3922UsvtrqZYbZudN2qkPfUAYuBSoACiDeujd3cdxTylFXK3FFcZwXAeEnpAFYhkirAqpLJrAhGSxMldC05DMbTZYoWcnbP0l5LUDXsXBxUNhGEbOpcxhd30iYvu3CefEceYV19nuJ52Xcr47oGpEdCr6W1TW/z5CDfUSB115yhuyt0BLqTCGh+mieVRBiyJ7lCHgmUU1rcFE83qpFo4M93MnUDIz9bMRqeJ9tieAAAAABJRU5ErkJggg==';
    // } else {
    //   image = 'data: image / png; base64, iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAMAAAApB0NrAAAAb1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8v0wLRAAAAJHRSTlMAnJiIn3CQg310ZwhMGg6iZHprXFFOGBNhVT+Ni0hDHxanqzycuq9OAAABM0lEQVQ4y32T3XaDIBCEWVTUEDUxWhtj/tp5/2fsAm1JFJgb4fgddnYZhBCtSKi1f3s1JZgqMwhBPaLIUYGhgYDLPUzoikAHXow5UDZBLwVAvV3uKQxpRvLP3838xdDHhmHkefrfzQRk65PqDtIjrlw2vTedQ7LdNfR4bVpC7t4Q113mPdUEVWwcjpKNT3922UsvtrqZYbZudN2qkPfUAYuBSoACiDeujd3cdxTylFXK3FFcZwXAeEnpAFYhkirAqpLJrAhGSxMldC05DMbTZYoWcnbP0l5LUDXsXBxUNhGEbOpcxhd30iYvu3CefEceYV19nuJ52Xcr47oGpEdCr6W1TW/z5CDfUSB115yhuyt0BLqTCGh+mieVRBiyJ7lCHgmUU1rcFE83qpFo4M93MnUDIz9bMRqeJ9tieAAAAABJRU5ErkJggg==';
    // }
    var that = this;
    new app.WeToast()
    that.wetoast.toast({
      img: 'https://raw.githubusercontent.com/kiinlam/wetoast/master/images/cross.png',
      imgClassName: 'my_wetoast_img',
      imgMode: 'scaleToFill',
      title: title,
      titleClassName: 'my_wetoast_title',
      success(data) {
        console.log(Date.now() + ': success')
      },
      fail(data) {
        console.log(Date.now() + ': fail')
      },
      complete(data) {
        console.log(Date.now() + ': complete')
      }
    })
  }
});
