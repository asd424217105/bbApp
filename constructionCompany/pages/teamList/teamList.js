// pages/index/pages/teamList/teamList.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getTheme(that);
    var id = options.id;
    this.setData({
      id: id,
      curpage: 1,
      list: []
    })
    this.getTeamList();
  },

  // 获取项目进行中的参加工作的班组列表信息
  getTeamList:function(){
    var that = this;
    var id = this.data.id;
    // 获取项目进行中的参加工作的班组列表信息
    app.post('/project/corpWorkingList',
      {
        projectId: id
      }).then((res) => {
        console.log(res)
        that.setData({
          list: res.data
        }) 
      }).catch((error) => { })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      curpage: 1,
      list: []
    })
    this.getTeamList();
    wx.stopPullDownRefresh();
  },

  // 跳转 -- 日报
  toDaily:function(e){
    var id = this.data.id;
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: 'Daily/Daily?id=' + id + '&taskId=' + item.taskId + '&userId=' + item.userId +'',
    })
  },
  // 跳转 -- 考勤
  toAtt: function (e) {
    var id = this.data.id;
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: 'userAtt/userAtt?userId=' + item.userId + '&taskId=' + item.taskId + '&id=' + id +'',
    })
  },
  // 跳转 -- 合同
  toContract: function (e) {
    var id = this.data.id;
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: 'heTong/heTong?userId=' + item.userId + '&taskId=' + item.taskId + '&id=' + id +'',
    })
  },
  // 跳转 -- 评价
  toEvaluate: function (e) {
    var id = this.data.id;
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: 'evaluate/evaluate?userId=' + item.userId + '&taskId=' + item.taskId + '&id=' + id +'',
    })
  },
  // 跳转 -- 班组详情
  teamListDetail: function (e) {
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: 'teamListDetail/teamListDetail?userId=' + item.userId + '',
    })
  }
  
})