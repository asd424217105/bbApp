// pages/index/pages/workerDailyList/workerDailyList.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    targetId:'', // 目标id
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    app.getTheme(this);
    this.setData({
      targetId: options.id
    })
  }
})