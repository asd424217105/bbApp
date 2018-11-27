// pages/index/pages/workPointsList/workPointsDetails/workPointsDetails.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js')

Page({
  // 页面的初始数据
  data: {
    targetId: '',  // 某计工id
    list: '',
    inputValue: '',  //反馈意见
    showModal:false,
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

  // 弹出修改
  edit:function(){
    this.setData({
      showModal: true
    })
  },

  // 删除
  del: function (e) {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var id = e.currentTarget.dataset.id;

    // 删除计工(未确认和申诉中的计工单)--工人没有删除的权限
    app.post('/userValuation/del',
      {
        id: id,
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
  },

  // 修改
  formSubmit:function(e){
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var data = e.detail.value;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    // 修改某人计工(申诉中的计工单)
    app.post('/userValuation/edit',data
    ).then((res) => {
        that.setData({
          showModal: true
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