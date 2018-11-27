// pages/index/pages/notice/addNotice/addNotice.js
var app = getApp();
var uploadfun = require('../../../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectId: '',   // 项目id(非项目公告填0)
    taskId: '',   // 任务id  获取工人列表用
    usertype: '',
    messageTypeArray: [
      { 'id': 0, 'text': '项目公告' },
      { 'id': 1, 'text': '工作通知' }
    ],  // 项目活动类型
    messageType: '',
    userIds: '',
    userNames: '',

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
    // 生成file_code编号
    uploadfun.upload.fileCode(this)

    // 获取身份
    app.getUserType(this,function(){});

    this.setData({
      projectId: options.id,
      taskId: options.taskId
    })

  },

  // 单选下拉框
  bindPickerChange: function (e) {
    var messageTypeArray = this.data.messageTypeArray;
    this.setData({
      messageType: messageTypeArray[e.detail.value]
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
    var projectId = this.data.projectId;
    var taskId = this.data.taskId;
    wx.navigateTo({
      url: '../choicePeople/choicePeople?id=' + projectId + '&taskId=' + taskId + '',
    })
  },

  // 提交数据
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var formData = e.detail.value;
    var messageType = this.data.messageType;
    // 项目id(非项目公告填0)
    if (formData.messageType != 0) {
      formData.projectId = 0
    }
    // 接收人id(非工作通知填写0)
    if (formData.messageType != 1) {
      formData.userid = 0
    }
    // 发布通知
    app.post('/sysMessage/add', formData
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