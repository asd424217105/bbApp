// pages/index/pages/changeProject/changeProject.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    idx: 3,
    projectList: [],
    projectId:'',
    merchantsId: '',
    usertype: '',
    changetype:'',
    selectId: '',
    selectId2:'',
    curpage: 1,
    pagesize: 20,
    locking: false
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    var id = options.id;
    var changetype = options.type;
    // 判断切换的是 第一屏（发布给我的） 还是 第二屏（我发布的）
    if (changetype == 0){
      this.setData({
        changetype: changetype,
        selectId: id
      })
    }   
    if (changetype == 1){   
      this.setData({
        changetype: changetype,
        selectId2: id
      })
    }
    var that = this;
    app.getTheme(that)
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        console.log(res)
        var projectId = res.data.projectId;
        var merchantsId = res.data.merchantsId;
        if (String(merchantsId)){
          var merchantsId = res.data.merchantsId;
          var usertype = res.data.user_type;
          console.log(usertype)
          if (usertype >= 4){
            that.setData({
              idx: 0
            })
          }else{
            that.setData({
              idx: 1
            })
          }
          that.setData({
            merchantsId: merchantsId,
            usertype: usertype,
            curpage: 1,
            projectList: []
          })
          if (projectId){
            that.setData({
              projectId: projectId
            })
          }
          // 建设公司
          if (usertype == 4 || usertype == 5){           
            that.getProjectList();
          }
          // 项目部
          if (usertype == 2 || usertype == 3){
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
        }else{
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
  getProjectList:function(){
    var that = this;
    var idx = this.data.idx;
    var merchantsId = this.data.merchantsId;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取项目列表
    app.post('/project/list',
      {
        id: merchantsId,
        projectStatus: idx,
        projectName: '',
        curpage: curpage,
        pagesize: pagesize
      }).then((res) => {
        var reslist = res.data.list;
        var list = that.data.projectList;
        list.push.apply(list, reslist);
        console.log(list)
        that.setData({
          projectList: list
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
      }).catch((error) => {})
  },

  // 获取项目，任务列表---项目部
  getProjectProlist: function () {
    var that = this;
    var idx = this.data.idx;
    var projectId = this.data.projectId;
    var changetype = this.data.changetype;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    if (changetype && changetype == 0) {
      // 获取项目经理负责的项目列表
      app.post('/project/prolist',
        {
          projectStatus: idx,
          curpage: curpage,
          pagesize: pagesize
        }).then((res) => {
          var reslist = res.data.list;
          var list = that.data.projectList;
          list.push.apply(list, reslist);
          that.setData({
            projectList: list
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
        }).catch((error) => {})
    }
    if (changetype && changetype == 1) {
      // 获取项目经理负责的项目任务列表信息
      app.post('/projecttask/listChange',
        {
          projectId: projectId,
          taskStatus: idx,
          curpage: curpage,
          pagesize: pagesize
        }).then((res) => {
          var reslist = res.data.list;
          var list = that.data.projectList;
          list.push.apply(list, reslist);
          that.setData({
            projectList: list
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
        }).catch((error) => {})
    }
  },

  // 获取任务，号召列表---班组长
  getTaskList: function () {
    var that = this;
    var idx = this.data.idx;
    var changetype = this.data.changetype;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    if (changetype && changetype == 0) {
      // 项目任务列表接口
      app.post('/projecttask/taskListByMy',
        {
          taskStatus: idx,
          taskName: '',
          curpage: curpage,
          pagesize: pagesize
        }).then((res) => {
          var reslist = res.data.list;
          var list = that.data.projectList;
          list.push.apply(list, reslist);
          that.setData({
            projectList: list
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
        }).catch((error) => {})
    }
    if (changetype && changetype == 1){
      // 号召任务列表接口
      app.post('/taskcall/list',
        {
          callStatus: idx,
          callName: '',
          curpage: curpage,
          pagesize: pagesize
        }).then((res) => {
          var reslist = res.data.list;
          var list = that.data.projectList;
          list.push.apply(list, reslist);
          that.setData({
            projectList: list
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
        }).catch((error) => {})
    } 
  },

  // 获取号召列表---工人
  getCallList: function () {
    var that = this;
    var idx = this.data.idx;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    app.post('/taskcall/callListByMy',
      {
        inviStatus: idx,
        taskName: '',
        curpage: curpage,
        pagesize: pagesize
      }).then((res) => {
        var reslist = res.data.list;
        var list = that.data.projectList;
        list.push.apply(list, reslist);
        that.setData({
          projectList: list
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
      }).catch((error) => {})
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    var usertype = this.data.usertype;
    this.setData({
      projectList: [],
      curpage: 1
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
    wx.stopPullDownRefresh();
  },

  // 上拉加载
  onReachBottom: function () {
    var usertype = this.data.usertype;
    var curpage = this.data.curpage;
    var locking = this.data.locking;
    if (!locking) {
      curpage++;
      this.setData({
        curpage: curpage
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
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 选中项目后返回首页
  changeProject: function (e) {
    var project = e.currentTarget.dataset.project;
    var changetype = this.data.changetype;
    console.log(project)
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var usertype = this.data.usertype;
    
    // 返回上一页要刷新
    // 建设公司
    if (usertype == 4 || usertype == 5){
      prevPage.setData({
        refresh: true,
        doingWorkId: project.id,
        doingWorkName: project.projectName,
      })
    }
    // 项目部
    if ((usertype == 2 || usertype == 3) && changetype == 0){
      prevPage.setData({
        refresh: true,
        doingWorkId: project.projectId,
        doingWorkName: project.projectName,
      })
    }
    if ((usertype == 2 || usertype == 3) && changetype == 1) {
      prevPage.setData({
        refresh: true,
        callId: project.id,
        callName: project.taskName,
        projectId: project.projectId,
      })
    }
    // 班组长
    if (project.taskId && usertype == 1 && changetype == 0) {
      prevPage.setData({
        refresh: true,
        doingWorkId: project.taskId,
        doingWorkName: project.taskName,
        projectId: project.projectId,
        upId: project.projectId
      })
    }
    if (project.callId && usertype == 1 && changetype == 1) {
      prevPage.setData({
        refresh: true,
        callId: project.callId,
        callName: project.callName,
        upId2: project.taskId
      })
    }
    // 工人
    if (usertype == 0) {
      prevPage.setData({
        refresh: true,
        doingWorkId: project.callId,
        doingWorkName: project.callName,
        projectId: project.projectId,
        upId: project.taskId
      })
    }

    wx.showToast({
      title: '切换项目成功',
      icon: 'success',
      duration: 2000
    })
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
    }, 800)
  },

  // toptab切换
  switchTab: function (e) {
    var id = e.currentTarget.dataset.id;
    var usertype = this.data.usertype;
    this.setData({
      idx: id,
      projectList: [],
      curpage: 1
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
  }
})