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
    app.getTheme(that);
    this.getUserlist();
  },

  // 根据主键callId获取任务号召发布人信息
  getUserlist: function () {
    var that = this;
    var id = this.data.id;
    // 根据主键callId获取任务号召发布人信息
    app.post('/taskcall/nameByCallId',
      {
        callId: id
      }).then((res) => {
        var reslist = res.data.user;
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
    if (list.userId == e.detail.value) {
      name = list.realName
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