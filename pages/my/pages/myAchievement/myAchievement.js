// pages/my/pages/myAchievement/myAchievement.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    achienementList: []
  },

  getAchievement: function (id) {
    var that = this;
    console.log({ userid: id })
    app.post('/userAchievement/listAchievement', {userid: id}).then((res) => {
      console.log('获取我的业绩成功！')
      console.log(res)
      that.setData({
        achienementList: res.data
      })
      let array = [];
      for (var i = 0; i < that.data.achienementList.length; i ++) {
        let text = app.getOneCodeArrayText(this.data.ROLE_TYPEArray, that.data.achienementList[i].role_type);
        array.push(text);
      }
      that.setData({
        workTypeTextArray: array
      })
      console.log(that.data)
    }).catch((error) => {

    })
  },

  add: function () {
    wx.navigateTo({
      url: '../addMyAchievement/addMyAchievement',
    })
  },

  modify: function (e) {
    wx.navigateTo({
      url: '../addMyAchievement/addMyAchievement?id=' + e.target.dataset.id + '&userid=' + e.target.dataset.userid,
    })
  },

  del: function (e) {
    var that = this;
    console.log({
      id: e.target.dataset.id
    })
    app.post('/userAchievement/delAchievement',{
      id: e.target.dataset.id
    }).then((res) => {
      that.getAchievement(that.data.userId);
    }).catch((error) => {

    })
  },

  // 上传图片 视频方法-------------------------------------------

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
    uploadfun.upload.AchievementPreviewImage(e, this)
  },

  // ---------------------------------------------------------

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getSysCode(
      ['ROLE_TYPE_YJ'],
      ['ROLE_TYPEArray'], this);
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
    var that = this;
    app.getTheme(that);
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          userId: res.data.id
        })
        that.getAchievement(res.data.id)
      },
    })
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

  // 上下滚动时
  onPageScroll: function (ev) {
    var _this = this;
    //当滚动的top值最大或最小时，为什么要做这一步是因为在手机实测小程序的时候会发生滚动条回弹，所以为了处理回弹，设置默认最大最小值
    if (ev.scrollTop <= 0) {
      ev.scrollTop = 0;
    }

    // 动画
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    _this.animation = animation

    //判断浏览器滚动条上下滚动
    if (ev.scrollTop > this.data.scrollTop || ev.scrollTop == wx.getSystemInfoSync().windowHeight) {
      //向下滚动
      animation.rotateX(90).step()

    } else {
      //向上滚动
      animation.rotateX(0).step()

    }

    //给scrollTop重新赋值
    setTimeout(function () {
      _this.setData({
        scrollTop: ev.scrollTop,
        animationData: animation.export()
      })
    }, 0)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})