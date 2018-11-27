// pages/index/pages/taskDetails/taskDetails.js
var app = getApp();
var uploadfun = require('../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    type: '',
    data: '',
    file_list: [],
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
    // 有的身份 有两个栏目 options.type=1 代表第二个栏目
    if (options.type){
      this.setData({
        type: options.type
      })
    }
    // 获取身份
    wx.getStorage({
      key: 'userType',
      success: function(res) {
        // 班组长
        if (res.data == 1){
          if (options.type && options.type == 1){
            that.taskCall();
          }else{
            that.projectTask();
          }        
        }
        // 工人
        if (res.data == 0) {
          that.taskCall();
        }
      },
    })
  },

  // 获取某个项目任务 (项目部  班组长)
  projectTask:function(){
    var that = this;
    var id = this.data.id;
    app.post('/projecttask/get',
      {
        id: id
      }).then((res) => {
        console.log(res)
        that.setData({
          data: res.data.projectTask,
          file_list: res.data.file_list
        })
      }).catch((error) => { })
  },

  // 获取某个号召 (班组长  工人)
  taskCall: function () {
    var that = this;
    var id = this.data.id;
    app.post('/taskcall/get',
      {
        id: id
      }).then((res) => {
        console.log(res)
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