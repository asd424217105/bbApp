var app = getApp();
var sha1 = require('../../../../utils/sha1.js');
var interval = null //倒计时函数
Page({
  data: {
    warn: '',
    showDialog: false,
    parentId: '',
    merchantsId: '',
    userType: 0,
    nickName: '',
    realName: '',
    phone: '',
    pass: '',
    headImg: '',
    openid: '',
    code: '',
    userTypeArray: [{ code: 0, text: '工人' }, { code: 4, text: '建筑管理员' }],
    value: 1,
    userTypeText: '',
    codeShow: false,
    recommCode: 0,
    agentId: 0,
    agentType: 0,
    disabled: false,
    time: '获取验证码',
    currentTime: 121
  },
  //电话输入绑定
  phoneInput: function (e) {
    let value = e.detail.value;
    if (value.length === 11) {
      let ifPass = app.checkPhoneNum(value);
      if (ifPass) {
        this.setData({
          mobile: value
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
  //验证码输入绑定
  codeInput: function (e) {

  },
  //密码输入绑定
  passInput: function (e) {
    var that = this;
    that.setData({
      pwd: e.detail.value
    })
  },
  //再次输入密码绑定
  rePassInput: function (e) {
    var that = this;
    let pass = that.data.pwd
    let value = e.detail.value;
    if (!pass) { pass = 0}
    if (value.length >= pass.length){
      if (pass != value) {
        wx.showToast({
          title: '两次输入密码不一致！',
          icon: 'none',
          duration: 1000
        })
      }
    }
  },
  //推荐码输入绑定
  recommCodeInput: function (e) {

  },
  getPhone: function (e) {
    this.setData({
      mobile: e.detail.value
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
    
  },
  getParam: function (e) {
    app.post('/common/sysParam/getSysCode', {}).then((res) => {
      console.log('获取参数字典成功！')
      console.log(res)
      console.log(this.getCodeArray(res.data, 'USER_TYPE'))
      console.log(this.getCodeArrayText(res.data, 'USER_TYPE', '1'))
    }).catch((error) => {

    })
  },
  //表单提交
  formSubmit: function (e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let { realName, phone, pass, code, rePass } = e.detail.value;
    if (!realName || !phone || !pass || !code || !rePass) {
      that.setData({
        warn: "表单项不能为空！"
      })
      wx.showToast({
        title: '表单项不能为空！',
        icon: 'none'
      })
      return;
    }
    if (pass != rePass) {
      wx.showToast({
        title: '两次输入密码不一致！',
        icon: 'none'
      })
    }
    that.setData({
      realName,
      phone,
      pass,
      code
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
              console.log(123)
              app.post('/user/add', {
                recommCode: that.data.recommCode,
                merchantsId: 0,
                userType: that.data.userType,
                nickName: that.data.nickName,
                realName: that.data.realName,
                mobile: that.data.phone,
                pwd: sha1.hex_sha1(that.data.pass),
                headImg: that.data.headImg,
                openid: that.data.openid,
                authCode: that.data.code
              }).then((res) => {
                console.log('注册成功！')
                console.log(res)
                app.globalData.userInfo = res.data;
                wx.setStorageSync('userInfo', res.data)
                wx.setStorageSync('userType', res.data.user_type)
                console.log('修改成功更新globalData和本地储存的userinfo');
                
                if (res.data.user_type != 4) {
                  //进入平台首页
                  console.log('进入首页！')
                  wx.switchTab({
                    url: '/pages/index/index'
                  })
                } else {
                  console.log('进入认证！')
                  wx.reLaunch({
                    url: '/pages/my/pages/companyAuthentication/companyAuthentication?agentId=' + that.data.agentId,
                  })
                }
                
                
              }).catch((error) => {
                wx.showToast({
                  title: error.toString(),
                })
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
  //单选选择事件
  radioChange: function (e) {
    console.log(e)
    this.setData({
      userType: e.detail.value
    })

  },
  onLoad: function (options) {
    // Do some initialize when page load.
    var that = this;
    if (options.id) {
      console.log('options.code')
      console.log(options.code)
      that.setData({
        agentId:options.id,
        codeShow: true,
        recommCode: options.code,
        agentType: options.type
      })
      if (options.type == 0 || options.type == 1) {
        that.setData({
          userType: 0
        })
      }
      
      if (options.type == 2 || options.type == 3 || options.type == 4) {
        that.setData({
          userType: 1
        })
      }
    }
    
    app.purePost('/common/sysParam/getSysCode', {}).then((res) => {
      console.log('获取参数字典成功！')
      console.log(res)
      var array = app.getCodeArray(res.data, 'USER_TYPE');
      var newArray = [];
      for (let i = 0; i < array.length; i++) {
        if (array[i].code == 0 || array[i].code == 4) {
          newArray.push(array[i])
        }
      }
      that.setData({
        userTypeArray: newArray,
        userTypeText: newArray[0].text
      })
    }).catch((error) => {

    })
    this.setData({
      openid: app.globalData.openid
    })
    // wx.getStorage({
    //   key: 'recommCode',
    //   success: function (res) {
    //     that.setData({
    //       codeShow: true,
    //       recommCode: res.data
    //     })
    //   },
    // })
    
  },
  onReady: function () {
    // Do something when page ready.
  },
  onShow: function () {
    // Do something when page show.
  },
  onHide: function () {
    // Do something when page hide.
  },
  onUnload: function () {
    // Do something when page close.
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
  },
  onReachBottom: function () {
    // Do something when page reach bottom.
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  onPageScroll: function () {
    // Do something when page scroll
  },
  // onTabItemTap(item) {
  //   console.log(item.index)
  //   console.log(item.pagePath)
  //   console.log(item.text)
  // },
  // // Event handler.
  // viewTap: function () {
  //   this.setData({
  //     text: 'Set some data for updating view.'
  //   }, function () {
  //     // this is setData callback
  //   })
  // },
  // customData: {
  //   hi: 'MINA'
  // }

})