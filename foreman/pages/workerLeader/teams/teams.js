// pages/index/pages/workerDailyList/workerDailyList.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    targetId: '',  // 目标id
    mobile: '',  
    list: [],

    refresh: false,
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    this.setData({
      targetId: id,
      list: []
    })
    this.getAcceptList();
  },

  // 班组长根据项目任务进行小班组设置（带班列表）
  getAcceptList: function () {
    var that = this;
    app.getTheme(that);
    var targetId = this.data.targetId;
    var mobile = this.data.mobile;
    // 班组长根据项目任务进行小班组设置（带班列表）
    app.post('/callPerson/subTeamList',
      {
        taskId: targetId,
        mobile: mobile
      }).then((res) => {
        that.setData({
          list: res.data
        })
      }).catch((error) => {

      })
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
    this.getAcceptList();
    wx.stopPullDownRefresh();
  },

  // 新建带班
  addTeams: function () {
    var targetId = this.data.targetId;
    wx.navigateTo({
      url: '../addTeams/addTeams?id=' + targetId + '',
    })
  },

  // 底下工人
  toLook:function(e){
    var id = this.data.targetId;
    var workerid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../workerList/workerList?id=' + id + '&workerid=' + workerid + '',
    })
  },

  // 禁用
  edit: function (e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var id = item.id;
    var userStatus = item.userStatus;
    if (userStatus == 0){
      userStatus = 1
    }else{
      userStatus = 0
    }
    // 班组长对小带班的禁用/启用操作
    app.post('/callPerson/personIson',
      {
        id: id,
        userStatus: userStatus
      }).then((res) => {
        that.onPullDownRefresh();
      }).catch((error) => {

      })
  },

  // 删除
  del: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    // 班组长对小带班相关操作（剔除指派）
    app.post('/callPerson/personDel',
      {
        id: id
      }).then((res) => {
        that.onPullDownRefresh();
      }).catch((error) => {

      })
  }

})