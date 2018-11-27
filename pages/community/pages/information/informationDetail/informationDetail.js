// pages/community/pages/information/informationDetail/informationDetail.js
var app = getApp();
var uploadfun = require('../../../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    videoBtnHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id: id,
    })
    this.getNews();
  },

  // 获取资讯详情
  getNews: function () {
    var that = this;
    var id = this.data.id;
    // 获取资讯详情
    app.post('/sysnews/getNews',
      {
        id: id
      }).then((res) => {
        that.setData({
          list: res.data
        })
      }).catch((error) => { })
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


})