// pages/ConstructionCompany/pages/CheckReceivePeople/CheckReceivePeople.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    id: '',  // 目标id
    mercId: '',
    list: []
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id,
    })
    var that = this;
    app.getTheme(that);
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          mercId: res.data.merchantsId
        })
        that.getProjectUserlist2();
      },
    })

  },

  // 获取项目人员
  getProjectUserlist2: function () {
    var that = this;
    var id = this.data.id;
    var mercId = this.data.mercId;
    // 获取项目人员
    app.post('/project/deptMem',
      {
        mercId: mercId,
        projectId: id
      }).then((res) => {
        var reslist = res.data;
        that.setData({
          list: reslist
        })
      }).catch((error) => {

      })
  },


  // 查看考勤
  toAtt: function (e) {
    var that = this;
    var id = this.data.id;
    var userId = e.currentTarget.dataset.id;    
    wx.navigateTo({
      url: 'attDetails/attDetails?id=' + id + '&userId=' + userId +'',
    })
  }

})