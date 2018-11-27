// pages/foreman/pages/InvitationsList/InvitationsList.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    taskId: '',
    targetType: 1,
    usertype: '',
    curpage: 1,
    pagesize: 20,
    items: [
      { name: 'all', value: '全选' },
    ],
    list: [], 
    listValue: [],
    locking: false
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    var taskId = options.id;
    var that = this;
    app.getTheme(that);
    wx.getStorage({
      key: 'userType',
      success: function(res) {
        var usertype = res.data;
        that.setData({
          usertype: usertype,
          taskId: taskId,
          curpage: 1,
          list: []
        })
        if (usertype == 1){
          that.getWorkerlist();
          that.setData({
            targetType: 1
          })
        }
        if (usertype == 2 || usertype == 3) {
          that.getForemanlist();
          that.setData({
            targetType: 0
          })
        }
      },
    })
    
  },

  // 获取曾经合作过的和自己的工人列表信息-用于主动邀约
  getWorkerlist: function () {
    var that = this;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取曾经合作过的和自己的工人列表信息-用于主动邀约
    app.post('/callPerson/workerlist',
      {
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


  // 项目经理端-获取曾经合作过的班组长和自己的班组列表信息--用于主动邀约
  getForemanlist: function () {
    var that = this;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 项目经理端-获取曾经合作过的班组长和自己的班组列表信息--用于主动邀约
    app.post('/taskPerson/foremanlist',
      {
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
      this.getWorkerlist();
    }
    if (usertype == 2 || usertype == 3) {
      this.getForemanlist();
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
        this.getWorkerlist();
      }
      if (usertype == 2 || usertype == 3) {
        this.getForemanlist();
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
    if (e.detail.value[0] == 'all'){
      for(var i in list){
        list[i].checked = true;
        listValue.push(list[i].userId)
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
  },

  // 确定
  toOk:function(){
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 3];  //上一个页面
    var targetType = this.data.targetType;
    var taskId = this.data.taskId;
    var listValue = this.data.listValue;
    listValue = listValue.join(',');
    // 项目经理主动邀约班组长  班组长主动邀约工人
    app.post('/apply/leaderadd',
      {
        targetType: targetType,
        targetId: taskId,
        userIds: listValue
      }).then((res) => {
        console.log(res)
        // 返回上一页要刷新
        prevPage.setData({
          refresh: true
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 2
          })
        }, 800)
      }).catch((error) => {})
  }

})