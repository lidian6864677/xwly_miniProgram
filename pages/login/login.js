var app = getApp();
const AV = require('../../utils/av-weapp-min.js')
Page({
  onLoad: function (options) {
    this.login();
  },
  login: function () {
    var that = this
    // 调用微信登录接口
    wx.login({
      success: function (res) {
        const user = AV.User.current();
        wx.getUserInfo({
          success: ({ userInfo }) => {
            // 更新当前用户的信息
            if (userInfo) {
              user.set(userInfo).save().then(user => {
                // 成功，此时可在控制台中看到更新后的用户信息
                app.globalData.userInfo = user;
                that.userInfo = user;
                app.userInfo = user;
                app.globalData.openId = user.attributes.authData.lc_weapp.openid;
                that.openid = user.attributes.authData.lc_weapp.openid;
                console.log(user)
                that.setData({
                  canIUse: false
                })
                wx.switchTab({
                  url: '../index/index'
                });
              }).catch(console.error);
            }
          }, fail: function (res) {
            console.log('获取用户登录态失败！' + res.errMsg)
            that.setData({
              canIUse: true
            })
          }
        });
        // if (res.code) {
        //   that.code = res.code;
        //   wx.request({
        //     url: 'https://xwly.leanapp.cn/index.php/WXPay/getSession',
        //     data: {
        //       code: res.code,
        //     },
        //     method: "POST",
        //     header: {
        //       'content-type': 'application/x-www-form-urlencoded'
        //     },
        //     success: function (response) {
        //       app.globalData.openid = response.data.openid;
        //       that.openid = response.data.openid;
        //       app.openid = response.data.openid;
        //     }
        //   })
        // }
        // wx.getUserInfo({
        //   success: function (res) {
        //     console.log(res)
        //     that.setData({
        //       canIUse: false
        //     })
        //     wx.switchTab({
        //       url: '../index/index'
        //     });
        // if (res.code) {
        //   that.code = res.code;
        //   // 获取openId并缓存
        // wx.request({
        //   url: 'https://xwly.leanapp.cn/index.php/WXPay/getSession',
        //   data: {
        //     code: res.code,
        //   },
        //   method: 'POST',
        //   header: {
        //     'content-type': 'application/x-www-form-urlencoded'
        //   },
        //   success: function (response) {
        //     that.openid = response.data.openid;
        //   }
        // });
        // }
        // },
        // fail: function (res) {
        //   console.log('获取用户登录态失败！' + res.errMsg)
        //   that.setData({
        //     canIUse: true
        //   })
        // }
        // })
      }
    })
  },

  bindGetUserInfo: function (e) {
    this.login();
    this.setData({
      canIUse: false
    })
  },
})