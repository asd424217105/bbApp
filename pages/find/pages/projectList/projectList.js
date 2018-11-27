// pages/ConstructionCompany/pages/projectList/projectList.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    refresh:false,
    merchantsId: '',
    idx: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getTheme(that);
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        var merchantsId = res.data.merchantsId;
        that.setData({
          merchantsId: merchantsId
        })
        that.getProjectList()
      },
    })
    
  },

  // 获取项目列表
  getProjectList:function(){
    var that = this;
    var merchantsId = this.data.merchantsId;
    var id = this.data.idx;
    // 获取项目列表
    app.post('/project/list',
      {
        id: merchantsId,
        projectName: '',
        projectStatus: id,
        curpage: 1,
        pagesize: 20
      }).then((res) => {
        console.log(res)
        that.setData({
          list:res.data.list
        })
      }).catch((error) => { })
  },

  // 页面显示时
  onShow: function () {
    if (this.data.refresh) {
      this.onPullDownRefresh();
      this.setData({
        refresh: false
      })
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      list: []
    })
    this.getProjectList();
    wx.stopPullDownRefresh();
  },

  // toptab切换
  switchTab:function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      idx: id
    })
    this.getProjectList()
  },

  toDetails:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'projectDetails/projectDetails?id='+id+''
    })
  },

  // 添加项目
  addProject:function(){
    wx.navigateTo({
      url: 'addProject/addProject',
    })
  }
})