// pages/index/pages/leaveList/leaveList.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    targetId: '',   // 项目id
    targetType: 2,  // 目标类型(0-项目1-任务 2-号召)
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
    // 判断身份
    wx.getStorage({
      key: 'userType',
      success: function (res) {
        console.log(res)
        that.setData({
          usertype: res.data,
          targetId: id,
          curpage: 1,
          list: []
        })
        that.getLeaveList();
      },
    })
  },

  // 查询所有（项目，任务号召）人的请假列表
  getLeaveList: function () {
    var that = this;
    var targetId = this.data.targetId;
    var targetType = this.data.targetType;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 查询所有（项目，任务号召）人的请假列表
    app.post('/userLeave/listByAll',
      {
        targetId: targetId,
        targetType: targetType,
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

  // 跳转到对应请假详情页面
  toDetails: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'leaveDetails/leaveDetails?id=' + id + '',
    })
  },

  // 新建请假
  addThing: function () {
    var targetId = this.data.targetId;
    wx.navigateTo({
      url: 'addLeave/addLeave?id=' + targetId + '',
    })
  }
})
