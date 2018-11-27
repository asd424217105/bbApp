// pages/my/pages/myTeam/myTeam.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nameOrPhone: '',
    list:[],
    clear: true,
    pagesize: 20,
    curpage: 1,
    refresh: false,
    locking: false,
    scrollTop: '',
    animationData: {},
    isMy: 0
  },
  //清空查询
  clearSearch: function () {
    this.setData({
      nameOrPhone: '',
      clear: true
    })
  },
  //查询改变事件
  searchInput: function (e) {
    var value =e.detail.value;
    
    if (value) {
      this.setData({
        nameOrPhone: value,
        clear: false
      })
    } else {
      this.setData({
        nameOrPhone: '',
        clear: true
      })
    }
  },
  //查询事件
  search: function () {
    this.getTeam(this.data.nameOrPhone)
  },

  outPut: function () {
    wx.navigateTo({
      url: 'outPut/outPut',
    })
  },

  //获取队伍
  getTeam: function (param) {
    console.log('进入获取队伍！')
    var that = this;
    // var curpage = this.data.curpage;
    // var pagesize = this.data.pagesize;
    if (!param) {
      param = ''
    }
    app.post('/callPerson/myTeam', { param: param}).then((res) => {
      console.log(res.data)
      that.setData({
        list: res.data.list,
        leaderName: res.data.realName,
        leaderKind: res.data.kindName,
        leaderPhone: res.data.mobile
      })

      // var reslist = res.data.list;
      // var list = that.data.list;
      // list.push.apply(list, reslist);
      // that.setData({
      //   list: list
      // })
      // // 如果没有下一页数据了 上拉锁定
      // if (!res.data.hasNextPage) {
      //   that.setData({
      //     locking: true
      //   })
      // } else {
      //   that.setData({
      //     locking: false
      //   })
      // }
    }).catch((error) => {

    })
  },
  //工人信息 
  workerInfo: function (e) {
    console.log('进入工人信息详情')
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/foreman/pages/myWorkers/workersDetail/workersDetail?id=' + id + '',
    })
  },
  //删除工人
  deleteWorker: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '',
      content: '是否删除该工人？',
      confirmColor: '#FE3F44',
      success: function (res) {
        if (res.cancel) {
          console.log('退出删除！')
        }
        if (res.confirm) {
          console.log('进入删除！')
          app.post('/user/removeWorker', { userIds: ''+id}).then((res) => {
            wx.showToast({
              title: '删除成功！',
            })
            that.getTeam()
          }).catch((error) => {
            wx.showToast({
              title: '删除失败！',
            })
          })
        }
        // app.post('', {}).then((res) => {

        // }).catch((error) => {

        // })
      },
    })
    
  },

  leaveTeam: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否确定退出班组？',
      confirmColor: '#FEBA01',
      success: function (res) {
        if (res.cancel) {
          console.log('取消退出！')
        }
        if (res.confirm) {
          // that.getTeam()
          app.post('/user/outTeam', {}).then((res) => {
            console.log('退出班组成功！')
            that.setData({
              list: []
            })
          }).catch((error) => {

          })
        }
      }
    })
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getTheme(that)
    that.setData({
      isMy: app.globalData.userInfo.id
    })
    // console.log(that.data.isMy)
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
    that.getTeam()
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // this.setData({
    //   curpage: 1,
    //   list: []
    // })
    // this.getTeam();
    // wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // var curpage = this.data.curpage;
    // var locking = this.data.locking;
    // if (!locking) {
    //   curpage++;
    //   this.setData({
    //     curpage: curpage
    //   })
    //   this.getTeam();
    // } else {
    //   wx.showToast({
    //     title: '没有更多数据了',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})