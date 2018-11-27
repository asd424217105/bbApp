// pages/index/pages/teamList/Daily/Daily.js
var app = getApp();
var uploadfun = require('../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: '',
    userId: '',
    usertype: '',
    file_list: [],

    refresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    app.getTheme(that);
    var taskId = options.id;
    // 根据身份判断 目标类型
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res)
        that.setData({
          usertype: res.data.user_type,
          userId: res.data.id,
          taskId: taskId,
          list: []
        })
        that.lookMsg();
      },
    })

  },

  // 查看信息
  lookMsg: function () {
    var that = this;
    var userId = this.data.userId;
    var taskId = this.data.taskId;
    // 根据用户id,目标id获取合同
    // （1.工人，代班，班组长调用接口时targetType：1（任务号召），targetId：callId；2.项目经理，建设公司调用接口时targetType：0（项目任务），targetId：taskId；）
    app.post('/contract/get',
      {
        userId: userId,
        targetId: taskId,
        targetType: 0,
      }).then((res) => {
        that.setData({
          file_list: res.data.file_list
        })
      }).catch((error) => { })
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
      curpage: 1,
      list: []
    })
    this.lookMsg();
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
  }

})