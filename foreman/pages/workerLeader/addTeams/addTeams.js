// pages/index/pages/evaluate/evaluate.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    idx: 1,  
    targetId: '',  // 目标id
    inputValue:'',
    msg:'',
    userid1: '',
    userid2:'',
    userIds: [],
    userNames: []
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    app.getTheme(that);
    var id = options.id;
    this.setData({
      targetId: id
    })
  },

  // 文字输入框
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
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

  // 确定
  toOk:function(){
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var idx = this.data.idx;
    var userIds;
    if (idx == 1){
      userIds = this.data.userid1;
    }
    if (idx == 2) {
      userIds = this.data.userIds;
      userIds = userIds.join(',');
    }
    if (idx == 3) {
      userIds = this.data.userid2;
    }
    var targetId = this.data.targetId;
    // 班组长指派小带班
    app.post('/callPerson/personAdd',
      {
        userIds: userIds,
        taskId: targetId,
      }).then((res) => {
        // 返回上一页要刷新
        prevPage.setData({
          refresh: true
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 800)
      }).catch((error) => {

      })
  },

  // 根据手机号获取某个工人进行小带班的指派
  search:function(){
    var that = this;
    var phone = this.data.inputValue;
    // 根据手机号获取某个工人进行小带班的指派
    app.post('/callPerson/getPerson',
      {
        mobile: phone
      }).then((res) => {
        that.setData({
          msg: res.data,
          userid2: res.data.id
        })
      }).catch((error) => {

      })
  }
})