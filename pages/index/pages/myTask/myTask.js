// pages/index/pages/notice/notice.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js');

Page({
  // 页面的初始数据
  data: {
    idx: 2,  // 任务类型(1-我发起2-我负责3-我协助)
    id: '',  // 目标id
    upId: '',  // 目标上级id
    targetType: '',  // 目标类型（0-项目1-项目任务2-任务号召）
    usertype: '',  // 身份
    list: [],
    curpage: 1,
    pagesize: 20,
    refresh: false,
    locking: false
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    var id = options.id;
    var typeid = options.type;

    // 如果有目标上级id
    var upId = options.upId;
    if (options.upId){
      this.setData({
        upId: upId
      })
    }

    var that = this;
    app.getTheme(that)
    wx.getStorage({
      key: 'userType',
      success: function (res) {
        var usertype = res.data;
        that.setData({
          id: id,
          curpage: 1,
          usertype: usertype,
          list: []
        })
        // 建设公司-------
        if (usertype >= 4){
          that.setData({
            targetType: 0
          })
        }
        // 项目部---------
        if (usertype >= 2 && usertype <= 3) {
          if(typeid == 0){
            that.setData({
              targetType: 0
            })
          }
          if (typeid == 1) {
            that.setData({
              targetType: 1
            })
          }
        }
        // 班组长---------
        if (usertype == 1) {
          if (typeid == 0) {
            that.setData({
              targetType: 1
            })
          }
          if (typeid == 1) {
            that.setData({
              targetType: 2
            })
          }
        }
        // 工人---------
        if (usertype == 0) {
          that.setData({
            targetType: 2
          })
        }
        that.getMessageList();
      },
    })

  },

  // 获取任务列表
  getMessageList: function () {
    var that = this;
    var taskType = this.data.idx;
    var targetId = this.data.id;
    var targetType = this.data.targetType;
    if (taskType == 2 || taskType == 3) {
      if (targetType>0){
        targetType = targetType - 1;
      }
      if (this.data.upId){
        targetId = this.data.upId;
      }
    }
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取任务列表
    app.post('/userTasks/list',
      {
        taskType: taskType,
        targetType: targetType,
        curpage: curpage,
        pagesize: pagesize,
        targetId: targetId
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
    this.getMessageList();
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
      this.getMessageList();
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
      idx: id,
      curpage: 1,
      list: []
    })
    this.getMessageList()
  },

  // 视频 图片 预览播放--------------------------

  // 点击预览图片时播放视频
  bindplayimg: function (e) {
    var idname = e.currentTarget.dataset.idname;
    uploadfun.upload.bindplay(idname, this);
  },

  // 退出全屏时
  bindfullscreenchange: function (e) {
    uploadfun.upload.bindfullscreenchange(e, this)
  },


  // 预览图片
  previewImage: function (e) {
    var imglist = e.target.dataset.list;
    var current = e.target.dataset.src;
    var arr = [];
    for (var i in imglist) {
      if (imglist[i].fileType == 3) {
        arr.push(imglist[i].newFilename)
      }
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接数组
    })
  },

  //-----------------------------------------------

  // 发布任务
  addProject: function () {
    var id = this.data.id;
    var targetType = this.data.targetType;
    wx.navigateTo({
      url: 'addTask/addTask?id=' + id + '&targetType=' + targetType+'',
    })
  }

})