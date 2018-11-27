var app = getApp()
// var template = require('../template/template.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: 'red',
    userType: 0,
    name: '',
    phone: '',
    integral: 0,
    head_img: 'resources/pic/head_img_default.png',
    certification_status: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  goRZ: function () {
    wx.navigateTo({
      url: 'pages/realNameAuthentication/realNameAuthentication',
    })
  },

  goCPRZ: function () {
    wx.navigateTo({
      url: 'pages/companAuthentication/companAuthentication',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.getTheme(that)
    wx.getStorage({
      key: 'userType',
      success: function(res) {
        let img = "";
        if (app.globalData.userInfo.head_img) {
          img = app.globalData.userInfo.head_img
        } else {
          img = that.data.head_img
        }
        that.setData({
          userType: res.data,
          head_img: img,
          certification_status: app.globalData.userInfo.certification_status,
          name: app.globalData.userInfo.real_name,
          phone: app.globalData.userInfo.mobile,
          integral: app.globalData.userInfo.integral
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})