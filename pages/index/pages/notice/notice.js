// pages/index/pages/notice/notice.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js');

Page({
  // 页面的初始数据
  data: {
    idx: 0,  // 消息类型(0-项目公告1-工作通知2-系统通知3-我发布的通知)
    projectId: '',  // 项目id
    taskId: '',  // 任务id
    usertype: '',  // 身份
    list: [],
    refresh: false
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    var id = options.id;
    if (options.projectId){ 
      this.setData({
        taskId: id,
        projectId: options.projectId
      })
    }else{
      this.setData({
        projectId: id,
      })
    }
    var that = this;
    wx.getStorage({
      key: 'userType',
      success: function(res) {
        var usertype = res.data;
        that.setData({
          usertype: usertype,
          list: []
        })
        that.getMessageList();
      },
    })
   
  },

  // 获取通知消息
  getMessageList: function () {
    var that = this;
    var idx = this.data.idx;
    var projectId = this.data.projectId;
    if (idx != 0){
      projectId = 0;
    }
    // 获取通知消息
    app.post('/sysMessage/list',
      {
        messageType: idx,
        projectId: projectId
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
    this.getMessageList();
    wx.stopPullDownRefresh();
  },

  // toptab切换
  switchTab: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      idx: id,
      list: []
    })
    this.getMessageList()
  },

  // 视频 图片 预览播放--------------------------

  // 点击预览图片时播放视频
  bindplayimg: function (e) {
    var idname = e.currentTarget.dataset.idname;
    uploadfun.upload.bindplay(idname, this);
  },

  // 退出全屏时
  bindfullscreenchange: function (e) {
    uploadfun.upload.bindfullscreenchange(e, this)
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

  //-----------------------------------------------

  // 发布通知
  addProject:function(){
    var projectId = this.data.projectId;
    var taskId = this.data.taskId;
    wx.navigateTo({
      url: 'addNotice/addNotice?id=' + projectId + '&taskId=' + taskId + '',
    })
  }

})