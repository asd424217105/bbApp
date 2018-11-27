// pages/foreman/pages/findWorkersList/findWorkersList.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    callStatus: 1,  // 状态(0-待审1-筹备中2-进行中3-完成)
    targetId: '',  
    usertype: '',
    curpage: 1,
    pagesize: 20,
    list: [],
    refresh: false, 
    locking: false
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var targetId = options.id;
    var that = this;
    app.getTheme(that);
    wx.getStorage({
      key: 'userType',
      success: function (res) {
        var usertype = res.data;
        that.setData({
          usertype: usertype,
          targetId: targetId,
          curpage: 1,
          list: []
        })
        if (usertype == 1) {
          that.getTaskCallList();
        }
        if (usertype == 2 || usertype == 3) {
          that.getProjectTaskList();
        }
      },
    })
  },

  // 获取班组长负责任务号召列表
  getTaskCallList: function () {
    var that = this;
    var callStatus = this.data.callStatus;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取班组长负责任务号召列表
    app.post('/taskcall/list',
      {
        callStatus: callStatus,
        callName: '',
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

  // 获取项目经理负责的项目任务列表信息
  getProjectTaskList: function () {
    var that = this;
    var projectId = this.data.targetId;
    var callStatus = this.data.callStatus;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取项目经理负责的项目任务列表信息
    app.post('/projecttask/list',
      {
        projectId: projectId,
        taskStatus: callStatus,
        taskName: '',
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
    var usertype = this.data.usertype;
    this.setData({
      curpage: 1,
      list: []
    })
    if (usertype == 1) {
      this.getTaskCallList();
    }
    if (usertype == 2 || usertype == 3) {
      this.getProjectTaskList();
    }
    wx.stopPullDownRefresh();
  },

  // 上拉加载
  onReachBottom: function () {
    var usertype = this.data.usertype;
    var curpage = this.data.curpage;
    var locking = this.data.locking;
    if (!locking) {
      curpage++;
      this.setData({
        curpage: curpage
      })
      if (usertype == 1) {
        this.getTaskCallList();
      }
      if (usertype == 2 || usertype == 3) {
        this.getProjectTaskList();
      }
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
      callStatus: id
    })
    this.onPullDownRefresh()
  },

  // 发布招工
  addThing: function () {
    var targetId = this.data.targetId; 
    var usertype = this.data.usertype;
    // 班组长新建号召 
    if (usertype == 1){
      wx.navigateTo({
        url: 'findWorkers/findWorkers?id=' + targetId + '',
      })
    }
    // 项目部新建任务
    if (usertype == 2 || usertype == 3) {
      wx.navigateTo({
        url: '../../../projectManager/pages/findWorkersList/findWorkers/findWorkers?id=' + targetId + '',
      })
    }
  },

  // 招工详情
  toDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'findWorkersDetail/findWorkersDetail?id=' + id + '',
    })
  },

  // 申请列表
  applicationList: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'applicationList/applicationList?id=' + id + '',
    })
  },

  // 邀约列表
  InvitationedList: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'InvitationedList/InvitationedList?id=' + id + '',
    })
  },

  // 待入场人员
  comeIn: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'comeIn/comeIn?id=' + id + '',
    })
  }
})