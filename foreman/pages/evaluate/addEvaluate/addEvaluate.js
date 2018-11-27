// pages/index/pages/notice/addNotice/addNotice.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    targetId: '',   // 目标id
    targetType: '',   // 目标类型0-2
    usertype: '',
    messageTypeArray: [
      { id: '1', text: '差' },
      { id: '2', text: '良' },
      { id: '3', text: '优' },
    ],  // 分数
    integral: '',
    userIds: '',
    userNames: '',
    typeid: '',

    imglist: [],   //上传图片 视频所需字段（3个）
    file_code: '',  // 上传文件的此批编号
    videoBtnHidden: false  //播放视频覆盖按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    app.getTheme(that);
    // 生成file_code编号
    uploadfun.upload.fileCode(this)

    // 获取身份
    app.getUserType(this, function () { });
    var targetType;
    if (options.typeid == 0){
      targetType = 1
    }
    if (options.typeid == 1) {
      targetType = 2
    }

    this.setData({
      targetId: options.id,
      typeid: options.typeid,
      targetType: targetType,
    })

  },

  // 单选下拉框
  bindPickerChange: function (e) {
    var messageTypeArray = this.data.messageTypeArray;
    this.setData({
      integral: messageTypeArray[e.detail.value]
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

  // 添加接收人
  addPeople: function () {
    var targetId = this.data.targetId;
    var typeid = this.data.typeid;
    wx.navigateTo({
      url: '../evaPeople/evaPeople?id=' + targetId + '&typeid=' + typeid + '',
    })
  },

  // 提交数据
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var formData = e.detail.value;
    // 发布通知
    app.post('/userEval/add', formData
    ).then((res) => {
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