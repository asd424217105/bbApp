// pages/index/pages/workPointsList/workPointsDetails/workPointsDetails.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js')

Page({
  // 页面的初始数据
  data: {
    targetId: '',  // 某计工id
    list: '',
    inputValue: '',  //申诉意见
    showModal: false,
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

    // 获取某个计工的详情
    app.post('/userValuation/get',
      {
        id: id,
      }).then((res) => {
        that.setData({
          list: res.data
        })
      }).catch((error) => {

      })
  },

  // 文字输入框
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 申诉
  del: function (e) {
    this.setData({
      showModal: true
    })
  },

  // 确认
  edit: function (e) {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var id = e.currentTarget.dataset.id;
    var status = e.currentTarget.dataset.status;
    var applyContent = this.data.inputValue;

    // 某人计工申诉+确认(待核中的计工单)
    app.post('/userValuation/editStatus',
      {
        id: id,
        workerStatus: status, // 状态值(1: 申诉 2: 确认)
        applyContent: applyContent,
      }).then((res) => {
        that.setData({
          showModal: false
        })
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
  },

  totel:function(){
    var tel = this.data.list.mobile;
    wx.makePhoneCall({
      phoneNumber: tel //仅为示例，并非真实的电话号码
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
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },

  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
  }

})