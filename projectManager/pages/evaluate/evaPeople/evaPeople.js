// pages/ConstructionCompany/pages/CheckReceivePeople/CheckReceivePeople.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    id: '',
    projectId: '',
    typeid: '',
    list: [],
    userIds: '',
    userNames: ''
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    if (options.projectId){
      this.setData({
        projectId: options.projectId
      })
    }
    this.setData({
      id: options.id,
      typeid: options.typeid
    })
    var that = this;
    app.getTheme(that);
    // 获取上级人员
    if (options.typeid == 0){
      this.getUserListByTaskId();
    }
    // 获取下级人员
    if (options.typeid == 1){
      this.getUserlist();
    }

  },

  // 获取项目进行中的参加工作的班组列表信息
  getUserlist: function () {
    var that = this;
    var projectId = this.data.projectId;
    // 获取项目进行中的参加工作的班组列表信息
    app.post('/taskPerson/workingList',
      {
        projectId: projectId
      }).then((res) => {
        var reslist = res.data;
        that.setData({
          list: reslist
        })
      }).catch((error) => {

      })
  },

  // 项目经理获取接受人信息
  getUserListByTaskId: function () {
    var that = this;
    var id = this.data.id;
    // 项目经理获取接受人信息
    app.post('/accept/mercAdmin',
      {
        projectId: id
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
    var typeid = this.data.typeid;
    var name;
    if (typeid == 1){
      for (var i in list) {
        if (list[i].userId == e.detail.value) {
          name = list[i].userName || list[i].realName
        }
      }
    }else{
      if (list.id == e.detail.value) {
        name = list.userName || list.realName
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