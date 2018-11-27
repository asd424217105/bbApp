// pages/index/pages/workerDailyList/workerDailyList.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    userId: 0,  // 工人id (选传。默认值：0，条件查询);
    targetId: '',  // 目标id
    usertype: '',  //  身份

    list: [],
    curpage: 1,
    pagesize: 20,

    refresh: false,
    locking: false
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    app.getTheme(that);
    var id = options.id;
    // 根据身份判断 目标类型是 (0-项目 或 1-任务)
    wx.getStorage({
      key: 'userType',
      success: function (res) {
        that.setData({
          usertype: res.data
        })
      },
    })
    this.setData({
      targetId: id,
      curpage: 1,
      list: []
    })
    this.getAcceptList();
  },

  // 获取工人日报列表（用于带班，班组长） 传参说明：带班和班组长查看工人日报时传参callId(必传)和userId(选传。默认值：0，条件查询);
  getAcceptList: function () {
    var that = this;
    var callId = this.data.targetId;
    var userId = this.data.userId;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取工人日报列表（用于带班，班组长）
    app.post('/userDayreport/listByCallId',
      {
        callId: callId,
        userId: userId,
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
    this.getAcceptList();
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
      this.getAcceptList();
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
      url: 'workerDailyDetails/workerDailyDetails?id=' + id + '',
    })
  },

  // 新建
  addThing: function () {
    var targetId = this.data.targetId;
    wx.navigateTo({
      url: 'addWorkerDaily/addWorkerDaily?id=' + targetId + '',
    })
  }
})