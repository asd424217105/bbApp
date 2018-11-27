// pages/index/pages/changeProject/changeProject.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    idx: 3,
    projectList: [],
    merchantsId: '',
    usertype: '',
    changetype: '',
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    var changetype = options.type;
    var that = this;
    app.getTheme(that);
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res)
        var merchantsId = res.data.merchantsId;
        if (String(merchantsId)) {
          var merchantsId = res.data.merchantsId;
          var usertype = res.data.user_type;
          console.log(usertype)
          if (usertype >= 4 || usertype == 0 || (usertype == 1 && changetype == 0) ){
            that.setData({
              idx: 0
            })
          } else {
            that.setData({
              idx: 1
            })
          }
          that.setData({
            changetype: changetype,
            merchantsId: merchantsId,
            usertype: usertype
          })
          // 建设公司
          if (usertype == 4 || usertype == 5) {
            that.getProjectList();
          }
          // 项目部
          if (usertype == 2 || usertype == 3) {
            that.getProjectProlist();
          }
          // 班组长
          if (usertype == 1) {
            that.getTaskList();
          }
          // 工人
          if (usertype == 0) {
            that.getCallList();
          }
        } else {
          wx.showToast({
            title: '获取信息失败',
            icon: 'none',
            duration: 2000
          })
        }

      },
    })

  },

  // 获取项目列表---建设公司
  getProjectList: function () {
    var that = this;
    var idx = this.data.idx;
    var merchantsId = this.data.merchantsId;
    // 获取项目列表
    app.post('/project/list',
      {
        id: merchantsId,
        projectStatus: idx,
        projectName: '',
        curpage: 1,
        pagesize: 20
      }).then((res) => {
        that.setData({
          projectList: res.data.list
        })
      }).catch((error) => { })
  },

  // 获取项目，任务列表---项目部
  getProjectProlist: function () {
    var that = this;
    var idx = this.data.idx;
    var changetype = this.data.changetype;
    if (changetype && changetype == 0) {
      // 获取项目经理负责的项目列表
      app.post('/project/prolist',
        {
          projectStatus: idx,
          curpage: 1,
          pagesize: 20
        }).then((res) => {
          that.setData({
            projectList: res.data.list
          })
        }).catch((error) => { })
    }
    if (changetype && changetype == 1) {
      // 获取项目经理负责的项目任务列表信息
      app.post('/projecttask/list',
        {
          taskStatus: idx,
          taskName: '',
          curpage: 1,
          pagesize: 20
        }).then((res) => {
          that.setData({
            projectList: res.data.list
          })
        }).catch((error) => { })
    }
  },

  // 获取任务，号召列表---班组长
  getTaskList: function () {
    var that = this;
    var idx = this.data.idx;
    var changetype = this.data.changetype;
    if (changetype && changetype == 0) {
      // 项目任务列表接口
      app.post('/projecttask/taskListByMy',
        {
          taskStatus: idx,
          taskName: '',
          curpage: 1,
          pagesize: 20
        }).then((res) => {
          that.setData({
            projectList: res.data.list
          })
        }).catch((error) => { })
    }
    if (changetype && changetype == 1) {
      // 号召任务列表接口
      app.post('/taskcall/list',
        {
          callStatus: idx,
          callName: '',
          curpage: 1,
          pagesize: 20
        }).then((res) => {
          that.setData({
            projectList: res.data.list
          })
        }).catch((error) => { })
    }
  },

  // 获取号召列表---工人
  getCallList: function () {
    var that = this;
    var idx = this.data.idx;
    app.post('/taskcall/callListByMy',
      {
        inviStatus: idx,
        taskName: '',
        curpage: 1,
        pagesize: 20
      }).then((res) => {
        that.setData({
          projectList: res.data.list
        })
      }).catch((error) => { })
  },

  // toptab切换
  switchTab: function (e) {
    var id = e.currentTarget.dataset.id;
    var usertype = this.data.usertype;
    this.setData({
      idx: id
    })
    // 建设公司
    if (usertype == 4 || usertype == 5) {
      this.getProjectList();
    }
    // 项目部
    if (usertype == 2 || usertype == 3) {
      this.getProjectProlist();
    }
    // 班组长
    if (usertype == 1) {
      this.getTaskList();
    }
    // 工人
    if (usertype == 0) {
      this.getCallList();
    }
  },

  // 查看详情
  toDetails:function(e){
    var item = e.currentTarget.dataset.project;
    var usertype = this.data.usertype;
    var changetype = this.data.changetype;
    console.log(item)
    // 工人
    if (usertype == 0) {
      wx.navigateTo({
        url: 'callDetails/callDetails?id=' + item.callId +'',
      })
    }

    // 班组长
    if (usertype == 1) {
      if (changetype == 0){
        wx.navigateTo({
          url: 'projectTaskDetails/projectTaskDetails?id=' + item.taskId + '',
        })
      }
      if (changetype == 1) {
        wx.navigateTo({
          url: 'callDetails/callDetails?id=' + item.callId + '',
        })
      }
    }

    // 项目部
    if (usertype == 2 || usertype == 3) {
      if (changetype == 0) {
        wx.navigateTo({
          url: 'projectDetails/projectDetails?id=' + item.projectId + '',
        })
      }
      if (changetype == 1) {
        wx.navigateTo({
          url: 'projectTaskDetails/projectTaskDetails?id=' + item.id + '',
        })
      }
    }

    // 建设公司
    if (usertype == 4 || usertype == 5) {
      wx.navigateTo({
        url: 'projectDetails/projectDetails?id=' + item.projectId + '',
      })
    }
  }
})