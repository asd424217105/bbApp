// pages/ConstructionCompany/pages/myTask/myTask.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    idx: 1,
    checkList: ''
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    app.getTheme(that);
    this.getTaskList();
    

  },

  // 获取任务列表
  getTaskList:function(){
    var taskType = this.data.idx;
    // 获取任务数据列表
    app.post('/userTasks/list',
      {
        taskType: taskType
      }).then((res) => {
        console.log(res)
        that.setData({
          checkList: res.data
        })
      }).catch((error) => { })
      
  },

  // 跳转到对应任务详情页面
  toTaskDetails: function (e) {
    var id = e.currentTarget.dataset.id;
    // wx.navigateTo({
    //   url: '../taskDetails/taskDetails?id=' + id + '',
    // })
  },

  // toptab切换
  switchTab:function(e){
    var id = e.currentTarget.dataset.id;
    this.setData({
      idx: id
    })
    this.getTaskList();
  }
})