// pages/index/pages/workPointsList/addWorkPoints/addWorkPoints.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    targetId: '', //目标id
    userId: ''  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var id = options.id;
    var userId = options.userId;
    var that = this;
    app.getTheme(that);
    this.setData({
      targetId: id,
      userId: userId
    })
  },


  // 提交数据
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var formData = e.detail.value;
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    // 添加某人计工
    app.post('/userValuation/add',formData
      ).then((res) => {
        // 返回上一页要刷新
        prevPage.setData({
          refresh: true
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 800)
      }).catch((error) => { })
  }

})