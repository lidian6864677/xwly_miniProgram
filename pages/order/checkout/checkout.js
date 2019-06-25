const AV = require('../../../utils/av-weapp-min.js')
var app = getApp();
Page({
  data: {
    amount: 0,
    carts: [],
    addressList: [],
    addressIndex: 0
  },
  addressObjects: [],
  onLoad: function (options) {
    this.readCarts(options);
  },
  onShow: function () {
    this.loadAddress();
  },
  readCarts: function (options) {
    var that = this;
    // from carts
    // amount
    var amount = parseFloat(options.amount);
    this.setData({
      amount: amount
    });

    // cartIds str
    var cartIds = options.cartIds;
    var cartIdArray = cartIds.split(',');
    // restore carts object
    for (var i = 0; i < cartIdArray.length; i++) {
      var query = new AV.Query('Cart');
      query.include('goods');
      query.get(cartIdArray[i]).then(function (cart) {
        var carts = that.data.carts == undefined ? [] : that.data.carts;
        carts.push(cart);
        that.setData({
          carts: carts
        });
      }, function (error) {

      });
    }
  },
  confirmOrder: function () {

    wx.showToast({
      title: '暂不支持线上购买,可拨打订购热线订购',
      icon: 'none',
      duration: 2000
    })
    return;
    // submit order
    var carts = this.data.carts;
    var that = this;
    var user = AV.User.current();
    var order = new AV.Object('Order');
    order.set('user', user);
    order.set('status', 0);
    order.set('amount', this.data.amount);
    // set address
    var address = this.addressObjects[this.data.addressIndex];
    order.set('address', address);
    order.save().then(function (saveResult) {
      if (saveResult) {
        // OrderGoodsMap数组，批量提交
        var orderGoodsMapArray = [];
        // create buys & delete carts
        for (var i = 0; i < carts.length; i++) {
          // 创建订单商品中间表OrderGoodsMap
          var orderGoodsMap = AV.Object('OrderGoodsMap');
          // 遍历购物车对象
          // move cart to buy
          var cart = carts[i];
          orderGoodsMap.set('order', saveResult);
          orderGoodsMap.set('goods', cart.get('goods'));
          orderGoodsMap.set('quantity', cart.get('quantity'));
          orderGoodsMap.set('user', cart.get('user'));
          cart.destroy();
          orderGoodsMapArray.push(orderGoodsMap);
        }
        AV.Object.saveAll(orderGoodsMapArray).then(function () {
          // 保存到云端
          that.pay({
            orderId: order.get('objectId'),
            totalFee: that.data.amount
          })

        });
      }
    });
  },
  pay: function ({ orderId, totalFee }) {
    var that = this;
    var paramsJson = {
      // openid: app.globalData.openid,
      body: '兴旺粮油',
      tradeNo: orderId,
      totalFee: parseFloat(totalFee)
    }
    AV.Cloud.run('pay', paramsJson).then(function (response) {
      response = JSON.parse(response);
      // 调用成功，得到成功的应答 data
      console.log(response);
      // 发起支付
      wx.requestPayment({
        'timeStamp': response.timeStamp,
        'nonceStr': response.nonceStr,
        'package': response.package,
        'signType': 'MD5',
        'paySign': response.paySign,
        'success': function (res) {
          wx.showToast({
            title: '支付成功'
          });
          // update order，此处是不良示范，应该通过上述SetNotify_url回调通知里在服务端更新订单状态
          var query = new AV.Query('Order');
          query.get(that.data.orderId).then(function (order) {
            order.set('status', 1);
            order.save();
            console.log('status: ' + 1);
          }, function (err) {
          });
        }
      });
    }, function (err) {
      // 处理调用失败
      console.log(err);
    });


    // AV.Cloud.run('pay', paramsJson).then(function (response) {
    //   response = JSON.parse(response);
    //   // 调用成功，得到成功的应答 data
    //   console.log(response);
    //   // 发起支付
    //   wx.requestPayment({
    //     'timeStamp': response.timeStamp,
    //     'nonceStr': response.nonceStr,
    //     'package': response.package,
    //     'signType': 'MD5',
    //     'paySign': response.paySign,
    //     'success': function (res) {
    //       wx.showToast({
    //         title: '支付成功'
    //       });
    //       // update order
    //       var query = new AV.Query('Order');
    //       query.get(that.data.orderId).then(function (order) {
    //       	order.set('status', 1);
    //       	order.save();
    //       	console.log('status: ' + 1);
    //       }, function (err) {

    //       });
    //       wx.navigateTo({
    //         url: '../list/list?status=1'
    //       });
    //     }
    //   });
    // }, function (err) {
    //   // 处理调用失败
    //   console.log(err);
    // });
  },

  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: '0452-6864677',
    })
  },

  loadAddress: function () {
    var that = this;
    var user = AV.User.current();
    var query = new AV.Query('Address');
    query.equalTo('user', user);
    query.find().then(function (address) {
      var addressList = [];
      var addressObjects = [];
      for (var i = 0; i < address.length; i++) {
        // find the default address
        if (address[i].get('isDefault') == true) {
          that.setData({
            addressIndex: i
          });
        }
        addressList.push(address[i].get('detail'));
      }
      that.setData({
        addressList: addressList
      });
      that.addressObjects = address;
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      addressIndex: e.detail.value
    })
  },
  bindCreateNew: function () {
    var addressList = this.data.addressList;
    if (addressList.length == 0) {
      wx.navigateTo({
        url: '../../address/add/add'
      });
    }
  }
})