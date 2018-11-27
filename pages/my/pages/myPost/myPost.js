// pages/my/pages/myPost/myPost.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: 'red',
    userType: 0,
    postNum: 0,
    list: [],
    pagesize: 20,
    curpage: 1,
    refresh: false,
    locking: false,
    id: '',
    scrollTop: '',
    animationData: {},
    videoBtnHidden: false
  },

  //删除自己的朋友圈
  workmateDelete: function (e) {
    console.log(e.target.dataset.id)
    let id = e.target.dataset.id;
    app.post('/corpUsersZone/del',{id: id}).then((res) => {
      this.onPullDownRefresh();
      console.log('删除朋友圈成功！')
      // wx.showToast({
      //   title: '删除朋友圈成功！',
      // })
    }).catch((error) => {
      wx.showToast({
        title: error,
      })
      console.log('删除朋友圈失败！')
    })
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

  // 获取工友圈列表
  corpUsersZone: function () {
    var that = this;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取工友圈api
    app.post('/corpUsersZone/list',
      {
        userid: this.data.userid,//0
        curpage: curpage,
        pagesize: pagesize
      }).then((res) => {
        console.log(res)
        var reslist = res.data.list;
        var list = that.data.list;
        var total = res.data.total;
        list.push.apply(list, reslist);
        that.setData({
          list: list,
          postNum: total
        })
        // 如果没有下一页数据了 上拉锁定
        if (!res.data.hasNextPage) {
          that.setData({
            locking: true
          })
        } else {
          that.setData({
            locking: false
          })
        }
      }).catch((error) => { })
  },


  // 视频 图片 预览播放--------------------------

  // 点击预览图片时播放视频
  bindplayimg: function (e) {
    var idname = e.currentTarget.dataset.idname;
    this.bindplay(idname);
  },

  // 视频播放时自动全屏
  bindplay: function (idname) {
    this.setData({
      videoBtnHidden: true
    })
    var videoContext = wx.createVideoContext(`${idname}`);
    videoContext.play();
    videoContext.requestFullScreen();
  },

  // 退出全屏时
  bindfullscreenchange: function (e) {
    console.log(e)
    var idname = e.currentTarget.id;
    if (e.detail.fullScreen == false) {
      this.setData({
        videoBtnHidden: false
      })
      var videoContext = wx.createVideoContext(`${idname}`);
      videoContext.seek(0.0);
      videoContext.pause();
    }
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userid = app.globalData.userInfo.id;
    if (userid) {
      this.setData({
        userid: userid
      })
    }
    this.setData({
      curpage: 1,
      list: []
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
    app.getTheme(that)
    wx.getStorage({
      key: 'userType',
      success: function (res) {
        that.setData({
          userType: res.data
        })
      },
    })
    this.corpUsersZone();
    if (this.data.refresh) {
      this.onPullDownRefresh();
      this.setData({
        refresh: false
      })
    }
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
    this.setData({
      curpage: 1,
      list: []
    })
    this.corpUsersZone();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var curpage = this.data.curpage;
    var locking = this.data.locking;
    if (!locking) {
      curpage++;
      this.setData({
        curpage: curpage
      })
      this.corpUsersZone();
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})