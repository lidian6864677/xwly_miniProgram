const AV = require('../../utils/av-weapp-min.js')
Page({
	data: {
		banner: [],
		goods: [],
    pageIndex: 0,
		bannerHeight: Math.ceil(290.0 / 750.0 * getApp().screenWidth)
	},
	onLoad: function (options) {
		this.loadBanner();
		this.loadMainGoods();
		// this.getInviteCode(options);
	},
  onPullDownRefresh: function () {
    this.data.pageSize = 0;
    this.loadBanner();
    this.loadMainGoods();
  },
 
  onReachBottom: function () {
    this.data.pageIndex++
    this.loadMainGoods();

  },
	// getInviteCode: function (options) {
	// 	if (options.uid != undefined) {
	// 		wx.showToast({
	// 			title: '来自用户:' + options.uid + '的分享',
	// 			icon: 'success',
	// 			duration: 2000
	// 		})
	// 	}
	// },
	loadBanner: function () {
		var that = this;
		var query = new AV.Query('Banner');
		query.find().then(function (bannerObjects) {
			var banner = [];
			for (var i = 0; i < bannerObjects.length; i++) {  
        banner.push({ "url": bannerObjects[i].get('image').get('url'), "router": bannerObjects[i].get('router')})
			}
			that.setData({
				banner: banner
			});
		});
	},
	loadMainGoods: function () {
    var pageSize = 5;  
		var that = this;
		var query = new AV.Query('Goods');
		query.equalTo('isHot', true);
    query.equalTo('isNew', true);
    query.limit(pageSize);// 最多返回 10 条结果
    query.skip(this.data.pageIndex * pageSize);// 
    query.find().then(function (goods) {
      wx.stopPullDownRefresh()
      var originGoods = that.data.goods;
      // 如果初始有值，就合并；否则就是新数据集本身
      var newGoods = (originGoods.length > 0 && that.data.pageIndex > 0) ? originGoods.concat(goods) : goods;
      if (goods.length == 0) {
        wx.showToast({
          title: '没有更多数据了',
          icon: 'none',
          duration: 1000
        })
      }
      console.log(newGoods);
			that.setData({
        goods: newGoods
			});
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
      path: "pages/login/login"
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