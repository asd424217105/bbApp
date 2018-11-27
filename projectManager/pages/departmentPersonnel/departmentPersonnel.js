// pages/index/pages/teamList/Daily/Daily.js
var app = getApp();
var uploadfun = require('../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    idx:'0',
    workerId: '',
    list: [],
    lists: [],
    curpage: 1,
    pagesize: 20,
    date1: '', // 补签
    date2: '',  
    date3: '', // 签到日期
    targetType:'0',  // (0-项目 1-项目任务)
    reportType: [
      { 'id': 9, 'text': '全部类型' },
      { 'id': 0, 'text': '普通汇报' },
      { 'id': 1, 'text': '进度汇报' }
    ],
    reportTypeValue: { 'id': 9, 'text': '全部类型' },

    refresh: false,
    locking: false,
    videoBtnHidden: false,
    showModal: false,

    workerNum: '',
    indicatorDots: false,  // 工人列表轮播图
    duration: 500,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getTheme(this);
    var id = options.id;
    this.setData({
      id: id,
      curpage: 1,
      list: []
    })

    // 获取人员列表
    this.getMemList();

    // 设置初始时间
    if(this.data.date3==''){
      this.getNowFormatDate()
    }
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

  // 获取项目部人员
  getMemList: function () {
    var that = this;
    var id = that.data.id;
    // 获取项目部人员
    app.post('/project/deptMem',
      {
        projectId: id
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
        if (dataArr.length > 10) {
          indicatorDots = true;
        }

        that.setData({
          lists: result,
          workerNum: dataArr.length,
          indicatorDots: indicatorDots,
        })
      }).catch((error) => { })
  },

  // 获取工作汇报列表
  lookMsg: function () {
    var that = this;
    var targetId = this.data.id;
    var workerId = this.data.workerId;
    var targetType = this.data.targetType;
    var reportType = this.data.reportTypeValue.id;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    if (!workerId) {
      wx.showToast({
        title: '请选择人员',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    // 获取工作汇报列表
    app.post('/report/list',
      {
        opid: workerId,
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

  // 查看考勤信息
  lookTimeMsg: function () {
    var that = this;
    let date3 = this.data.date3;
    var workerId = this.data.workerId;
    var id = this.data.id;
    var targetType = this.data.targetType;
    if (!date3) {
      wx.showToast({
        title: '请选择签到日期',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!workerId) {
      wx.showToast({
        title: '请选择工人',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    // 某人某天考勤打卡记录列表(type: 0 - 获取自己的1 - 获取指定人员的)
    app.post('/userAtt/listByDay',
      {
        userId: workerId,
        targetId: id,
        targetType: targetType,
        dDate: date3,
        type: 1,  // 0-获取自己的1-获取指定人员的
      }).then((res) => {
        that.setData({
          list: res.data
        })
      }).catch((error) => {

      })
  },

  // 查询某人请假日志
  getLeaveList: function () {
    var that = this;
    var workerId = this.data.workerId;
    var targetId = this.data.id;
    var targetType = this.data.targetType;
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
    // 查询某人请假日志
    app.post('/userLeave/list',
      {
        userid: workerId,
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

  // 签到日期选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (e.currentTarget.dataset.type == 'date1') {
      this.setData({
        date1: e.detail.value
      })
    }
    if (e.currentTarget.dataset.type == 'date2') {
      this.setData({
        date2: e.detail.value
      })
    }
    if (e.currentTarget.dataset.type == 'date3') {
      this.setData({
        date3: e.detail.value
      })
      this.lookTimeMsg();
    }
  },

  // 选择汇报类型
  bindTypeChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var reportType = this.data.reportType;
    this.setData({
      reportTypeValue: reportType[e.detail.value],
      list: [],
      curpage: '1'
    })
    this.lookMsg();
  },

  //获取当前时间，格式YYYY-MM-DD
  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if(month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    this.setData({
      date3: currentdate
    })
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

  // toptab切换
  switchTab: function (e) {
    var idx = e.currentTarget.dataset.id;
    this.setData({
      idx: idx,
      list: [],
      curpage:'1'
    })
    if (idx == 0){
      this.lookMsg()
    } 
    if (idx == 1) {
      this.lookTimeMsg()
    }
    if (idx == 2) {
      this.getLeaveList()
    }
  },

  // 切换人员
  togglePeople: function (e) {
    var workerId = e.currentTarget.dataset.id;
    this.setData({
      workerId: workerId,
    })
    this.onPullDownRefresh();
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    var idx = this.data.idx;
    this.setData({
      curpage: 1,
      list: []
    })
    if (idx == 0) {
      this.lookMsg()
    }
    if (idx == 1) {
      this.lookTimeMsg()
    }
    if (idx == 2) {
      this.getLeaveList()
    }
    wx.stopPullDownRefresh();
  },

  // 上拉加载
  onReachBottom: function () {
    var idx = this.data.idx;
    var curpage = this.data.curpage;
    var locking = this.data.locking;
    if (!locking) {
      curpage++;
      this.setData({
        curpage: curpage
      })
      if (idx == 0) {
        this.lookMsg()
      }
      if (idx == 1) {
        this.lookTimeMsg()
      }
      if (idx == 2) {
        this.getLeaveList()
      }
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 查看位置
  weizhi: function (e) {
    console.log(e.currentTarget.dataset.item)
    var latitude = e.currentTarget.dataset.item.lat;
    var longitude = e.currentTarget.dataset.item.lng;
    latitude = Number(latitude);
    longitude = Number(longitude);
    console.log(latitude)
    console.log(longitude)
    wx.openLocation({
      latitude,
      longitude
    })
  },

  // 跳转到对应汇报详情页面
  toDetails: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../progressReport/progressReportDetails/progressReportDetails?id=' + id + '&type=1',
    })
  },

  // 跳转到月历打卡页面
  toMonth: function () {
    var id = this.data.id;
    wx.navigateTo({
      url: '../userAtt/userAtt?id=' + id + '',
    })
  },

  // 跳转到对应请假详情页面
  toLeave: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../leaveList/leaveDetails/leaveDetails?id=' + id + '&type=1',
    })
  },

  //选择提交  补签
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    this.setData({
      showModal: false
    })
    var that = this;
    var userid = this.data.workerId;
    var targetId = this.data.id;
    var targetType = this.data.targetType;
    var date1 = this.data.date1;
    var date2 = this.data.date2;
    var date = date1 + ' ' + date2 + ':00';
    console.log(date)
    wx.showLoading({
      title: '正在补签...',
    })
    wx.getLocation({
      type: 'gcj02',
      success: function (e) {
        console.log(e)
        var latitude = e.latitude;
        var longitude = e.longitude;
        // 某人考勤打卡或补签(type: 0 - 自己打卡1 - 上级为下级补签)
        app.post('/userAtt/add',
          {
            userId: userid,
            targetId: targetId,
            targetType: targetType,
            attType: 1,  // 打卡类型(0-正常1-补签)
            type: 1,   // 0-自己打卡1-上级为下级补签
            lng: longitude,
            lat: latitude,
            address: '',  // 地址（选填）
            ctime: date,  // 时间(type:0正常打卡不填写,type:1补签时填写)（2018-09-29 14:30:00）
          }).then((res) => {
            wx.hideLoading();
            wx.showToast({
              title: '打卡成功',
              icon: 'success',
              duration: 2000
            })
            that.lookTimeMsg();
          }).catch((error) => {

          })
      }
    })
  },

  // --------------模态弹窗-----------
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },

  /**
   * 显示对话框
   */
  toggleModal: function () {
    this.setData({
      showModal: true,
      date1: '',
      date2: ''
    });
  },

  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },


  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },

  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
  }

})