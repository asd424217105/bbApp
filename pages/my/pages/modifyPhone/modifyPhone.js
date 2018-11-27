// pages/my/pages/modifyPhone/modifyPhone.js
var app = getApp();
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    authCode: '',
    disabled: false,
    time: '获取验证码',
    currentTime: 121
    // disabled2: false,
    // time2: '获取验证码',
    // currentTime2: 121
  },
  //电话输入绑定
  phoneInput: function (e) {
    let value = e.detail.value;
    if (value.length === 11) {
      let ifPass = app.checkPhoneNum(value);
      if (ifPass) {
        this.setData({
          mobile: value,
          disabled: false
        })
      }
    } else if (value.length > 11) {
      wx.showToast({
        title: '请输入正确的手机号位数！',
        icon: 'none',
        duration: 1000
      })
    }
  },
  // //新电话输入绑定
  // newPhoneInput: function (e) {
  //   let value = e.detail.value;
  //   if (value.length === 11) {
  //     let ifPass = app.checkPhoneNum(value);
  //     if (ifPass) {
  //       if (value == this.data.phone) {
  //         wx.showToast({
  //           title: '新手机号不能和旧手机号相同！',
  //           icon: 'none',
  //           duration: 1000
  //         })
  //         this.setData({
  //           newPhone: value,
  //           disabled: true
  //         })
  //       } else {
  //         this.setData({
  //           newPhone: value,
  //           disabled: false
  //         })
  //       }
  //     }
      
  //   } else if (value.length > 11) {
  //     wx.showToast({
  //       title: '请输入正确的手机号位数！',
  //       icon: 'none',
  //       duration: 1000
  //     })
  //   }
  // },
  //验证码输入绑定
  codeInput: function (e) {

  },
  //新手机验证码输入绑定
  newCodeInput: function (e) {

  },
  getCode: function (e) {
    var that = this;
    if (that.data.mobile) {
      console.log(that.data.mobile)
      if (that.data.mobile.length < 11) {
        wx.showToast({
          title: '请输入正确的手机号！',
          icon: 'none',
          duration: 1000
        })
      } else {
        var currentTime = that.data.currentTime;
        console.log('获取验证码！')
        that.setData({
          disabled: true
        })
        app.purePost('/user/getCode', { phone: this.data.mobile, templateCode: 0 }).then((res) => {
          console.log('获取验证码成功！')
          console.log(res)
          wx.showToast({
            title: '验证码已发送至手机！',//获取验证码成功
            icon: 'none',
            duration: 1000
          })
          interval = setInterval(function () {
            currentTime--;
            that.setData({
              time: currentTime + '秒后重发'
            })
            if (currentTime <= 0) {
              clearInterval(interval)
              that.setData({
                time: '重新发送',
                currentTime: 121,
                disabled: false
              })
            }
          }, 1000)
        }).catch((error) => {
          console.log('获取验证码失败！')
          wx.showToast({
            title: '获取验证码失败！',//获取验证码成功
            icon: 'none',
            duration: 1000
          })
          that.setData({
            time: '重新发送',
            currentTime: 121,
            disabled: false
          })
        })
      }
    } else {
      wx.showToast({
        title: '请输入正确的手机号！',
        icon: 'none',
        duration: 1000
      })
    }
  },
  
  /*退出登录*/
  loginOut: function () {
    app.post('/home/loginOut', {}).then((res) => {
      wx.reLaunch({
        url: '../../../system/pages/login/login',
      })
      wx.removeStorageSync('userInfo');
      wx.removeStorageSync('userTheme');
      wx.removeStorageSync('selectDate');
      wx.removeStorageSync('userType');
    }).catch((error) => {

    })
  },

  //表单提交
  formSubmit: function (e) {
    var that = this;
    // console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let { mobile, authCode } = e.detail.value;
    if (!mobile || !authCode) {
      that.setData({
        warn: "表单项不能为空！"
      })
      wx.showToast({
        title: '表单项不能为空！',
        icon: 'none'
      })
      return;
    }
    that.setData({
      mobile,
      authCode
    })

    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: (res) => {
              console.log(res.userInfo)
              that.setData({
                headImg: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName
              })

            },
            complete: (c) => {
              app.post('/user/editMobile', {
                mobile: that.data.mobile,
                authCode: that.data.authCode
              }).then((res) => {
                wx.showModal({
                  title: '提示',
                  content: '修改手机号成功，请重新登录！',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      that.loginOut()
                    }
                  },
                })
              }).catch((error) => {

              })
            }
          })
        }
      }
    })
  },
  //表单重置
  formReset: function () {
    console.log('form发生了reset事件')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getTheme(that)
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