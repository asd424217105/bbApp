var app = getApp();
var uploadfun = require('../../../../utils/upload.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imglist: [],   //上传图片 视频所需字段（3个）
    file_code: '',  // 上传文件的此批编号
    videoBtnHidden: false,  //播放视频覆盖按钮
    noteContent: '',
    cDate: '',
    theme: 'red',
    id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 生成file_code编号
    uploadfun.upload.fileCode(this)
    this.getTime()
    app.getTheme(this)
    if (options.id){
      this.setData({
        id: options.id
      })
    }
    console.log(this.data.id)
    if(this.data.id > 0){
      app.post('/userNote/getNote', {
        id: this.data.id
      }).then((res) => {
        console.log(res)
        let array = [];
        for (let i = 0; i < res.data.file_list.length; i ++) {
          array.push({
            fileType: res.data.file_list[i].fileType,
            url: res.data.file_list[i].newFilename,
            fileId: res.data.file_list[i].id
          })
        }
        
        this.setData({
          imglist: array,
          file_code: res.data.file_code,
          noteContent: res.data.content,
          cDate: res.data.ctime
        })

        console.log(this.data)
      }).catch((error) => {

      })
    }
  },
  //获取当前时间
  getTime: function () {
    let date = new Date();
    let cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '  ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    this.setData({
      cDate: cDate
    })
  },
  //获取填写的内容
  noteEdit: function (e) {
    this.setData({
      noteContent: e.detail.value
    })
  },

  //提交记事本
  subNote: function () {
    if (this.data.id > 0) {
      app.post('/userNote/edit', {
        id: this.data.id,
        content: this.data.noteContent
      }).then((res) => {
        wx.navigateBack({
          delta: 1
        })
      }).catch((error) => {

      })
    } else {
      app.post('/userNote/add', {
        file_code: this.data.file_code,
        content: this.data.noteContent
      }).then((res) => {
        wx.navigateBack({
          delta: 1
        })
      }).catch((error) => {

      })
    }
  },

  //删除记事本
  delNote: function () {
    app.post('/userNote/del', {
      ids: this.data.id
    }).then((res) => {
      wx.navigateBack({
        delta: 1
      })
    }).catch((error) => {

    })
  },

  // 上传图片 视频方法-------------------------------------------

  // 用来显示一个选择图片和拍照的弹窗
  chooseImageTap: function () {
    uploadfun.upload.chooseImageTap(this)
  },

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

  // 删除图片
  deleteImage: function (e) {
    uploadfun.upload.deleteImage(e, this)
  },

  // ---------------------------------------------------------

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})