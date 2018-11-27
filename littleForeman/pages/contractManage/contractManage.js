// pages/foreman/pages/contractManage/contractManage.js
var app = getApp();
var uploadfun = require('../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: '',
    file_list: [],
    targetType: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getTheme(that);
    var id = options.id;
    // 获取某个项目任务
    app.post('/taskcall/get',
      {
        id: id
      }).then((res) => {
        console.log(res)
        that.setData({
          data: res.data.taskCall,
          file_list: res.data.file_list
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