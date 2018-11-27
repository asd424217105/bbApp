// pages/index/pages/taskDetails/taskDetails.js
var app = getApp();
var uploadfun = require('../../../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    data: '',
    file_list: [],
    settlementTypeText: '', // 获取字典里的code对应的值
    taskJilUnitText: '', // 获取字典里的code对应的值
    targetType: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getTheme(that);
    var id = options.id;
    this.setData({
      id: id
    })

    that.taskCall();
  },

  // 获取某个号召
  taskCall: function () {
    var that = this;
    var id = this.data.id;
    app.post('/taskcall/get',
      {
        id: id
      }).then((res) => {
        console.log(res)
        var project = res.data.taskCall;

        // 获取字典信息
        app.post('/common/sysParam/getSysCode', {}).then((res) => {
          var settlementTypeText = app.getCodeArrayText(res.data, 'SETTLEMENT_TYPE', project.settlementType)
          var taskJilUnitText = app.getCodeArrayText(res.data, 'SETTLEMENT_UNIT', project.callJilUnit)
          that.setData({
            settlementTypeText: settlementTypeText,
            taskJilUnitText: taskJilUnitText
          })
        }).catch((error) => { })

        that.setData({
          data: res.data.taskCall,
          file_list: res.data.file_list
        })
      }).catch((error) => { })
  },


  // 查看位置
  toLocation: function () {
    var latitude = this.data.data.lat;
    var longitude = this.data.data.lng;
    if (latitude != '' && longitude != '') {
      latitude = Number(latitude)
      longitude = Number(longitude)
      wx.openLocation({
        latitude: latitude,
        longitude: longitude,
        scale: 28
      })
    } else {
      wx.showToast({
        title: '暂无位置信息',
        icon: 'none',
        duration: 2000
      })
    }

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
  }

  //-----------------------------------------------


})