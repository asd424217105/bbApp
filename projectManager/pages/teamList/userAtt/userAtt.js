// pages/index/pages/teamList/Daily/Daily.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    targetId: '',
    targetType: '1',
    taskId: '',
    userId: '',
    workerId: '',
    date1: '',
    list: [],
    lists: [],

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
    var userId = options.userId;
    var taskId = options.taskId;
    this.setData({
      targetId: id,
      userId: userId,
      taskId: taskId,
      list: []
    })
    this.getMemList();
    // 设置初始时间
    if (this.data.date3 == '') {
      this.getNowFormatDate()
    }
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

  // 签到日期选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date1: e.detail.value
    })
    this.lookMsg();
  },

  // 查看信息
  lookMsg: function () {
    var that = this;
    let date1 = this.data.date1;
    var workerId = this.data.workerId;
    var taskId = this.data.taskId;
    var targetType = this.data.targetType;
    if (!date1){
      wx.showToast({
        title: '请选择签到日期',
        icon:'none',
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
        targetId: taskId,
        targetType: targetType,
        dDate: date1,
        type: 1,  // 0-获取自己的1-获取指定人员的
      }).then((res) => {
        that.setData({
          list: res.data
        })
      }).catch((error) => {

      })
  },

  //获取当前时间，格式YYYY-MM-DD
  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    this.setData({
      date1: currentdate
    })
  },

  // 切换人员
  togglePeople: function (e) {
    var workerId = e.currentTarget.dataset.id;
    this.setData({
      workerId: workerId,
    })
    this.lookMsg();
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
  }

})