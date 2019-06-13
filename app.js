// 初始化AV
const AV = require('./utils/av-weapp.js');
const appId = "Ou5SioMNn3UvKp92NGUjPzcp-gzGzoHsz";
const appKey = "tLu5iRNoNEaQrisYLc03Ts28";

AV.init({
  appId: appId,
  appKey: appKey,
});

// 授权登录
App({
  onLaunch: function () {
    // auto login via SDK
    var that = this;
    const user = AV.User.current();
    // 调用小程序 API，得到用户信息
    AV.User.loginWithWeapp().then(user => {
      // this.globalData.user = user;
      // console.log(user)
    }).catch(console.error);

    // 设备信息
    wx.getSystemInfo({
      success: function (res) {
        that.screenWidth = res.windowWidth;
        that.screenHeight = res.windowHeight;
        that.pixelRatio = res.pixelRatio;
      }
    });
  },
  globalData: {
    userInfo: null
  },
})
