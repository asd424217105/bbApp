// pages/my/pages/myTeam/codeAddWork/codeAddWork.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getTheme(that)
    that.setData({
      Rcode: app.globalData.userInfo.qrcodeUrl
    })
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        // 分享成功
        console.log('shareMenu share success')
        console.log('分享' + res)
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    })
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
    var that = this;
    let name = app.globalData.userInfo.real_name;
    // let id = app.globalData.userInfo.id;
    let recomm_code = app.globalData.userInfo.recomm_code;
    // let user_type = app.globalData.userInfo.user_type;
    console.log(app.globalData.userInfo)
    return {
      title: name + '  邀请您加入ta的队伍',
      path: 'pages/my/pages/jumpPage/jumpPage?code=' + recomm_code,
      imageUrl: '../../resources/pic/logo.png',
      success: function (res) {
        console.log(res)
        // console.log(res.shareTickets[0])
        console.log('分享成功！')
        // wx.getShareInfo({
        //   shareTicket: res.shareTickets[0],
        //   success: function (res) { console.log(res) },
        //   fail: function (res) { console.log(res) },
        //   complete: function (res) { console.log(res) }
        // })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  }
})