// pages/foreman/pages/admission/admission.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    targetId: '',
    usertype: '',
    items: [
      { name: 'all', value: '全选' },
    ],
    list: [],
    listValue: [],
    listValue2: []
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    var id = options.id;
    var that = this;
    app.getTheme(that);
    wx.getStorage({
      key: 'userType',
      success: function(res) {
        var usertype = res.data;
        that.setData({
          usertype: usertype,
          targetId: id,
          list: []
        })
        if (usertype == 1){
          that.intoWorkerList();
        }
        if (usertype == 2 || usertype == 3) {
          that.intoLeaderList();
        }
      },
    })
    
  },

  // 确认进场（获取入场人员列表信息）---  班组长端
  intoWorkerList: function () {
    var that = this;
    var targetId = this.data.targetId;
    // 确认进场（获取入场人员列表信息）
    app.post('/callPerson/intoWorkerList',
      {
        callId: targetId,
      }).then((res) => {
        that.setData({
          list: res.data
        })
      }).catch((error) => {

      })
  },

  // 确认进场（获取入场人员列表信息）--- 项目部
  intoLeaderList: function () {
    var that = this;
    var targetId = this.data.targetId;
    // 确认进场（获取入场人员列表信息）
    app.post('/taskPerson/intoLeaderList',
      {
        taskId: targetId,
      }).then((res) => {
        that.setData({
          list: res.data
        })
      }).catch((error) => {

      })
  },



  // 下拉刷新
  onPullDownRefresh: function () {
    var usertype = this.data.usertype;
    this.setData({
      list: []
    })
    if (usertype == 1) {
      this.intoWorkerList();
    }
    if (usertype == 2 || usertype == 3) {
      this.intoLeaderList();
    }
    wx.stopPullDownRefresh();
  },

  // 全选框
  checkboxAll: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var list = this.data.list;
    var listValue = [];
    var listValue2 = [];
    if (e.detail.value[0] == 'all') {
      for (var i in list) {
        list[i].checked = true;
        listValue.push(list[i].id)
        listValue2.push(list[i].userId)
      }
      this.setData({
        list: list,
        listValue: listValue,
        listValue2: listValue2
      })
    }
    if (e.detail.value.length == '0') {
      for (var i in list) {
        list[i].checked = false;
      }
      this.setData({
        list: list,
        listValue: [],
        listValue2: []
      })
    }
    console.log(this.data.listValue)
    console.log(this.data.listValue2)
  },

  // 多选框
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var value = e.detail.value;
    var list = this.data.list;
    var arr = [];
    for (var i in list){
      for (var y in value){
        if (list[i].id == value[y]){
          arr.unshift(list[i].userId)
        }
      }
    }
    this.setData({
      listValue: e.detail.value,
      listValue2: arr
    })
    console.log(this.data.listValue)
    console.log(this.data.listValue2)
  },

  // 确定
  toOk: function () {
    var that = this;
    var usertype = this.data.usertype;
    var targetId = this.data.targetId;
    var listValue = this.data.listValue;
    var listValue2 = this.data.listValue2;
    listValue = listValue.join(',');
    listValue2 = listValue2.join(',');
    // 班组长端
    if (usertype == 1) {
      app.post('/apply/approach',
        {
          callId: targetId,
          inviIds: listValue,
          userIds: listValue2
        }).then((res) => {
          console.log(res)
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 800)
        }).catch((error) => { })
    }
    // 项目部端
    if (usertype == 2 || usertype == 3) {
      app.post('/apply/managerOk',
        {
          taskId: targetId,
          inviIds: listValue,
          userIds: listValue2
        }).then((res) => {
          console.log(res)
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 800)
        }).catch((error) => { })
    }
    
  }

})