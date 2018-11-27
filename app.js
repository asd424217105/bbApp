//app.js
var AES = require('/utils/commonAes.js');
var sha1 = require('/utils/sha1.js');
App({
  onLaunch: function (path) {
    console.log(path)
    //获取网络类型
    wx.getNetworkType({
      success: res => {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        this.globalData.networkType = res.networkType
        if (res.networkType == 'none'){
          this.globalData.isConnected = false
        }   
        // console.log(this.globalData.networkType);
      }
    })

    //监听设备网络状态
    wx.onNetworkStatusChange(res => {
      console.log(res.isConnected)
      console.log(res.networkType)
      this.globalData.networkType = res.networkType
      this.globalData.isConnected = res.isConnected
    })

    //微信登录
    wx.login({
      success: resCode => {
        console.log('----微信登录----')
        console.log(resCode)
        var that = this;
        //微信登录根据code后台换取openid
        that.purePost('/common/wx/getOpenId', { code: resCode.code}).then((data) => {
          console.log(data)
          console.log('openid:' + data.data.openid)
          wx.setStorageSync('openid', data.data.openid);
          that.globalData.openid = data.data.openid;
          console.log('从本地储存获取登录者信息');
          that.purePost('/common/wx/getWebToken', { clientid: 'wxapp', clientsecret: 'wxapp1234' }).then((res) => {
            console.log(res)
            that.globalData.token = res.data.token
            wx.getStorage({
              key: 'userInfo',
              success: str => {
                console.log(str.data);
                that.globalData.userInfo = str.data;
                console.log('有userinfo,重新获取登录者信息用于更新');
                if (str.data != null && str.data.id > 0) {
                  //重新获取用户信息
                  that.post('/home/userInfo', {}).then((res) => {
                    console.log(res)
                    if (res.code == 0) {
                      console.log('更新globalData和本地储存的userinfo');
                      that.globalData.userInfo = res.data;
                      wx.setStorageSync('userInfo', res.data);
                      
                      if (res.data.user_type != 4) {
                        //进入平台首页
                        wx.switchTab({
                          url: '/pages/index/index'
                        })
                      } else {
                        that.post('/corpMerchants/getMerchants', { id: res.data.merchantsId }).then((res) => {
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
                              icon:'none',
                              title: '帐号已被禁用，如有疑问请联系管理员！',
                              success:function(){
                                wx.reLaunch({
                                  url: '/pages/system/pages/login/login',
                                })
                              }
                            })
                            
                          } else {
                            console.log('审核状态错误！')
                          }
                        }).catch((error) => {

                        })
                      }

                    } else {
                      //平台登录
                      wx.redirectTo({
                        url: '/pages/system/pages/login/login'
                      });
                    }
                  }).catch((error) => {
                    console.log(error)
                  })
                } else {
                  //先根据openid读取用户的信息
                  console.log('获取的OPENID：')
                  console.log({ openid: this.globalData.openid })
                  this.purePost('/common/wx/userInfo', { openid: this.globalData.openid }).then((res) => {
                    console.log(res)
                    if (res.code == 0) {
                      wx.setStorageSync('userInfo', res.data);
                      that.globalData.userInfo = res.data;
                      //进入平台首页
                      wx.switchTab({
                        url: '/pages/index/index'
                      });
                    } else {
                      //返回平台登录页
                      wx.redirectTo({
                        url: '/pages/system/pages/login/login'
                      });
                    }
                  }).catch((error) => {
                    console.log(125)
                  })
                }
              },
              fail: error => {
                console.log('没有userinfo,返回登录页')
                if (path.path == 'pages/my/pages/jumpPage/jumpPage' || that.globalData.recommCode) {
                  
                } else {
                  wx.redirectTo({
                    url: '/pages/system/pages/login/login'
                  });
                }
                
              }
            });
          }).catch((error) => {})
          
        }).catch((error) => {
          // console.log(995)
        })
      }
    })

  
    
  },

  onShow: function () {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log('发现新版本！')
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: false,//不强制更新时显示取消按钮
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      console.log('下载新版本失败！')
    })
  },

  //获取token方法
  getToken: (e) => {
    //判断token，如果没有就调取后台获取
    var that = e;
    console.log('intoken')
    console.log('---重新获取token----')
    console.log(that)
    that.purePost('/common/wx/getWebToken', { clientid: 'wxapp', clientsecret: 'wxapp1234'}).then((res) => {
      console.log(res)
      that.globalData.token = res.data.token
    }).catch((error) => {

    })
  },

  //根据code匹配文字
  requestText: (code) => {
    var text = '';
    if(code==200){
      text='请求成功!'
    }else if(code==500){
      text='请求失败500!'
    }else if(code==404){
      text='请求失踪了404!'
    }else{
      text='请求失败!'
    }
    return text;
  },

  //公共请求方法
  post: (url, data) => {
    var promise = new Promise((resolve, reject) => {
      
      var that = getApp();
      var postData = data;

      //向data添加token
      postData.token = that.globalData.token;
     
      if (postData.opid == '' || postData.opid == null){
        //向data添加openid
        if (that.globalData.userInfo) {
          postData.opid = that.globalData.userInfo.id;
        } else {
          postData.opid = 0
        }
      }

      // Loading加载中..
      wx.showLoading({
        title: '请稍后..',
      })

      // 判断网络状态
      console.log(that.globalData.networkType)
      if (that.globalData.networkType == 'none') {
        reject('当前无网络连接')
        wx.hideLoading()
        wx.showToast({
          title: '当前无网络连接',
          icon: 'none',
          duration: 1000
        })
        return false;
      }

      // 请求接口
      console.log('post:' +that.globalData.hostUrl + url)      
      console.log(postData)
      AES.getAES(JSON.stringify(postData));
      wx.request({
        url: that.globalData.hostUrl + url,
        data: postData,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        method: 'post',
        success: res => {
          //Loading状态消失
          wx.hideLoading();
          console.log('success')
          console.log(res)
          if(res.statusCode == 200){
            if (res.data.code == 0) {
              // wx.showToast({
              //   title: res.data.message,
              //   icon: 'none',
              //   duration: 1000
              // })
              resolve(res.data)
            } else if (res.data.code == -1) {//token失效
              console.log('token失效')
              // 重新连接...
              wx.showToast({
                title: '登录状态已失效,正在重连...',
                icon: 'none',
                duration: 3000
              })
              that.getToken(that)//重新获取token
              setTimeout(() => {//2秒后重连
                console.log('重连2')
                
                console.log(url)
                that.post(url, data).then(() => {
                  
                }).catch(() => {

                })
              },2000)   
            } else {
              wx.showToast({
                title: res.data.message+'或存在未填项',  //标题
                icon: 'none',  
                duration: 2000
              })
            }
          }else{
            if (res.statusCode==401){
              // 重新连接...
              wx.showToast({
                title: '未认证，没能获取登录状态/登录状态失效,正在重连...',
                icon: 'none',
                duration: 3000
              })
              console.log('未认证，没能获取token/token失效')
              that.getToken(that);
              setTimeout(() => {//2秒后重连
                console.log('重连')
                // 重新获取登陆者信息
                that.post('/home/userInfo', {}).then((res) => {
                  console.log(res)
                  console.log('更新globalData和本地储存的userinfo');
                  if (res.code == 0) {
                    that.globalData.userInfo = res.data;
                    wx.setStorageSync('userInfo', res.data);
                    console.log(that.globalData.userInfo)
                    if (url != '/home/userInfo'){
                      // 重新加载失效接口
                      that.post(url, data).then((res) => {
                        resolve(res)
                      }).catch(() => {})
                    }
                  } else {
                    //平台登录
                    wx.redirectTo({
                      url: '/pages/system/pages/login/login'
                    });
                  }
                }).catch(() => {

                })
              }, 2000)
            }else{
              wx.showToast({
                title: that.requestText(res.statusCode),
                icon: 'none',
                duration: 2000
              })
            }
          }
          
        },
        fail: error => {
          //Loading状态消失
          wx.hideLoading()
          console.log('fail')
          console.log(error)
          reject(error.errMsg.toString());
          wx.showToast({
            title: error.errMsg.toString(),
            icon: 'none',
            duration: 2000
          })
        }
      })
    })
    return promise;
  },

  //公共请求方法，不加密，不带token
  purePost: (url, data) => {
    var promise = new Promise((resolve, reject) => {

      var that = getApp();
      var postData = data;

      // Loading加载中..
      wx.showLoading({
        title: '请稍后',
      })

      // 判断网络状态
      console.log(that.globalData.networkType)
      if (that.globalData.networkType == 'none') {
        reject('当前无网络连接')
        wx.hideLoading()
        wx.showToast({
          title: '当前无网络连接',
          icon: 'none',
          duration: 1000
        })
        return false;
      }

      // 请求接口
      console.log('purePost:' +that.globalData.hostUrl + url)
      console.log(postData)
      wx.request({
        url: that.globalData.hostUrl + url,
        data: postData,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        method: 'post',
        success: res => {
          wx.hideLoading();   
          console.log('success')
          console.log(res)
          if (res.statusCode == 200) {
            if (res.data.code == 0) {
              resolve(res.data)
            } else if (res.data.code == -1) {//token失效
              // 重新连接...
              wx.showToast({
                title: '登录状态已失效,正在重连...',
                icon: 'none',
                duration: 3000
              })
              that.getToken(that)//重新获取token
              setTimeout(() => {//2秒后重连
                that.post(url, data).then(() => {

                }).catch(() => {

                })
              }, 2000)
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })
              resolve(res.data)
            }
          }else {
            wx.showToast({
              title: that.requestText(res.statusCode),
              icon:'none',
              duration: 2000
            })
          }
          
        },
        fail: error => {
          wx.hideLoading();
          console.log('fail')
          console.log(error)
          reject(error.errMsg.toString());
          wx.showToast({
            title: error.errMsg.toString(),
            icon: 'none',
            duration: 2000
          })
        }
      })
    })
    return promise;
  },

  //验证手机号
  checkPhoneNum: function (phoneNumber) {
    let reg = /^((13[0-9]|14[1,4,5,6,7,8,9]|15[0,1,2,3,5,6,7,8,9]|16[6]|17[0,1,3,5,6,7,8]|18[0-9]|19[8-9]){1}\d{8})$/;
    if (reg.test(phoneNumber)) {
      return true
    } else {
      wx.showToast({
        title: '请出入正确的手机号码！',
        icon: 'none',
        duration: 1000
      })
      return false
    }
  },
  //验证邮箱
  checkEmail: function (email) {
    let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (str.test(email)) {
      return true
    } else {
      wx.showToast({
        title: '请填写正确的邮箱号',
        image: './../../../../images/fail.png'
      })
      return false
    }
  },

  //单选下拉框 type:要往data里填充的value名
  selectionBox: function (e, type, that) {
    var typeArr = type+'Array';
    that.setData({
      [type]: that.data[typeArr][e.detail.value]
    })
  },

  // 获取字典  typeName：字典名称  typeArray：要往data里填充的value名
  getSysCode: function (typeName, typeArray, that) {
    var thats = getApp();
    thats.purePost('/common/sysParam/getSysCode', {}
    ).then((res) => {
      var array = [];
      var arr = res.data;
      // 循环传来的字典数组
      for (var y in typeName){
        array[y] = [];
        // 循环匹配字典类型
        for (var i in arr) {
          if (arr[i].list == typeName[y]) {
            array[y].push(arr[i])
          }
        }
      }
      for (var z in array){
        that.setData({
          [typeArray[z]]: array[z]
        })
      }
    }).catch((error) => { })
  },

  //获取对应参数字典
  getCodeArray: (codeArray, key) => {
    let array = [];
    for (var i = 0; i < codeArray.length; i++) {
      if (codeArray[i].list == key) {
        array.push(codeArray[i])
      }
    }
    return array;
  },
  //获取对应参数字典text
  getCodeArrayText: (codeArray, key, code) => {
    let text = '';
    for (var i = 0; i < codeArray.length; i++) {
      if (codeArray[i].list == key && codeArray[i].code == code) {
        text = codeArray[i].text
      }
    }
    return text;
  },
  //获取某个对应参数字典text
  getOneCodeArrayText: (codeArray, code) => {
    let text = '';
    for (var i = 0; i < codeArray.length; i++) {
      if (codeArray[i].code == code) {
        text = codeArray[i].text
      }
    }
    return text;
  },
  //获取工种对应text
  getWorkKindArrayText: (codeArray, id) => {
    let text = '';
    for (var i = 0; i < codeArray.length; i++) {
      if (codeArray[i].id == id) {
        text = codeArray[i].kind_name
      }
    }
    return text;
  },
  //获取主题
  getTheme: function (that) {
    wx.getStorage({
      key: 'userTheme',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          theme: res.data,
          showDialog: false
        })
        // console.log('zheshi:' + res.data == 'yellow' ? '#FE3F44' : res.data == 'red' ? '#FEBA01' : res.data == 'blue' ? '#169CD9' : '')
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: res.data == 'yellow' ? '#FEBA01' : res.data == 'red' ? '#FE3F44' : res.data == 'blue' ? '#169CD9' : ''
        })
      },
    })
  },
  //获取身份
  getUserType: function (that, callback) {
    wx.getStorage({
      key: 'userType',
      success: function (res) {
        console.log(res.data)
        that.setData({
          usertype: res.data,
        })
        callback(res.data)
      },
    })
  },
  globalData: {
    networkType: '',
    isConnected: true,
    // hostUrl: 'https://www.testbbgj.com/bbgjapp',
    hostUrl: 'http://192.168.0.200:8082/bbgjapp',
    token: "",
    openid: ''
  }
})