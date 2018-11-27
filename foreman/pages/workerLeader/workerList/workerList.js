// pages/index/pages/evaluate/evaluate.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    idx: 1,
    targetId: '',  // 目标id
    workerid: '',  // 带班id
    list:[],
    userIds: '',
    userNames: ''
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    app.getTheme(that);
    var id = options.id;
    var workerid = options.workerid;
    this.setData({
      targetId: id,
      workerid: workerid
    })
    this.getUserEvalList();
  },

  // 获取带班负责的人员列表
  getUserEvalList: function () {
    var that = this;
    var workerid = this.data.workerid;
    // 获取带班负责的人员列表
    app.post('/callPerson/workerListByUserId',
      {
        userId: workerid,
      }).then((res) => {
        that.setData({
          list: res.data
        })
      }).catch((error) => {

      })
  },

  // toptab切换
  switchTab: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      idx: id
    })
  },

  // 添加人员
  addThing: function () {
    var targetId = this.data.targetId;
    wx.navigateTo({
      url: '../choicePeople/choicePeople?id=' + targetId + '',
    })
  },

  // 剔除班组下的工人
  tichu:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    // 剔除班组下的工人
    app.post('/callPerson/delWorker',
      {
        id: id
      }).then((res) => {
        // 重新获取
        that.getUserEvalList();
      }).catch((error) => {

      })
  },

  // 确定
  toOk: function () {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var userIds = this.data.userIds;
        userIds = userIds.join(',');
    var workerid = this.data.workerid;
    // 给带班指派工人
    app.post('/callPerson/toWorker',
      {
        userIds: userIds,
        createId: workerid,
      }).then((res) => {
        // 重新获取
        that.getUserEvalList();
        that.setData({
          userIds: '',
          userNames: ''
        })
      }).catch((error) => {

      })
  }
})