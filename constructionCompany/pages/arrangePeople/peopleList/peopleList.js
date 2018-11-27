// pages/ConstructionCompany/pages/arrangePeople/peopleList/peopleList.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    stationId: '',  // 岗位id
    projectId: '',  // 项目id
    merchantsId: '', // 建设公司id
    items: [
      { name: 'all', value: '全选' },
    ],
    list: [],
    listValue: []
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    var that = this;
    app.getTheme(that);
    var projectId = options.id;
    var stationId = options.stationId;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          merchantsId: res.data.merchantsId,
          stationId: stationId,
          projectId: projectId,
          list: []
        })
        that.getPeopleList();
      },
    })   
  },

  // 获取指派人员列表
  getPeopleList: function () {
    var that = this;
    var projectId = this.data.projectId;
    var merchantsId = this.data.merchantsId;
    var stationId = this.data.stationId;
    // 获取指派人员列表
    app.post('/project/stafflist',
      {
        projectId: projectId,
        merchantsId: merchantsId,
        stationId: stationId
      }).then((res) => {
        that.setData({
          list: res.data
        })
      }).catch((error) => { })
  },


  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      list: []
    })
    this.getPeopleList();
    wx.stopPullDownRefresh();
  },

  // 全选框
  checkboxAll: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var list = this.data.list;
    var listValue = [];
    if (e.detail.value[0] == 'all') {
      for (var i in list) {
        list[i].checked = 1;
        listValue.push(list[i].id)
      }
      this.setData({
        list: list,
        listValue: listValue
      })
    }
    if (e.detail.value.length == '0') {
      for (var i in list) {
        list[i].checked = 0;
      }
      this.setData({
        list: list,
        listValue: []
      })
    }
    console.log(this.data.listValue)
  },

  // 多选框
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      listValue: e.detail.value
    })
    console.log(this.data.listValue)
  },

  // 确定
  toOk: function () {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var projectId = this.data.projectId;
    var stationId = this.data.stationId;
    var listValue = this.data.listValue;
    listValue = listValue.join(',');
    app.post('/project/staff',
      {
        projectId: projectId,
        stationId: stationId,
        userIds: listValue
      }).then((res) => {
        console.log(res)
        // 返回上一页要刷新
        prevPage.setData({
          refresh: true
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 800)
      }).catch((error) => { })
  }

})