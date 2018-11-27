// pages/community/community.js
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
    app.getUserType(this,function(e){
      // 设置顶部颜色
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: e == 0 ? '#FCBB01' : e == 1 || e == 2 || e == 3 ? '#FE3F44' : e == 4 ? '#179BD9' : '',
      })
    })
  },

})