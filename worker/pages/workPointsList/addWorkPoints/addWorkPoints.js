// pages/index/pages/workPointsList/addWorkPoints/addWorkPoints.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    targetId: '', //目标id
    targetType: '2', // 目标类型(0- 项目1 - 任务 2-号召)
    date1: '',
    date2: '',
    leaveTime: '',   // 请假共计时长
    inputValue: '',  // 请假内容
    leaveTypeArray: [],  // 请假类型
    leaveType: '',

    imglist: [],   //上传图片 视频所需字段（3个）
    file_code: '',  // 上传文件的此批编号
    videoBtnHidden: false  //播放视频覆盖按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var id = options.id;
    var that = this;
    app.getTheme(that);
    this.setData({
      targetId: id
    })

    // -------调用app.js的获取字典方法-----
    // 活动类型  项目分类  是否重点
    app.getSysCode(
      ['LEAVE_TYPE'],
      ['leaveTypeArray'], this);

    // 生成file_code编号
    uploadfun.upload.fileCode(this)
  },

  // 文字输入框
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 时长
  leaveTime: function (e) {
    this.setData({
      leaveTime: e.detail.value
    })
  },

  // 单选下拉框
  bindPickerChange: function (e) {
    var types = e.currentTarget.dataset.type;
    app.selectionBox(e, types, this)
  },

  // 日期选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (e.currentTarget.dataset.type == 'date1') {
      this.setData({
        date1: e.detail.value
      })
    }
    if (e.currentTarget.dataset.type == 'date2') {
      this.setData({
        date2: e.detail.value
      })
    }
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
    var targetId = this.data.targetId;
    var targetType = this.data.targetType;
    var leaveContent = this.data.inputValue;
    var beginDate = this.data.date1;
    var endDate = this.data.date2;
    var leaveTime = this.data.leaveTime;
    var leaveType = this.data.leaveType.code;
    var file_code = this.data.file_code;
    // 某人发请假申请
    app.post('/userLeave/add',
      {
        targetId: targetId,
        beginDate: beginDate,
        endDate: endDate,
        targetType: targetType,
        leaveContent: leaveContent,
        leaveTime: leaveTime,
        leaveType: leaveType,
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