// pages/foreman/pages/myWorkers/myWorkers.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    targetId: '',  // 目标id
    upId: '',  // 目标上级id
    list: [],
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    app.getTheme(this);
    var id = options.id;
    var upId = options.upId;
    this.setData({
      targetId: id,
      upId: upId,
      curpage: 1,
      list: []
    })
    this.callPersonList();
  },

  // 获取某任务号召下的工人列表
  callPersonList: function () {
    var that = this;
    var targetId = this.data.targetId;
    // 获取某任务号召下的工人列表
    app.post('/callPerson/listWorkIng',
      {
        callId: targetId,
      }).then((res) => {
        that.setData({
          list: res.data
        })
      }).catch((error) => {

      })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      list: []
    })
    this.callPersonList();
    wx.stopPullDownRefresh();
  },

  // 跳转到对应工人详情页面
  toDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'workersDetail/workersDetail?id=' + id + '',
    })
  },

  // 查看合同
  contract: function (e) {
    var targetId = this.data.targetId;
    var upId = this.data.upId;
    var userId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../workPointsList?id=' + targetId + '&userId=' + userId + '&upId=' + upId + '',
    })
  }

})