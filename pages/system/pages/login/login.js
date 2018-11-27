// pages/system/login/login.js
var utils = require('../../../../utils/util.js');
var sha1 = require('../../../../utils/sha1.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password: '',
    agentId: 0,
    openId: ''

  },
  phoneInput: function(e){
    this.setData({
      phone: e.detail.value
    });
  },
  passInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },
  //登录方法
  login: function(e) {
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '用户名密码不能为空',
        icon: 'none',
        duration: 1000
      })
    } else {
      var headImg = '';
      var nickName = '';
      var that = this;
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: (res) => {
                console.log(res.userInfo)
                headImg = res.userInfo.avatarUrl;
                nickName = res.userInfo.nickName;
              },
              complete: (c) => {
                // 登录获取token
                app.purePost('/common/wx/getWebToken', { clientid: 'wxapp', clientsecret: 'wxapp1234' }).then((res) => {
                  app.globalData.token = res.data.token;
                  app.purePost('/home/login',
                    {
                      mobile: that.data.phone,
                      pwd: sha1.hex_sha1(that.data.password),
                      headImg: headImg,
                      nickName: nickName,
                      openid: that.data.openId,
                      token: res.data.token
                    }).then((res) => {
                      console.log(285)
                      console.log(res);
                      app.post('/home/userInfo', { opid: res.data.id }).then((data) => {
                        console.log('获取用户信息成功')
                        console.log(data)
                        wx.setStorageSync('userInfo', data.data)
                        app.globalData.userInfo = data.data
                        console.log(res.data.userType)
                        wx.setStorageSync('userType', res.data.userType)
                        wx.getStorage({
                          key: 'userType',
                          success: function (res) {
                            console.log(res);
                          },
                        })
                        if (res.data.userType != 4) {
                          wx.switchTab({
                            url: '/pages/index/index'
                          })
                        } else {
                          if (res.data.merchantsId) {
                            app.post('/corpMerchants/getMerchants', { id: res.data.merchantsId }).then((res) => {
                              console.log("获取建筑公司信息成功！")
                              if (res.data.corp_state == 0 || res.data.corp_state == 2) {
                                wx.reLaunch({
                                  url: '/pages/my/pages/companyAuthentication/companyAuthentication?agentId=' + res.data.id + '&corp_state=' + res.data.corp_state,
                                })
                              } else if (res.data.corp_state == 1) {
                                wx.switchTab({
                                  url: '/pages/index/index'
                                })
                              } else if (res.data.corp_state == 3) {
                                wx.showToast({
                                  title: '帐号已被禁用，如有疑问请联系管理员！',
                                })
                              } else {
                                console.log('审核状态错误！')
                              }
                            }).catch((error) => {

                            })
                          } else {
                            wx.reLaunch({
                              url: '/pages/my/pages/companyAuthentication/companyAuthentication?agentId=' + res.data.id + '&corp_state=' + res.data.corp_state,
                            })
                          }
                        }
                      }).catch((error) => { })

                    }).catch(() => {})
                }).catch((error) => {

                })
                
              }
            })
          }
        }
      })
      
    }
    
  },
  //注册方法
  register: (e) => {
    wx.navigateTo({
      url: '/pages/system/pages/register/register'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.openid) {
      console.log('全局OP获取')
      that.setData({
        openId: app.globalData.openid
      })
      console.log('openid:' + app.globalData.openid)
    } else {
      console.log('本地OP获取')
      wx.getStorage({
        key: 'openid',
        success: function (res) {
          that.setData({
            openId: res.data
          })
          if (res.data) {
            console.log('openid:' + res.data)
          } else {
            console.log('本地获取失败，重新获取openid！')
            //微信登录
            wx.login({
              success: resCode => {
                console.log('----微信登录----')
                console.log(resCode)
                //微信登录根据code后台换取openid
                app.purePost('/common/wx/getOpenId', { code: resCode.code }).then((data) => {
                  console.log(data)
                  that.setData({
                    openId: data.data.openid
                  })
                  console.log('openid:' + data.data.openid)
                  wx.setStorageSync('openid', data.data.openid);
                  app.globalData.openid = data.data.openid;
                  console.log('从本地储存获取登录者信息');
                }).catch((error) => {

                })
              }
            })
          }
        },
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