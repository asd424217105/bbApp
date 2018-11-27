// pages/index/pages/evaluate/evaluate.js
var app = getApp();
var uploadfun = require('../../../utils/upload.js');

Page({
  // 页面的初始数据
  data: {
    idx: 1,  // 评价类型(1-被评价2-评价)
    targetId: '',  // 目标id
    targetType: 1,  // 目标类型(0-项目1-任务2-号召)
    userid:'',
    typeid: '', 
    usertype: '',
    list: [],
    refresh: false
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    app.getTheme(that);
    var id = options.id;
    var typeid = options.type;
    // 根据身份判断 目标类型是 (0-项目 或 1-任务)
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        var usertype = res.data.user_type;
        var userid = res.data.id;
        if (typeid == 0){
          that.setData({
            targetId: id,
            targetType: 1,
            usertype: usertype,
            userid: userid,
            typeid: typeid,
            list: []
          })
        }
        if (typeid == 1){
          that.setData({
            targetId: id,
            targetType: 2,
            usertype: usertype,
            userid: userid,
            typeid: typeid,
            list: []
          })
        }
        that.getUserEvalList();
      },
    })
    
  },

  // 查询某人被评价/评价的日志
  getUserEvalList: function () {
    var that = this;
    var targetId = this.data.targetId;
    var targetType = this.data.targetType;
    var userid = this.data.userid;
    var evalType = this.data.idx;
    // 查询某人被评价/评价的日志
    app.post('/userEval/list',
      {
        userid: userid,
        targetId: targetId,
        targetType: targetType,
        evalType: evalType,
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
      curpage: 1,
      list: []
    })
    this.getUserEvalList();
    wx.stopPullDownRefresh();
  },

  // toptab切换
  switchTab: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      idx: id
    })
    this.onPullDownRefresh()
  },

  // 上传图片 视频方法-------------------------------------------

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
    uploadfun.upload.previewImage(e, this)
  },

  // 预览图片1
  previewImage1: function (e) {
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

  // ---------------------------------------------------------

  // 新建评价
  addThing: function () {
    var targetId = this.data.targetId;
    var typeid = this.data.typeid;
    wx.navigateTo({
      url: 'addEvaluate/addEvaluate?id=' + targetId + '&typeid=' + typeid + '',
    })
  }
})