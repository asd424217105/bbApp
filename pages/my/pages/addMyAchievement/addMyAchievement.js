// pages/my/pages/addMyAchievement/addMyAchievement.js
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
    content: '',
    theme: 'red',
    id: 0,
    ptext: '',
    date1: '2016-09-01',
    date2: '2016-09-01',
    ROLE_TYPE: ''
  },

  // 日期选择
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
  },

  // 单选下拉框
  bindPickerChange: function (e) {
    var types = e.currentTarget.dataset.type;
    app.selectionBox(e, types, this)
    console.log(this.data)
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

  //提交
  submit: function (e) {
    let {projectName,content} = e.detail.value;
    var that = this;
    if (that.data.id > 0) {
      app.post('/userAchievement/update', {
        roleType: parseInt(this.data.ROLE_TYPE.code),
        projectId: 0,
        projectName: projectName,
        beginDate: this.data.date1,
        endDate: this.data.date2,
        content: content,
        id: that.data.id
      }).then((res) => {
        wx.showToast({
          title: '修改成功'
        })
        wx.navigateBack({
          delta: 1
        })
      }).catch((error) => {
        wx.showToast({
          title: '修改失败',
          icon: 'none'
        })
      })
    } else {
      app.post('/userAchievement/addAchievement', {
        file_code: this.data.file_code,
        role_type: parseInt(this.data.ROLE_TYPE.code),
        projectId: 0,
        projectName: projectName,
        beginDate: this.data.date1,
        endDate: this.data.date2,
        content: content
      }).then((res) => {
        wx.showToast({
          title: '添加成功'
        })
        wx.navigateBack({
          delta: 1
        })
      }).catch((error) => {
        wx.showToast({
          title: '添加失败',
          icon: 'none'
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 生成file_code编号
    uploadfun.upload.fileCode(this)

    app.getTheme(this)
    this.setData({
      ptext: '请输入工作内容！'
    })

    app.getSysCode(
      ['ROLE_TYPE_YJ'],
      ['ROLE_TYPEArray'], this);
      console.log(this.data)
    
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
    if (options.userid) {
      this.setData({
        userid: options.userid
      })
    }
    console.log(this.data.id)
    if (this.data.id > 0) {
      app.post('/userAchievement/get', {
        id: this.data.id
      }).then((res) => {
        console.log(res)
        let array = [];
        for (let i = 0; i < res.data.achievement.file_list.length; i++) {
          array.push({
            fileType: res.data.achievement.file_list[i].fileType,
            url: res.data.achievement.file_list[i].newFilename,
            fileId: res.data.achievement.file_list[i].id
          })
        }
        let text = app.getOneCodeArrayText(this.data.ROLE_TYPEArray, res.data.achievement.roleType);
        this.setData({
          imglist: array,
          file_code: res.data.achievement.fileCode,
          content: res.data.achievement.content,
          date1: res.data.achievement.beginDate,
          date2: res.data.achievement.endDate,
          projectName: res.data.achievement.projectName,
          projectId: res.data.achievement.projectId,
          ROLE_TYPE: { code: res.data.achievement.roleType, text: text},
          sRoleType: res.data.achievement.roleType
        })

        console.log(this.data)
      }).catch((error) => {

      })
    }
  },

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