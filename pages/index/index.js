const AV = require('../../utils/av-weapp.js')
Page({
	data: {
		banner: [],
		goods: [],
		bannerHeight: Math.ceil(290.0 / 750.0 * getApp().screenWidth)
	},
	onLoad: function (options) {
		this.loadBanner();
		this.loadMainGoods();
		this.getInviteCode(options);
	},
  onPullDownRefresh: function () {
    this.loadBanner();
    this.loadMainGoods();
  },
	getInviteCode: function (options) {
		if (options.uid != undefined) {
			wx.showToast({
				title: '来自用户:' + options.uid + '的分享',
				icon: 'success',
				duration: 2000
			})
		}
	},
	loadBanner: function () {
		var that = this;
		var query = new AV.Query('Banner');
		// query.include('image');
		query.find().then(function (bannerObjects) {
			var banner = [];
      // console.log(bannerObjects[0].get('image'))
			for (var i = 0; i < bannerObjects.length; i++) {  
				// banner.push(bannerObjects[i].get('image').get('url'));
        banner.push({ "url": bannerObjects[i].get('image').get('url'), "router": bannerObjects[i].get('router')})
			}
      // console.log(bannerObjects)
			that.setData({
				banner: banner
			});
		});
	},
	loadMainGoods: function () {
		var that = this;
		var query = new AV.Query('Goods');
		query.equalTo('isHot', true);
    query.equalTo('isNew', true);
		query.find().then(function (goodsObjects) {
      // console.log("goodsObjects:",goodsObjects)
      // var goodss = []
      // for (var i = 0, len = goodsObjects.length; i < len; i++) {
      //   goodss.push({ "avatar": goodsObjects[i].get('avatar'), "price": goodsObjects[i].get('price'), "title": goodsObjects[i].get('title')})
      // }

      // console.log("avatar:",goodsObjects[0].attributes.avatar)
			that.setData({
        goods: goodsObjects
			});
      console.log("goods",goodss)
		});

	},
	showDetail: function (e) {
		var index = e.currentTarget.dataset.index;
		var goodsId = this.data.goods[index].id;
		wx.navigateTo({
			url: "../goods/detail/detail?objectId=" + goodsId
		});
	},
	
	showOrders: function () {
    wx.switchTab({
      url: "../category/category"
    });
	},
  navigateToAddress: function () {
    wx.navigateTo({
      url: '../address/list/list'
    });
  },

  navToJinanxiangSellingZone: function () {
    wx.navigateTo({
      url: "../../../../goods/list/list?selectParentId=5cff8e38a673f50068e7fefc"
    });
  },

  // showCategories: function () {
  //   wx.switchTab({
  //     url: "../category/category"
  //   });
  // },
  navToHotSellingZone: function () {
    wx.navigateTo({
      url: "../../../../goods/list/list?hotSellingZone=1"
    });
  },
	onShareAppMessage: function () {
		return {
			title: '兴旺粮油经销处',
			desc: '一个电商系统',
			path: '/pages/index/index?uid=4719784'
		}
	},
	showGoods: function (e) {
    var index = e.currentTarget.dataset.index;
    var bannerId = this.data.banner[index].router;
    wx.navigateTo({
      url: "../../../../goods/list/list?selectParentId=" + bannerId
    });
	}
})