// pages/foreman/pages/beInvited/beInvited.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    idx: 0,
    list: [],
    usertype: '',
    pagesize: 20,
    curpage: 1,
    locking: false,
    refresh: false,
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    app.getTheme(that)
    this.setData({
      list: [],
      curpage: 1
    })
    wx.getStorage({
      key: 'userType',
      success: function(res) {
        var usertype = res.data
        that.setData({
          usertype: usertype
        })
        if (usertype == 1){
          that.getTaskList()
        }
        if (usertype == 0){
          that.getCallList()
        }
      },
    })
    
  },

  // 获取班组长负责的项目任务列表（待处理任务接口）
  getTaskList: function () {
    var that = this;
    var idx = this.data.idx;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    app.post('/projecttask/tasklist',
      {
        taskName: '',
        inviType: idx,
        curpage: curpage,
        pagesize: pagesize
      }).then((res) => {
        that.setData({
          list: res.data.list
        })
      }).catch((error) => {

      })
  },

  // 获取工人负责的任务号召列表 （待处理号召接口）
  getCallList:function(){
    var that = this;
    var idx = this.data.idx;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    app.post('/taskcall/calllist',
      {
        callName: '',
        inviStatus: idx,
        curpage: curpage,
        pagesize: pagesize
      }).then((res) => {
        that.setData({
          list: res.data.list
        })
      }).catch((error) => {

      })
  },

  // 页面显示时是否下拉刷新
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
      this.getTaskList()
    }
    if (usertype == 0) {
      this.getCallList()
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
        this.getTaskList()
      }
      if (usertype == 0) {
        this.getCallList()
      }
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 进入列表详情
  toDetil: function (e) {
    var id = e.currentTarget.dataset.id;
    var usertype = this.data.usertype;
    if (usertype == 0) {
      wx.navigateTo({
        url: '../../../find/pages/calljoblist/calljoblist?id=' + id + '&beInvited=1'
      })
    }
    if (usertype== 1){
      wx.navigateTo({
        url: '../../../find/pages/taskjobDetails/taskjobDetails?id=' + id + '&beInvited=1'
      })
    }
  },

  // 取消加入
  toNotJoin:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var usertype = this.data.usertype;
    wx.showModal({
      title: '提示',
      content: '确定取消加入？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (usertype == 0){
            // 工人处理 - 待处理任务
            app.post('/taskcall/handleCalls',
              {
                callId: id,
                inviStatus: 3  // 状态(1-同意3-拒绝)
              }).then((res) => {
                that.onPullDownRefresh()
              }).catch((error) => {

              })
          }else{
            // 班组长处理-待处理任务
            app.post('/projecttask/handleTasks',
              {
                taskId: id,
                inviStatus: 3  // 状态(1-同意3-拒绝)
              }).then((res) => {
                that.onPullDownRefresh()
              }).catch((error) => {

              })
          }
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})