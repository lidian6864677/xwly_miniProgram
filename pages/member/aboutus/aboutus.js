Page({
	onLoad: function (options) {
	},

  callPhone01: function(){
    wx.makePhoneCall({
      phoneNumber: '0452-6864677',
    })
  },

  callPhone02: function () {
    wx.makePhoneCall({
      phoneNumber: '13614523902',
    })
  },
});