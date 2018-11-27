// pages/ConstructionCompany/pages/revisePersonnel/revisePersonnel.js
var app = getApp();
var sha1 = require('../../../../../utils/sha1.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    realName: '',
    mobile: '',
    pwd:'',
    showModal: false,
    merchantsId:'',
    depArray: [],
    depValue:'',
    userTypes: [
      { 'id': 3, 'text': '建筑公司普通员工' },
      { 'id': 4, 'text': '建筑公司管理员' }
    ],
    userTypeValue: '',
    list: [],
    userId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    app.getTheme(that)
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        if (res.data.merchantsId){
          var merchantsId = res.data.merchantsId;
          var usertype = res.data.user_type;
          // 加密密码
          var pwd = sha1.hex_sha1('123456');
          that.setData({
            merchantsId: merchantsId,
            usertype: usertype,
            pwd: pwd
          })
          // 如果是项目经理
          if (usertype == 2){
            that.setData({
              userTypes: [
                { 'id': 3, 'text': '建筑公司普通员工' },
              ]
            })
          }
          // 获取部门列表
          app.post('/mercdept/list',
            {
              id: merchantsId,
            }).then((res) => {
              console.log(res)
              that.setData({
                depArray: res.data
              })
            }).catch((error) => { })

          // 获取人员列表
          app.post('/mercuser/list',
            {
              merchantsId: merchantsId,
            }).then((res) => {
              console.log(res)
              that.setData({
                list: res.data
              })
            }).catch((error) => { })
        }
      }
    })
    

  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      list: []
    })
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  // 新增部门
  addDepartment: function () {
    this.setData({
      showModal: true,
      realName: '',
      depValue: '',
      mobile: '',
      userTypeValue: ''
    })
  },

  // 编辑人员
  editPersonnel: function (e) {
    var that = this;
    var userId = e.currentTarget.dataset.id;
    this.setData({
      showModal: true,
      userId: userId
    })
    // 获取某人员信息
    app.post('/mercuser/get',
      {
        id: userId
      }).then((res) => {
        var userTypeValue = {};
        if (res.data.userType == 2) {
          userTypeValue = { 'id': 2, 'text': '项目经理' }
        }
        if (res.data.userType == 3) {
          userTypeValue = { 'id': 3, 'text': '建筑公司普通员工' }
        }
        if (res.data.userType == 4) {
          userTypeValue = { 'id': 4, 'text': '建筑公司管理员' }
        }
        that.setData({
          realName: res.data.realName,
          mobile: res.data.mobile,
          depValue: res.data.depts[0],
          userTypeValue: userTypeValue
        })
      }).catch((error) => { })
  },

  // 删除人员
  delPersonnel: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          // 删除人员接口
          app.post('/mercuser/del',
            {
              id: id
            }).then((res) => {
              that.onLoad();
            }).catch((error) => { })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  // 指派部门选择框
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      depValue: this.data.depArray[e.detail.value]
    })
  },

  // 用户类型选择框
  bindPickerChanges: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var userTypeValue = this.data.userTypeValue;
    if (userTypeValue.id == 2){
      wx.showToast({
        title: '此身份为项目经理，不可修改',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    this.setData({
      userTypeValue: this.data.userTypes[e.detail.value]
    })
  },

  // 弹窗数据提交
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var data = e.detail.value;
    var userId = this.data.userId;
    if (userId == ''){
      data.pwd = this.data.pwd;
      data.merchantsId = this.data.merchantsId;
      // 添加人员接口
      app.post('/mercuser/add', data
      ).then((res) => {
        that.hideModal();
        that.onLoad();
      }).catch((error) => { })
    }else{
      data.userId = userId;
      // 编辑人员接口
      app.post('/mercuser/edit', data
      ).then((res) => {
        console.log(res)
        that.hideModal();
        that.onLoad();
      }).catch((error) => { })
    }

  },

  // 拨打电话
  tophone:function(e){
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
        phoneNumber: phone 
    })
  },

  // --------------模态弹窗-----------
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },

  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });

  },


  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },

  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
  }

})