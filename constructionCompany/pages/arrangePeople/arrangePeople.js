// pages/ConstructionCompany/pages/arrangePeople/arrangePeople.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    projectId: '',
    merchantsId: '',
    list: [],
    refresh: false,
    locking: false
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    app.getTheme(that);
    var projectId = options.id;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        var merchantsId = res.data.merchantsId;
        that.setData({
          projectId: projectId,
          merchantsId: merchantsId,
          list: []
        })
        that.getProjectUserList();
      },
    })
    

  },

  // 获取项目人员配置列表信息
  getProjectUserList: function () {
    var that = this;
    var mercId = this.data.merchantsId;
    var projectId = this.data.projectId;
    // 获取项目人员配置列表信息
    app.post('/project/userListByMercId',
      {
        mercId: mercId,
        projectId: projectId
      }).then((res) => {
        that.setData({
          list: res.data
        })
      }).catch((error) => {})
  },

  // 页面显示时
  onShow: function () {
    if (this.data.refresh) {
      this.onPullDownRefresh();
      this.setData({
        refresh: false
      })
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      list: []
    })
    this.getProjectUserList();
    wx.stopPullDownRefresh();
  },

  // 指派人员
  applicationList: function (e) {
    var stationId = e.currentTarget.dataset.id;
    var projectId = this.data.projectId;
    var merchantsId = this.data.merchantsId;
    wx.navigateTo({
      url: 'peopleList/peopleList?id=' + projectId + '&stationId=' + stationId + '',
    })
  },
})