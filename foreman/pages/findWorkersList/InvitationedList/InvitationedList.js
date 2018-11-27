// pages/index/pages/InvitationedList/InvitationedList.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    targetId: '',
    usertype: '',
    inviType: 0,  // 报名状态（0-邀约的 1报名的）
    curpage: 1,
    pagesize: 20,
    userIds: '',
    items: [
      { name: 'all', value: '全选' },
    ],
    list: [],
    listValue: [],
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
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
          that.getUserlist();
        }
        if (usertype == 2 || usertype == 3) {
          that.getTaskPersonList();
        }
      },
    })
  },

  // 获取申请任务号召的工人列表
  getUserlist: function () {
    var that = this;
    var targetId = this.data.targetId;
    var inviType = this.data.inviType;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取申请任务号召的工人列表
    app.post('/callPerson/userlist',
      {
        id: targetId,
        inviType: inviType,
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

  // 获取申请任务的班组列表
  getTaskPersonList: function () {
    var that = this;
    var targetId = this.data.targetId;
    var inviType = this.data.inviType;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取申请任务的班组列表
    app.post('/taskPerson/userlist',
      {
        id: targetId,
        inviType: inviType,
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

  // 下拉刷新
  onPullDownRefresh: function () {
    var usertype = this.data.usertype;
    this.setData({
      curpage: 1,
      list: []
    })
    if (usertype == 1) {
      this.getUserlist();
    }
    if (usertype == 2 || usertype == 3) {
      this.getTaskPersonList();
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
        this.getUserlist();
      }
      if (usertype == 2 || usertype == 3) {
        this.getTaskPersonList();
      }
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 全选框
  checkboxAll: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var list = this.data.list;
    var listValue = [];
    if (e.detail.value[0] == 'all') {
      for (var i in list) {
        list[i].checked = true;
        listValue.push(list[i].inviId)
      }
      this.setData({
        list: list,
        listValue: listValue
      })
    }
    if (e.detail.value.length == '0') {
      for (var i in list) {
        list[i].checked = false;
      }
      this.setData({
        list: list,
        listValue: []
      })
    }
    console.log(this.data.listValue)
  },

  // 多选框
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      listValue: e.detail.value
    })
    console.log(this.data.listValue)
  }
})