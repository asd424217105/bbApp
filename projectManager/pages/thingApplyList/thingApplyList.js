// pages/index/pages/thingApplyList/thingApplyList.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    typeid: '',  // (0-我的 1-其他人的)
    targetId: '',  // 目标id
    targetType: '',  // 目标类型
    usertype: '',
    usertypeName: '',
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
    // 根据身份判断 目标类型是 (0-项目 或 1-任务)
    wx.getStorage({
      key: 'userType',
      success: function (res) {
        console.log(res)
        var usertype = res.data;
        var targetType;
        // 建设公司
        if (usertype >= 4) {
          targetType = 0;
        }
        // 项目部 （我的）
        if ((usertype == 2 || usertype == 3) && typeid == 0) {
          targetType = 0;
          that.setData({
            usertypeName: 'xiangmu'
          })
        }
        // 项目部 （班组长）
        if ((usertype == 2 || usertype == 3) && typeid == 1) {
          targetType = 1;
          that.setData({
            usertypeName: 'xiangmu'
          })
        }
        // 班组长
        if (usertype == 1) {
          targetType = 1;
        }

        that.setData({
          targetId: id,
          typeid: typeid,
          curpage: 1,
          list: [],
          usertype: usertype,
          targetType: targetType
        })

        // 获取我的申请    
        if (typeid == 0) {
          that.getThingApplyList();
        }
        // 获取其他人的申请
        if (typeid == 1) {
          that.getThingApplyOtherList();
        }
      },
    })
  },

  // 获取计划申请列表（我的申请）
  getThingApplyList: function () {
    var that = this;
    var targetId = this.data.targetId;
    var targetType = this.data.targetType;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取计划申请列表-（我的申请）{*1.适用于班组长、项目经理获取自己提交的计划申请 *
    // 2.班组长type取1，id:项目任务id； 项目经理type取0，id:项目id * 3.opid：操作人id}
    app.post('/thingApply/list',
      {
        id: targetId,
        type: targetType,
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

  // 获取计划申请列表（其他申请）
  getThingApplyOtherList: function () {
    var that = this;
    var targetId = this.data.targetId;
    var targetType = this.data.targetType;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取计划申请列表-（我的申请）{*1.适用于班组长、项目经理获取自己提交的计划申请 *
    // 2.班组长type取1，id:项目任务id； 项目经理type取0，id:项目id * 3.opid：操作人id}
    app.post('/thingApply/listByOther',
      {
        id: targetId,
        // type: targetType,
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
    // 获取我的申请    
    if (typeid == 0) {
      this.getThingApplyList();
    }
    // 获取其他人的申请
    if (typeid == 1) {
      this.getThingApplyOtherList();
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
      // 获取我的申请    
      if (typeid == 0) {
        this.getThingApplyList();
      }
      // 获取其他人的申请
      if (typeid == 1) {
        this.getThingApplyOtherList();
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
      typeid: id
    })
    this.onPullDownRefresh()
  },

  // 跳转到对应汇报详情页面
  toCheckDetails: function (e) {
    var id = e.currentTarget.dataset.id;
    var typeid = this.data.typeid;
    wx.navigateTo({
      url: 'thingApplyDetails/thingApplyDetails?id=' + id + '&type=' + typeid +'',
    })
  },

  // 新建验收
  addThing: function () {
    var targetId = this.data.targetId;
    wx.navigateTo({
      url: 'addThingApply/addThingApply?id=' + targetId + '',
    })
  }
})