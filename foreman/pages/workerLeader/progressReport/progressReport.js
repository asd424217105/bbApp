// pages/foreman/pages/progressReport/progressReport.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    idx: 0,  // 汇报类型(0-普通1-进度)
    targetId: '',  // 目标id
    targetType: 1,  // 目标类型(0-项目1-任务)
    usertype: '',
    curpage: 1,
    pagesize: 20,
    list: [],
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
        var usertype = res.data;

        that.setData({
          usertype: usertype,
          targetId: id,
          curpage: 1,
          list: []
        })

        that.getReportOtherList();
      },
    })

  },

  // 获取工作汇报列表  （其他人的）
  getReportOtherList: function () {
    var that = this;
    var targetId = this.data.targetId;
    var targetType = this.data.targetType;
    var reportType = this.data.idx;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取工作汇报列表
    app.post('/report/listByOther',
      {
        targetId: targetId,
        targetType: targetType,
        reportType: reportType,
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
    this.getReportOtherList();
    wx.stopPullDownRefresh();
  },

  // 上拉加载
  onReachBottom: function () {
    var typeid = this.data.typeid;
    var curpage = this.data.curpage;
    var locking = this.data.locking;
    if (!locking) {
      curpage++;
      this.setData({
        curpage: curpage
      })
      this.getReportOtherList();
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // toptab切换
  switchTab: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      idx: id
    })
    this.onPullDownRefresh()
  },

  // 跳转到对应汇报详情页面
  toCheckDetails: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../progressReportDetails/progressReportDetails?id=' + id + '',
    })
  }
})