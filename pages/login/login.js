var app = getApp();
Page({
  onLoad: function (options) {
    var that = this
    //调用微信登录接口
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            console.log(res)
            that.setData({
              canIUse: false
            })
            wx.switchTab({
              url: '../index/index'
            });
            if (res.code) {
              that.code = res.code;
              // 获取openId并缓存
              wx.request({
                url: 'https://xwly.leanapp.cn/index.php/WXPay/getSession',
                data: {
                  code: res.code,
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (response) {
                  that.openid = response.data.openid;
                }
              });
            }
          },
          fail: function (res) {
            console.log('获取用户登录态失败！' + res.errMsg)
            that.setData({
              canIUse: true
            })
          }
        })
      }
    })
  },

  bindGetUserInfo: function (e) {
    console.log(e)
    // app.globalData.userInfo = e.detail.userInfo
    this.setData({
      canIUse: false
    })
    wx.switchTab({
      url: '../index/index'
    })
  },
})