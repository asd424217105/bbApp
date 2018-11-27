// pages/my/pages/realNameAuthentication/realNameAuthentication.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    positiveImg: '',
    positiveImgShow: true,
    backImg: '',
    backImgShow: true
  },
  idCardChooseWxImage: function (e) {
    var idCardType = e.target.dataset.type
    uploadfun.upload.idCardChooseWxImage(this, idCardType)
  },
  previewImage: function (e) {
    uploadfun.upload.previewIdCardImage(e, this)
  },
  deleteImage: function (e) {
    uploadfun.upload.deleteIdCardImage(e,this)
  },
  /*提交实名认证*/
  subRZ: function (e) {
    let { realName, idCard } = e.detail.value;
    if ( !realName || !idCard ) {
      wx.showToast({
        title: '姓名和身份证号不能为空！',
        icon: 'none'
      })
      return;
    }
    app.post('/user/authentication',{
      realName: realName,
      idCard: idCard,
      cardForceImg: this.data.positiveImg,
      cardBackImg: this.data.backImg
    }).then((res) => {
      wx.showToast({
        title: '认证成功',
      })
      app.post('/home/userInfo', {}).then((res) => {
        console.log(res)
        console.log('修改成功更新globalData和本地储存的userinfo');
        wx.setStorageSync('userInfo', res.data);
        app.globalData.userInfo = res.data;
        wx.navigateBack({
          delta: 1
        })
      }).catch((error) => {
        console.log('更新globalData和本地储存的userinfo失败');
      })
      
    }).catch((error) => {
      console.log('提交认证出错！')
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getTheme(that)
    // 生成file_code编号
    uploadfun.upload.fileCode(this)
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