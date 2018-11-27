// pages/index/pages/workerDailyList/workerDailyDetails/workerDailyDetails.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js')

Page({
  // 页面的初始数据
  data: {
    targetId: '',  // 目标id
    checkData: '',
    replyList: '',
    file_list1: [],

    videoBtnHidden: false,  //播放视频覆盖按钮

    userType: ''
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    app.getTheme(that);
    var id = options.id;
    this.setData({
      targetId: id
    })

    wx.getStorage({
      key: 'userType',
      success: function (res) {
        var usertype = res.data;
        that.setData({
          usertype: usertype
        })
      },
    })

    // 获取工人日报详情信息
    app.post('/userDayreport/get',
      {
        id: id,
      }).then((res) => {
        that.setData({
          checkData: res.data,
          file_list1: res.data.file_list,
        })
      }).catch((error) => {

      })
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
  }
})