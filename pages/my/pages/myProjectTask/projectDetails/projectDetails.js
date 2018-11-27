// pages/ConstructionCompany/pages/projectDetails/projectDetails.js
var app = getApp();
var uploadfun = require('../../../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',  // 项目id
    data: [],
    file_list: [],
    targetType: 0,
    projectActiveType: '',
    projectType: '',
    projectMajor: '',
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
    // 获取项目详情
    app.post('/project/get',
      {
        id: id
      }).then((res) => {
        console.log(res)
        var project = res.data.project;
        that.setData({
          data: res.data.project,
          file_list: res.data.file_list
        })

        // 获取字典信息
        app.post('/common/sysParam/getSysCode', {}).then((res) => {
          var projectActiveType = app.getCodeArrayText(res.data, 'PROJECT_ACTIVE_TYPE', project.projectActiveType)
          var projectType = app.getCodeArrayText(res.data, 'PROJECT_TYPE', project.projectType)
          var projectMajor = app.getCodeArrayText(res.data, 'PROJECT_MAJOR', project.projectMajor)
          that.setData({
            projectActiveType: projectActiveType,
            projectType: projectType,
            projectMajor: projectMajor,
          })
        }).catch((error) => { })

      }).catch((error) => { })
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

  // 删除项目
  delProject: function () {
    var that = this;
    var id = this.data.id;
    // 删除项目
    app.post('/project/del',
      {
        id: id
      }).then((res) => {

      }).catch((error) => { })
  }
})