const AV = require('../../../utils/av-weapp.js')
Page({
  data: {
    orderId: ''
  },
  onLoad: function(options) {
    var orderId = options.orderId;
    var totalFee = options.totalFee;
    this.setData({
      orderId: orderId,
      totalFee: totalFee
    })
  },
  wechatPay: function() {
    wx.showToast({
      icon: 'none', 
      title: '暂不支持微信支付'
    });
    return;
    var that = this;
    //统一下单接口对接
    wx.request({
      url: 'https://xwly.leanapp.cn/index.php/WXPay',
      data: {
        openid: getApp().openid,
        body: '兴旺粮油',
        tradeNo: that.data.orderId,
        totalFee: parseFloat(that.data.totalFee) * 100
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(response) {
        // 发起支付
        wx.requestPayment({
          'timeStamp': response.data.timeStamp,
          'nonceStr': response.data.nonceStr,
          'package': response.data.package,
          'signType': 'MD5',
          'paySign': response.data.paySign,
          'success': function(res) {
            wx.showToast({
              title: '支付成功'
            });
            // update order
            var query = new AV.Query('Order');
            query.get(that.data.orderId).then(function(order) {
              order.set('status', 1);
              order.save();
              console.log('status: ' + 1);
            }, function(err) {
              console.log("失败");

            });
          }
        });
      }
    });
  },

  /// 货到付款
  onDeliveryPay: function() {
    var query = new AV.Query('Order');
    query.get(this.data.orderId).then(function(order) {
      wx.showToast({
        title: '支付成功'
      });
      order.set('status', 4); /// 货到付款
      order.save();
      setTimeout(function() {
        //要延时执行的代码
        wx.switchTab({
          url: '../../index/index',
        })
      }, 1500) //延迟时间 这里是1秒
    }, function(err) {
      console.log("货到付款存储失败");
    });

  }



})