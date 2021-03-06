// pages/my/pages/jumpPage/jumpPage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    theme: 'yellow'
  },

  addUs: function () {
    var that = this;

    let openid = '';
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        console.log('获取OPENID成功')
        console.log(res)
        openid = res.data
        that.setData({
          openid: openid
        })

        // let openId = that.data.openid;
        let recommCode = app.globalData.recommCode;
        console.log('recommCode')
        console.log(recommCode)
        app.post('/user/handleUser', { openid: openid, recommCode: recommCode }).then((res) => {
          console.log('res')
          console.log(res)
          if (res.data.code == -31) {//人员不存在
            wx.reLaunch({
              url: '/pages/system/pages/register/register?id=' + res.data.userId + '&code=' + recommCode + '&type=' + res.data.userType,
            })
          } else if (res.data.code == -15) {//未被分配项目
            wx.showModal({
              title: '提示',
              content: '您已经拥有帐号，但还未被公司分配项目角色！',
              success: function (res) {
                if (res.cancel) {
                  
                }
                if (res.confirm) {
                  wx.reLaunch({
                    url: 'pages/system/pages/login/login',
                  })
                }
              },
            })
          } else if (res.data.code == -32 || res.data.code == -33 || res.data.code == -34 || res.data.code == -35 || res.data.code == -36 || res.data.code == -37 || res.data.code == -38 || res.data.code == -39 || res.data.code == -40 || res.data.code == -41) {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
              success: function (es) {
                if (es.confirm) {
                  console.log('点击了确定！！！')
                  wx.getStorage({
                    key: 'userInfo',
                    success: function (es1) {
                      wx.reLaunch({
                        url: '/pages/index/index',
                      })
                    },
                    fail: function (e) {
                      console.log('没有获取到本地信息！！！！即将自动获取')
                      app.post('/home/userInfo', { opid: res.data.subUserId }).then((data) => {
                        console.log('获取用户信息成功')
                        console.log(data)
                        wx.setStorageSync('userInfo', data.data)
                        app.globalData.userInfo = data.data
                        console.log(res.data.subUserType)
                        wx.setStorageSync('userType', res.data.subUserType)
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
                          if (res.data.subMerchantsId) {
                            app.post('/corpMerchants/getMerchants', { id: res.data.subMerchantsId }).then((res) => {
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
                    },
                  })

                }
              },
            })
          } else {

          }
        }).catch((error) => {

        })

      },
      fail: function (ers) {
        // wx.showModal({
        //   title: '提示',
        //   content: '获取微信登录信息失败！',
        //   showCancel: false
        // })
        wx.showToast({
          title: '获取微信登录信息失败！',
          icon: 'none',
          duration: 1000
        })
      },
    })
    

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log('打印参数！')
    console.log(options.scene)
    console.log(options.code)
    if (options.scene || options.code) {
      if (options.scene) {
        wx.setStorageSync('recommCode', options.scene)
        app.globalData.recommCode = options.scene;
      }

      if (options.code) {
        wx.setStorageSync('recommCode', options.code)
        app.globalData.recommCode = options.code;
      }
    } else {
      wx.getStorage({
        key: 'recommCode',
        success: function(res) {
          console.log('邀请码！' + res.data)
        },
        fail: function(e) {
          console.log('跳转主页！')
          wx.reLaunch({
            url: '/pages/system/pages/login/login',
          })
        },
      })
      
    }
    // app.getToken(app);
    
    app.getTheme(that)
    var content = "<div><div>公司简介：</div><div>    天诚乐华网络科技有限公司，成立于2018年3月，注册资金300万元，  天诚乐华深耕建筑行业30余年，深谙建筑行业痛点，致力于改造行业乱象。充分利用新时代“互联网+”的模式，推出微信小程序——“班班打工”，将建筑企业、总包方、项目管理人员、施工班组与工人多方连接在一起，实现人员数据化、项目网络化、匹配智能化的筑工管理移动平台。核心是及时匹配招工找活信息，解决劳务用工信息不对称的问题。平台及时记工记账，实时监督，确保工程验收时间。平台代发工资，保证工人权益。旨在打造建筑行业人工管理的新骨架，树立建筑行业基层劳动者的新风尚！</div><br><div>    公司文化：</div><div>    公司目标：打造建筑行业人工管理的新骨架，树立建筑行业基层劳动者的新风尚。</div><div>    公司理念：</div><div>    一是组织严密；</div><div>    二是纪律严厉；</div><div>    三是精神紧张；</div><div>    四是方法彻底；</div><div>    五是行政公开；</div><div>    六是做事调查；</div><div>    七是使命第一</div><div>    八是全员持股于未来挂钩！</div><div>    公司使命：依托“互联网+”模式，改变行业乱像，助力优质企业，提速产业升级，并且打造学习型、技术型、创新型筑工大军。</div><div>    公司愿景：帮助总包、项目经理和班组长规范化管理工程项目，提高工作效率和质量。倡导和激发工人工匠精神及创新精神，通过平台能够促进农民工向技术工转型，提高建筑工人归属感，让天下筑工和家人过上有信心，有尊严的生活。</div><div>    核心价值观：公平公正不坑人，不害人，勤勤恳恳做事，堂堂正正赚钱！</div><div>                                  </div><br><div>                                                                                                                                                                                                                              项目介绍：</div><div>    项目名称：班班打工</div><div>    班：班组，企业管理精细到企业的最小单元。</div><div>    班：鲁班，体现中国工人的工匠精神和创造精神。</div><div>    班班打工：打造建筑行业人工管理的新骨架，树立建筑行业基层劳动者的新风尚。</div><br><div>    项目特点：</div><div>    一、班班打工：核心就是根据信息发布者的需求即时传达到对应方，并可以振铃/提醒!解决找人难和找活难的信息不对称和信息延迟问题。</div><div>    二、班班记工：每日显示打卡时间地点，各方签订劳动合同，按照合同记工计价，各级及时验工对账，工程量、款清晰明了。</div><div>    三、班班培训：智能匹配工人所需培训内容，传授专业知识、安全意识和革新意识。解决农民工业务能力和素质底下的问题。</div><div>    四、班班金融：平台代发农民工工资，解决目资金不及时，和农民工要钱难的问题。</div><br><div>    项目解决的问题：</div><div>    一、总包：及时监督查看工程进度，预防拖欠工资、用人不当的问题，有效的缩短工期，减少管理费用。平台代开工资，减轻资金压力。</div><div>    二、项目经理：能够快速的找到合适优质的班组，有效缩短工期和提高工程质量。及时验工对账，减少工资争议，避免纠纷。</div><div>    三、班组长:快速找到优质工程项目和工人，壮大自己的队伍，强大的用工管理系统，轻松高效的管理工人。平台代发工资，收益有保障。 </div><div>    四、工人：空闲时期可以快速找到活干，增加出勤率，平台免费提供技能培训，可以提高自身专业技能，进而提高自己的收入，最终改善生活质量，生活的更加有信心。</div><br></div>";
    this.setData({
      content
    })
    
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