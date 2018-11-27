// pages/index/pages/news/news.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news_content: '',
    news_title: '',
    ctime: '2018-08-17 09:16:53',
    newsFrom: '班班原创',
    news_exturl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.post('/sysnews/getNews', {id: options.id}).then((res) => {
      console.log(res)
      that.setData({
        news_content: res.data.news_content,
        news_title: res.data.news_title,
        newsForm: res.data.news_src,
        news_exturl: res.data.news_exturl
      })
    }).catch((error) => {

    })
    app.getTheme(that)
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
  
  }
})