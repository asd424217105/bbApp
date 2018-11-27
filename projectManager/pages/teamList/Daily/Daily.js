// pages/index/pages/teamList/Daily/Daily.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    taskId: '',
    userId: '',
    workerId: '',
    list: [],
    lists: [],
    curpage: 1,
    pagesize: 20,

    refresh: false,
    locking: false,
    videoBtnHidden: false,

    workerNum:'',
    indicatorDots: false,  // 工人列表轮播图
    duration: 500,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getTheme(this);
    var id = options.id;
    var userId = options.userId;
    var taskId = options.taskId;
    this.setData({
      id: id,
      userId: userId,
      taskId: taskId,
      curpage: 1,
      list: []
    })
    this.getMemList();
  },

  // 项目经理--获取班组下的工人列表数据
  getMemList: function () {
    var that = this;
    var userId = this.data.userId;
    var taskId = this.data.taskId;
    // 项目经理--获取班组下的工人列表数据
    app.post('/taskPerson/memList',
      {
        userId: userId,
        taskId: taskId
      }).then((res) => {
        console.log(res)

        var dataArr = res.data;
        var result = [];
        var colomns = 10;

        // js 把一个数组分割成 n 个一组
        for (var i = 0, len = dataArr.length; i < len; i += colomns) {
          result.push(dataArr.slice(i, i + colomns));
        }

        // 是否显示轮播图面板指示点
        var indicatorDots = false;
        if (dataArr.length>10){
          indicatorDots = true;
        }

        that.setData({
          lists: result,
          workerNum: dataArr.length,
          indicatorDots: indicatorDots,
        })
      }).catch((error) => { })
  },

  // 查看信息
  lookMsg:function(){
    var that = this;
    var workerId = this.data.workerId;
    var projectId = this.data.id;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    if (!workerId) {
      wx.showToast({
        title: '请选择工人',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    // 获取工人日报列表（用于项目经理，建设公司人员查看）
    app.post('/userDayreport/listByProId',
      {
        userId: workerId,
        projectId: projectId,
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
      }).catch((error) => { })
  },

  // 上传图片 视频方法-------------------------------------------

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
    uploadfun.upload.previewImage(e, this)
  },

  // 预览图片1
  previewImage1: function (e) {
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

  // ---------------------------------------------------------

  // 切换人员
  togglePeople:function(e){
    var workerId = e.currentTarget.dataset.id;
    this.setData({
      workerId: workerId,
    })
    this.onPullDownRefresh();
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      curpage: 1,
      list: []
    })
    this.lookMsg();
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
      this.lookMsg();
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
  }

})