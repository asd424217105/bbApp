// pages/index/pages/workPointsList/workPointsList.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    targetId: '',   // 目标id
    userid: '',     // 工人id
    usertype: '',   // 人员身份

    list: [],
    curpage: 1,
    pagesize: 20,

    refresh: false,
    locking: false
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    var that = this;
    app.getTheme(that);
    var id = options.id;
    var userId = options.userId;
    // 判断身份
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res)
        that.setData({
          usertype: res.data.user_type,
          userid: userId,
          targetId: id,
          curpage: 1,
          list: []
        })
        that.getLeaveList();
      },
    })
  },

  // 查询所有工人计工列表-班组长端
  getLeaveList: function () {
    var that = this;
    var userid = this.data.userid;
    var targetId = this.data.targetId;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 查询所有工人计工列表-班组长端
    app.post('/userValuation/teamList',
      {
        userId: userid,
        callId: targetId,
        curpage: curpage,
        pagesize: pagesize
      }).then((res) => {
        var reslist = res.data.list;
        var list = that.data.list;
        list.push.apply(list, reslist);
        that.setData({
          list: list
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
      }).catch((error) => {

      })
  },

  // 页面显示时
  onShow: function () {
    if (this.data.refresh) {
      this.onPullDownRefresh();
      this.setData({
        refresh: false
      })
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      curpage: 1,
      list: []
    })
    this.getLeaveList();
    wx.stopPullDownRefresh();
  },

  // 上拉加载
  onReachBottom: function () {
    var curpage = this.data.curpage;
    var locking = this.data.locking;
    if (!locking) {
      curpage++;
      this.setData({
        curpage: curpage
      })
      this.getLeaveList();
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 跳转到对应详情页面
  toDetails: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'workPointsDetails/workPointsDetails?id=' + id + '',
    })
  },

  // 新建计工
  addThing: function () {
    var targetId = this.data.targetId;
    var userid = this.data.userid;
    wx.navigateTo({
      url: 'addWorkPoints/addWorkPoints?id=' + targetId + '&userId=' + userid + '',
    })
  }
})
