// pages/my/pages/creatFeedback/creatFeedback.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imglist: [],   //上传图片 视频所需字段（3个）
    file_code: '',  // 上传文件的此批编号
    videoBtnHidden: false,  //播放视频覆盖按钮
    content: '',
    theme: 'red',
    id: 0,
    ptext: ''
  },

  //获取填写的内容
  feedbackInput: function (e) {
    this.setData({
      content: e.detail.value
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

  //提交意见
  submitFeed: function () {
    var that = this;
    app.post('/corpUsersFeedback/add',{
      file_code: this.data.file_code,
      content: this.data.content
    }).then((res) => {
      wx.showToast({
        title: '添加成功'
      })
      wx.navigateBack({
        delta: 1
      })
    }).catch((error) => {
      wx.showToast({
        title: '添加失败',
        icon: 'none'
      })
    })
  },

  //取消添加
  resetFeed: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getTheme(that);
    this.setData({
      ptext: '请留下您的意见或建议,平台将尽快在此版块尽快回复!谢谢!'
    })
    // 生成file_code编号
    uploadfun.upload.fileCode(this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})