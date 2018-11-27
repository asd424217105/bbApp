var app = getApp()
var sha1 = require('../../../../utils/sha1.js');
var interval = null //倒计时函数
Page({
  data:{
    mobile: '',
    code: '',
    pass: '',
    warn: '',
    disabled: false,
    time: '获取验证码',
    currentTime: 121
  },
  phoneInput: function (e) {
    let value = e.detail.value;
    if(value.length === 11){
      let ifPass = app.checkPhoneNum(value);
      if (ifPass) {
        this.setData({
          mobile: value
        })
      }
    } else if (value.length>11) {
      wx.showToast({
        title: '请输入正确的手机号位数！',
        icon: 'none',
        duration: 1000
      })
    }
  },
  codeInput: function (e) {
    
  },
  passInput: function (e) {

  },
  formSubmit: function (e) {
    var that = this;
    let { phone, code, pass } = e.detail.value;
    if (!phone || !code || !pass) {
      this.setData({
        warn: '表单不能为空'
      })
      wx.showToast({
        title: '表单不能为空！',
        icon: 'none',
        duration: 1000
      })
    } else {
      app.post('/home/editPwd', { mobile: phone, pwd: sha1.hex_sha1(pass), authCode: code}).then((res)=> {
        wx.showModal({
          title: '提示',
          content: '密码修改成功，请您重新登录！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              that.loginOut()
            }
          },
        })
      }).catch(()=> {

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

  }
})