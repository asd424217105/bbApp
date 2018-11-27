// pages/ConstructionCompany/pages/check/check.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    idx: 0,  // 验收类型(0-每天1-阶段2-完工)
    typeid: '',  // (0-我的 1-其他人的)
    targetId: '',  // 项目id
    targetType: 1,  // 目标类型(0-项目1-任务)
    usertype:'',
    curpage: 1,
    pagesize: 20,
    list: [],
    refresh: false,
    locking: false
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    app.getTheme(that);
    var id = options.id;
    var typeid = options.type;

    // 根据身份判断 targetType目标类型是 (0-项目 或 1-任务)
    wx.getStorage({
      key: 'userType',
      success: function (res) {
        var usertype = res.data;
        var targetType;
        // 建设公司
        if (usertype >= 4){
          targetType = 0;
        }
        // 项目部 （我的）
        if ((usertype == 2 || usertype == 3) && typeid == 0){
          targetType = 0;
        }
        // 项目部 （班组长）
        if ((usertype == 2 || usertype == 3) && typeid == 1) {
          targetType = 1;
        }
        // 班组长
        if (usertype == 1) {
          targetType = 1;
        }
        that.setData({
          usertype: usertype,
          targetType: targetType,
          typeid: typeid,
          targetId: id,
          curpage: 1,
          list: []
        })

        // 获取我的验收    
        if (typeid == 0) {
          that.getAcceptList();
        }
        // 获取其他人的验收
        if (typeid == 1) {
          that.getAcceptOtherList();
        }

      },  
    })
  },

  // 获取验收数据列表 （我的）
  getAcceptList:function(){
    var that = this;
    var targetId = this.data.targetId;
    var targetType = this.data.targetType;
    var acceptType = this.data.idx;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取验收数据列表
    app.post('/accept/list',
      {
        targetId: targetId,
        targetType: targetType,
        acceptType: acceptType,
        curpage: curpage,
        pagesize: pagesize
      }).then((res) => {
        var reslist = res.data.list;
        var list = that.data.list;
        list.push.apply(list, reslist);
        that.setData({
          list: list
        })
        // 如果没有下一页数据了 上拉锁定
        if (!res.data.hasNextPage) {
          that.setData({
            locking: true
          })
        } else {
          that.setData({
            locking: false
          })
        }
      }).catch((error) => {

      })
  },

  // 获取验收数据列表（其他验收）
  getAcceptOtherList: function () {
    var that = this;
    var targetId = this.data.targetId;
    var targetType = this.data.targetType;
    var acceptType = this.data.idx;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取验收数据列表（其他验收）
    app.post('/accept/listByOther',
      {
        targetId: targetId,
        targetType: targetType,
        acceptType: acceptType,
        curpage: curpage,
        pagesize: pagesize
      }).then((res) => {
        var reslist = res.data.list;
        var list = that.data.list;
        list.push.apply(list, reslist);
        that.setData({
          list: list
        })
        // 如果没有下一页数据了 上拉锁定
        if (!res.data.hasNextPage) {
          that.setData({
            locking: true
          })
        } else {
          that.setData({
            locking: false
          })
        }
      }).catch((error) => {

      })
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
    var typeid = this.data.typeid;
    this.setData({
      curpage: 1,
      list: []
    })
    // 获取我的验收    
    if (typeid == 0) {
      this.getAcceptList();
    }
    // 获取其他人的验收
    if (typeid == 1) {
      this.getAcceptOtherList();
    }
    wx.stopPullDownRefresh();
  },

  // 上拉加载
  onReachBottom: function () {
    var typeid = this.data.typeid;
    var curpage = this.data.curpage;
    var locking = this.data.locking;
    if (!locking) {
      curpage++;
      this.setData({
        curpage: curpage
      })
      // 获取我的验收    
      if (typeid == 0) {
        this.getAcceptList();
      }
      // 获取其他人的验收
      if (typeid == 1) {
        this.getAcceptOtherList();
      }
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // toptab切换
  switchTab: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      idx: id
    })
    this.onPullDownRefresh()
  },

  // 跳转到对应验收详情页面
  toCheckDetails:function(e){
    var id = e.currentTarget.dataset.id;
    var typeid = this.data.typeid;
    wx.navigateTo({
      url: 'checkDetails/checkDetails?id=' + id + '&type=' + typeid +'',
    })
  },

  // 新建验收
  addThing:function(){
    var targetId = this.data.targetId;
    wx.navigateTo({
      url: 'addCheck/addCheck?id='+ targetId +'',
    })
  }
})