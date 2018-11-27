// pages/index/pages/leaveList/leaveList.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    targetId: '',   // 项目id
    targetType: '',  // 目标类型(0-项目1-任务 2-号召)
    usertype: '',   // 人员身份
    userid: '',
    typeid:'',

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
    var typeid = options.type;
    // 判断身份
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res)
        var usertype = res.data.user_type;
        var userid = res.data.id;
        if (typeid == 0) {
          that.setData({
            targetId: id,
            targetType: 0,
            usertype: usertype,
            userid: userid,
            typeid: typeid,
            list: []
          })
          that.getLeaveList();
        }
        if (typeid == 1) {
          that.setData({
            targetId: id,
            targetType: 1,
            usertype: usertype,
            userid: userid,
            typeid: typeid,
            list: []
          })
          that.getLeaveListAll();
        }
      },
    })
  },

  // 查询某人请假日志
  getLeaveList: function () {
    var that = this;
    var userid = this.data.userid;
    var targetId = this.data.targetId;
    var targetType = this.data.targetType;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 查询某人请假日志
    app.post('/userLeave/list',
      {
        userid: userid,
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

  // 查询所有（项目，任务号召）人的请假列表
  getLeaveListAll: function () {
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
    var typeid = this.data.typeid;
    this.setData({
      curpage: 1,
      list: []
    })
    if (typeid == 0) {
      this.getLeaveList();
    }
    if (typeid == 1) {
      this.getLeaveListAll();
    }
    wx.stopPullDownRefresh();
  },

  // 上拉加载
  onReachBottom: function () {
    var curpage = this.data.curpage;
    var locking = this.data.locking;
    var typeid = this.data.typeid;
    if (!locking) {
      curpage++;
      this.setData({
        curpage: curpage
      })
      if (typeid == 0) {
        this.getLeaveList();
      }
      if (typeid == 1) {
        this.getLeaveListAll();
      }
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
