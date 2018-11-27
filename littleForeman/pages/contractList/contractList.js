// pages/index/pages/contractList/contractList.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    targetId: '',  // 目标id
    userId: '',  // 人员id
    targetType: 1, // 目标类型(0- 任务1 - 号召)
    usertype: '', // 用户身份
    file_list: [],
    refresh: false
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    var that = this;
    app.getTheme(that);
    var id = options.id;
    var userId = options.userId;
    // 根据身份判断 目标类型
    wx.getStorage({
      key: 'userType',
      success: function (res) {
        var usertype = res.data;
        that.setData({
          usertype: usertype
        })
      },
    })
    this.setData({
      targetId: id,
      userId: userId,
      file_list: []
    })
    this.getContract();
  },

  // 根据用户id,目标id获取合同
  getContract: function () {
    var that = this;
    var targetId = this.data.targetId;
    var userId = this.data.userId;
    var targetType = this.data.targetType;
    // 根据用户id,目标id获取合同
    app.post('/contract/get',
      {
        targetId: targetId,
        userId: userId,
        targetType: targetType
      }).then((res) => {
        that.setData({
          file_list: res.data.file_list
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
      file_list: []
    })
    this.getContract();
    wx.stopPullDownRefresh();
  },

  // 预览图片
  previewImage: function (e) {
    var imglist = e.target.dataset.list;
    var current = e.target.dataset.src;
    var arr = [];
    for (var i in imglist) {
      if (imglist[i].fileType == 3) {
        arr.push(imglist[i].newFilename)
      }
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接数组
    })
  },

  // 新加合同
  addThing: function () {
    var targetId = this.data.targetId;
    var userId = this.data.userId;
    wx.navigateTo({
      url: 'addContract/addContract?targetId=' + targetId + '&userId=' + userId +'',
    })
  }
})
