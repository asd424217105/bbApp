// pages/ConstructionCompany/pages/reviseStation/reviseStation.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    editValue: '',
    merchantsId: '',
    showModal: false,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    app.getTheme(that);
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        if (res.data.merchantsId) {
          var merchantsId = res.data.merchantsId;
          that.setData({
            merchantsId: merchantsId
          })
          // 获取岗位列表
          app.post('/mercstation/list',
            {
              id: merchantsId,
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

  // 新增部门输入框
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 新增部门
  addStation: function () {
    var that = this;
    var value = this.data.inputValue;
    var merchantsId = this.data.merchantsId;
    app.post('/mercstation/add',
      {
        merchantsId: merchantsId,
        stationName: value,
      }).then((res) => {
        that.onLoad();
      }).catch((error) => { })
  },

  // 编辑岗位
  editStation: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    this.setData({
      showModal: true
    })
    // 获取某岗位信息
    app.post('/mercstation/get',
      {
        id: id
      }).then((res) => {
        that.setData({
          editValue: res.data
        })
      }).catch((error) => { })
  },

  // 删除岗位
  delStation: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          // 删除岗位接口
          app.post('/mercstation/del',
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

  // 弹窗数据提交
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var data = e.detail.value;
    // 编辑岗位接口
    app.post('/mercstation/edit', data
    ).then((res) => {
      console.log(res)
      that.hideModal();
      that.onLoad();
    }).catch((error) => { })

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