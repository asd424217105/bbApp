// pages/index/pages/thingApplyList/addThingApply/addThingApply.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '', //项目id
    targetType: '1', // 目标类型(0- 项目1 - 任务)
    inputValue0: '',  // 申请名称
    inputValue: '',  // 申请内容
    userIds: [],  // 接受者id集合
    userNames: [],  // 接受者name集合

    imglist: [],   //上传图片 视频所需字段（3个）
    file_code: '',  // 上传文件的此批编号
    videoBtnHidden: false  //播放视频覆盖按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    console.log(id)
    var that = this;
    app.getTheme(that);
    wx.getStorage({
      key: 'userType',
      success: function (res) {
        if (res.data == 1) {
          that.setData({
            targetType: '1',
          })
        }
        if (res.data == 2 || res.data == 3) {
          that.setData({
            targetType: '0',
          })
        }
      },
    })
    this.setData({
      id: id
    })
    // 生成file_code编号
    uploadfun.upload.fileCode(this)
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

  // 删除图片
  deleteImage: function (e) {
    uploadfun.upload.deleteImage(e, this)
  },

  // ---------------------------------------------------------


  // 添加接收人
  addPeople: function () {
    var id = this.data.id;
    wx.navigateTo({
      url: '/projectManager/pages/CheckReceivePeople/CheckReceivePeople?id=' + id + '',
    })
  },

  // 提交数据
  Submit: function (e) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var targetId = this.data.id;
    console.log(targetId)
    var targetType = this.data.targetType;
    var content = this.data.inputValue;
    var userIds = this.data.userIds;
    userIds = userIds.join(',');
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
    // 新增计划申请
    app.post('/thingApply/add',
      {
        id: targetId,
        type: targetType,
        content: content,
        userIds: userIds,
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