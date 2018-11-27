// pages/find/groupDetails/groupDetails.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    file_list: [],
    showModal: false,
    inputval:'',
    projectList: [],  // 项目活动类型
    projectValue: '', 
    userIds: '', 
    targetType: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getTheme(that)
    var id = options.id;
    // 获取班组详情
    app.post('/taskPerson/getteam',
      {
        userId: id
      }).then((res) => {
        console.log(res)
        that.setData({
          data: res.data
        })
      }).catch((error) => {})

    // 获取项目经理负责的项目任务列表信息(筹备中和进行中)
    app.post('/projecttask/listSec',
      {}).then((res) => {
        that.setData({
          projectList: res.data
        })
      }).catch((error) => { })
  },

  // 招工任务选择框
  bindPickerChange: function (e) {
    var value = e.detail.value;
    var projectList = this.data.projectList;
    this.setData({
      projectValue: projectList[value]
    })
    console.log(this.data.projectValue)
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

  // 拨打电话
  toTel: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.data.mobile
    })
  },

  

  // 邀约
  toJion: function (e) {
    var userIds = e.currentTarget.dataset.id;
    this.setData({
      showModal: true,
      projectValue: '',
      userIds: userIds
    })

  },

  // --------------模态弹窗-----------
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },

  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });

  },

  /**
  * 输入营业执照号
  */
  InputVal: function (e) {
    this.setData({
      inputval: e.detail.value
    })
  },

  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },

  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var targetType = this.data.targetType;
    var targetId = this.data.projectValue.id;
    var userIds = this.data.userIds;
    if (this.data.projectValue == ''){
      wx.showToast({
        title: '请选择招工任务',
        icon:'none',
        duration:2000
      })
      return false;
    }
    // 项目部邀约班组长
    app.post('/apply/leaderadd',
      {
        targetType: targetType,
        targetId: targetId,  //项目任务id
        userIds: userIds,
      }).then((res) => {
        console.log(res)
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