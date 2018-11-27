// pages/index/pages/leaveList/leaveDetails/leaveDetails.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js')

Page({
  // 页面的初始数据
  data: {
    targetId: '',  // 项目id
    checkData: '',
    replyList: '',
    targetType: 2,  // 目标类型(0-项目1-任务 2-号召)
    file_list1: [],
    file_list2: [],
    acceptStatus: '',  //验收状态（0：待审  1：同意  2：不同意）
    inputValue: '',  //反馈意见

    imglist: [],   //上传图片 视频所需字段（3个）
    file_code: '',  // 上传文件的此批编号
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

    // 生成file_code编号
    uploadfun.upload.fileCode(this)

    wx.getStorage({
      key: 'userType',
      success: function (res) {
        var usertype = res.data;
        that.setData({
          usertype: usertype
        })

        // 获取某人的请假详情
        app.post('/userLeave/get',
          {
            id: id,
          }).then((res) => {
            that.setData({
              checkData: res.data,
              file_list1: res.data.file_list,
              replyList: res.data.reply_list,
            })
            if (res.data.reply_list[0].file_list) {
              that.setData({
                file_list2: res.data.reply_list[0].file_list
              })
            }
          }).catch((error) => {

          })
      },
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
  agree: function (e) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var inputValue = this.data.inputValue;
    var file_code = this.data.file_code;
    var targetId = this.data.targetId;
    var leaveStatus = e.currentTarget.dataset.id;
    if (inputValue == '') {
      wx.showToast({
        title: '请填写反馈意见',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    // 请假审批
    app.post('/userLeave/checkApply',
      {
        id: targetId,
        leaveStatus: leaveStatus,
        replyContent: inputValue,
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