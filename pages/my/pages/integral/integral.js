// pages/my/pages/integral/integral.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integral: 0,
    integralArray: [],
    integralType: '',
    integralTime: '',
    midifyIntegral: 0
  },

  getIntegral: function () {
    var that = this
    app.post('/userWorkIntegral/list', {}).then((res) => {
      console.log(res)
      app.post('/home/userInfo', {}).then((res1) => {
        console.log(res1)
        console.log('修改成功更新globalData和本地储存的userinfo');
        wx.setStorageSync('userInfo', res1.data);
        app.globalData.userInfo = res1.data;
        that.setData({
          integral: res1.data.integral,
          integralArray: res.data
        })
      }).catch((error) => {
        console.log('更新globalData和本地储存的userinfo失败');
      })
      
    }).catch((error) => {

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getTheme(that)
    that.getIntegral();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    var that = this;
    that.getIntegral();
    wx.stopPullDownRefresh();
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