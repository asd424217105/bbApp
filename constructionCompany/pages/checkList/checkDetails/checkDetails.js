// pages/ConstructionCompany/pages/checkDetails/checkDetails.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js')

Page({
  // 页面的初始数据
  data: {
    targetId: '',  // 项目id
    typeid: '',    // (0-我的  1-其他人的)
    checkData: '',
    replyList: '',
    file_list1: [],
    file_list2: [],
    inputValue: '',  //反馈意见
 
    imglist: [],   //上传图片 视频所需字段（3个）
    file_code: '',  // 上传文件的此批编号
    videoBtnHidden: false,  //播放视频覆盖按钮

    userType:''
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    app.getTheme(that);
    var id = options.id;
    var typeid = options.type;
    this.setData({
      targetId: id,
      typeid: typeid
    })

    // 生成file_code编号
    uploadfun.upload.fileCode(this)

    wx.getStorage({
      key: 'userType',
      success: function(res) {
        var usertype = res.data;
        that.setData({
          usertype: usertype
        })
      },
    })

    // 获取某个报验详情信息
    app.post('/accept/get',
      {
        id: id,
      }).then((res) => {
        that.setData({
          checkData: res.data.accept,
          file_list1: res.data.file_list,
          replyList: res.data.replyList
        })
        if (res.data.replyList[0].file_list){
          that.setData({
            file_list2: res.data.replyList[0].file_list
          })
        }
      }).catch((error) => {

      })
  },

  // 文字输入框
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

  // 删除图片
  deleteImage: function (e) {
    uploadfun.upload.deleteImage(e, this)
  },

  // ---------------------------------------------------------
  // 提交数据
  Reply: function (e) {
    var num = e.currentTarget.dataset.id; 
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var inputValue = this.data.inputValue;
    var file_code = this.data.file_code;
    var targetId = this.data.targetId;
    if (inputValue == '') {
      wx.showToast({
        title: '请填写反馈意见',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    // 验收申请添加批复/回复
    app.post('/accept/addReply',
      {
        id: targetId,
        acceptStatus: num,   // 验收状态(0 - 待审1 - 同意2 - 不同意)
        content: inputValue,
        fileCode: file_code
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