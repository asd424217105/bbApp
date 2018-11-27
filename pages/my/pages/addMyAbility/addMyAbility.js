// pages/my/pages/addMyAbility/addMyAbility.js
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
    WORK_KIND: ''
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
    let { workYear, content } = e.detail.value;
    console.log(workYear)
    var that = this;
    if (that.data.id > 0) {
      app.post('/userAbility/update', {
        workYear: workYear,
        workKindId: parseInt(this.data.WORK_KIND.id),
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
      app.post('/userAbility/addAbility', {
        workYear: workYear,
        workKindId: parseInt(this.data.WORK_KIND.id),
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
    var that = this;
    // 生成file_code编号
    uploadfun.upload.fileCode(that)

    app.getTheme(that)
    that.setData({
      ptext: '请输入简介！'
    })
    console.log('进入工种！')
    app.post('/sysworkkind/list',{}).then((res) => {
      console.log('获取工种成功！')
      console.log(res)
      that.setData({
        WORK_KINDArray: res.data,
      })
      if (that.data.id > 0) {
        app.post('/userAbility/get', {
          id: that.data.id
        }).then((res) => {
          console.log(res)
          console.log(that.data.WORK_KINDArray)
          console.log(res.data.ability.work_kind_id)
          let text = app.getWorkKindArrayText(that.data.WORK_KINDArray, res.data.ability.work_kind_id);
          that.setData({
            content: res.data.ability.content,
            workYear: res.data.ability.work_year,
            WORK_KIND: { id: res.data.ability.work_kind_id, kind_name: text },
            swork_kind: res.data.ability.work_kind_id-4//暂时减去4，更新数据时改回
          })
          console.log(that.data)
        }).catch((error) => {

        })
      }
    }).catch((error) => {

    })
    console.log(that.data)

    if (options.id) {
      that.setData({
        id: options.id
      })
    }
    if (options.userid) {
      that.setData({
        userid: options.userid
      })
    }
    console.log(that.data.id)
    
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