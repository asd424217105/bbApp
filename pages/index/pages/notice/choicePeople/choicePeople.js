// pages/ConstructionCompany/pages/CheckReceivePeople/CheckReceivePeople.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    id: '',  // 目标id
    mercId:'',
    usertype:'',
    list: [],
    userIds: '',
    userNames: ''
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id,
    })
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        var usertype = res.data.user_type;
        that.setData({
          usertype: usertype
        })
        if (usertype == 1) {
          if (options.taskId){
            that.setData({
              id: options.taskId
            })
          }
          that.getUserlist();
        }
        if (usertype == 2 || usertype == 3) {
          that.getProjectUserlist();
        }
        if (usertype == 4 || usertype == 5) {
          that.setData({
            mercId:res.data.merchantsId
          })
          that.getProjectUserlist2();
        }
      },
    })

  },

  // 正在进行中的班组长的工人列表 -- 班组长调用
  getUserlist: function () {
    var that = this;
    var id = this.data.id;
    // 正在进行中的班组长的工人列表
    app.post('/callPerson/listWorkIngSec',
      {
        taskId: id
      }).then((res) => {
        var reslist = res.data;
        that.setData({
          list: reslist
        })
      }).catch((error) => {

      })
  },

  // 获取项目进行中的参加工作的班组列表信息 -- 项目部调用
  getProjectUserlist: function () {
    var that = this;
    var id = this.data.id;
    // 获取项目进行中的参加工作的班组列表信息
    app.post('/taskPerson/workingList',
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

  // 获取项目人员配置列表信息 -- 建设公司调用
  getProjectUserlist2: function () {
    var that = this;
    var id = this.data.id;
    var mercId = this.data.mercId;
    // 获取项目人员配置列表信息
    app.post('/project/userListByMercId',
      {
        mercId: mercId,
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
    var name;
    for(var i in list){
      if (list[i].user) {
        for (var z in list[i].user) {
          if (list[i].user[z].userId == e.detail.value) {
            name = list[i].user[z].userName || list[i].user[z].realName
          }
        }
      } else {
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