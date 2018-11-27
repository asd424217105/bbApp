// pages/ConstructionCompany/pages/CheckReceivePeople/CheckReceivePeople.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    id: '',
    typeid: '',
    list: [],
    userIds: '',
    userNames: ''
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id,
      typeid: options.typeid
    })
    var that = this;
    // 获取上级人员
    if (options.typeid == 0){
      this.getUserListByTaskId();
    }
    // 获取下级人员
    if (options.typeid == 1){
      this.getUserlist();
    }

  },

  // 正在进行中的班组长的工人列表
  getUserlist: function () {
    var that = this;
    app.getTheme(that);
    var id = this.data.id;
    // 正在进行中的班组长的工人列表
    app.post('/callPerson/listWorkIng',
      {
        callId: id
      }).then((res) => {
        var reslist = res.data;
        that.setData({
          list: reslist
        })
      }).catch((error) => {

      })
  },

  // 获取接收人信息列表 全为项目管理人员）
  getUserListByTaskId: function () {
    var that = this;
    var id = this.data.id;
    // 获取接收人信息列表（全为项目管理人员）
    app.post('/project/userListByTaskId',
      {
        id: id
      }).then((res) => {
        var reslist = res.data;
        that.setData({
          list: reslist
        })
      }).catch((error) => {

      })
  },

  // 单选框
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var list = this.data.list;
    var name;
    for (var i in list) {
      if (list[i].user){
        for (var z in list[i].user) {
          if (list[i].user[z].userId == e.detail.value) {
            name = list[i].user[z].userName || list[i].user[z].realName
          }
        }
      }else{
        if (list[i].userId == e.detail.value) {
          name = list[i].userName || list[i].realName
        }
      }
    }
    this.setData({
      userIds: e.detail.value,
      userNames: name
    })
    console.log('选择的id：', this.data.userIds)
    console.log('选择的name：', this.data.userNames)
  },

  // 确定
  toOk: function () {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var userIds = this.data.userIds;
    var userNames = this.data.userNames;

    // 返回上一页要刷新
    prevPage.setData({
      userIds: userIds,
      userNames: userNames,
    })
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
    }, 800)
  }

})