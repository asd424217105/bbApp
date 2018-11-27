// pages/my/pages/myAbility/myAbility.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  getAbility: function (id) {
    var that = this;
    app.post('/userAbility/listAbility', { userid: id }).then((res) => {
      console.log(res)
      that.setData({
        abilityList: res.data
      })
      let array = [];
      for (var i = 0; i < that.data.abilityList.length; i++) {
        let text = app.getWorkKindArrayText(this.data.WORK_KINDArray, that.data.abilityList[i].work_kind_id);
        array.push(text);
      }
      that.setData({
        workKindTextArray: array
      })

      console.log(that.data)
    }).catch((error) => {

    })
    
  },

  add: function () {
    wx.navigateTo({
      url: '../addMyAbility/addMyAbility',
    })
  },

  modify: function (e) {
    wx.navigateTo({
      url: '../addMyAbility/addMyAbility?id=' + e.target.dataset.id + '&userid=' + e.target.dataset.userid,
    })
  },

  del: function (e) {
    var that = this;
    app.post('/userAbility/delAbility', {
      id: e.target.dataset.id
    }).then((res) => {
      that.getAbility(that.data.userId);
    }).catch((error) => {

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.post('/sysworkkind/list', {}).then((res) => {
      console.log('获取工种成功！')
      console.log(res)
      that.setData({
        WORK_KINDArray: res.data,
      })
    }).catch((error) => {

    })
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
      success: function (res) {
        that.setData({
          userId: res.data.id
        })
        that.getAbility(res.data.id)
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