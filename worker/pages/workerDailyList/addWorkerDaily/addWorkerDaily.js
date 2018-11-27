// pages/index/pages/workerDailyList/addWorkerDaily/addWorkerDaily.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    targetId: '', //目标id
    inputValue0: '',  // 项目名称
    inputValue: '', // 日报描述

    imglist: [],   //上传图片 视频所需字段（3个）
    file_code: '',  // 上传文件的此批编号
    videoBtnHidden: false  //播放视频覆盖按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var that = this;
    app.getTheme(that);
    this.setData({
      targetId: id
    })
    // 生成file_code编号
    uploadfun.upload.fileCode(this)
  },

  // 项目名称
  bindKeyInput0: function (e) {
    this.setData({
      inputValue0: e.detail.value
    })
  },

  // 日报描述
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 上传图片 视频方法-------------------------------------------

  // 用来显示一个选择图片和拍照的弹窗
  chooseImageTap: function () {
    uploadfun.upload.chooseImageTap(this)
  },

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

  // 删除图片
  deleteImage: function (e) {
    uploadfun.upload.deleteImage(e, this)
  },

  // ---------------------------------------------------------

  // 提交数据
  Submit: function (e) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    var callId = this.data.targetId;
    var content = this.data.inputValue;

    var imglist = this.data.imglist;
    var file_code = this.data.file_code;

    if (content == '' && imglist.length == 0) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    // 添加日报
    app.post('/userDayreport/add',
      {
        callId: callId,
        content: content,
        file_code: file_code
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
      }).catch((error) => { })
  }

})