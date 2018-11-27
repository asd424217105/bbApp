// pages/index/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: 'yellow',
    userType: 0,
    newsList: [],
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    taskUrl: '',
    workName: '',
    changeWorkUrl:'pages/changeProject/changeProject',
    fBtnUrl: [],
    fBtnUrl2: [],
    currentTab: 0,
    tabArray: ["我的项目任务", "我发布的工作"],
    viewLong: 0,
    doingWorkId: '',
    doingWorkName:'还未选择项目',
    callId: '',
    callName: '还未选择项目',
    tipsNum:5,
    platformNum: [],

    projectId: '', // 项目id  班组长选择项目任务后返回的项目id  用于新建汇报  申请时选择接收人  获取项目通知
    upId: '', // 上级id  我的任务  签到考勤
    upId2:'', // 上级id  我的任务  签到考勤
    refresh: false,
    w_toggle:''
  },
  //事件处理函数
  bindChange: function (e) {
    var that = this;
    that.setData({ 
      currentTab: e.detail.current,
      viewLong: e.detail.current 
    });
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        viewLong: e.target.dataset.current
      })
    }
  },  

  onShow:function(){
    var that = this;
    wx.getStorage({
      key: 'wToggle',
      success: function(res) {
        that.setData({
          w_toggle: res.data
        })
      },
    })

    // 查询各类人员数量与项目数量
    app.post('/home/queryDataNumber', {}).then((res) => {
      that.setData({
        platformNum: res.data
      })
    }).catch((error) => { })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(app.globalData)
    // wx.getStorage({
    //   key: 'userInfo',
    //   success: function(res) {
    //     if(res.data.user_type==0){
    //       that.setData({
    //         doingWorkId: res.data.callId || '',
    //         doingWorkName: res.data.callName || '请选择项目',
    //       }) 
    //     }
    //     if (res.data.user_type == 1) {
    //       that.setData({
    //         doingWorkId: res.data.taskId || '',
    //         doingWorkName: res.data.taskName || '请选择项目',
    //         callId: res.data.callId || '',
    //         callName: res.data.callName || '请选择项目',
    //       })
    //     }
    //     if (res.data.user_type == 2 || res.data.user_type == 3) {
    //       that.setData({
    //         doingWorkId: res.data.projectId || '',
    //         doingWorkName: res.data.projectName || '请选择项目',
    //         callId: res.data.taskId || '',
    //         callName: res.data.taskName || '请选择项目',
    //       })
    //     }
    //     if (res.data.user_type == 4 || res.data.user_type == 5) {
    //       that.setData({
    //         doingWorkId: res.data.projectId || '',
    //         doingWorkName: res.data.projectName || '请选择项目',
    //       })
    //     }
    //   },
    // })
    //从本地取出用户状态
    wx.getStorage({
      key: 'userType',
      success: function (res) {
        var btnUrl = [];
        // 建筑公司端
        if (res.data == 4 || res.data == 5){
          btnUrl = [
            { btnName: "验收", btnSrc: "resources/pic/accep.png", url: "/constructionCompany/pages/checkList/checkList" }, 
            { btnName: "审批", btnSrc: "resources/pic/approval.png", url: "/constructionCompany/pages/thingApplyList/thingApplyList" }, 
            { btnName: "请假管理", btnSrc: "resources/pic/leave.png", url: "/constructionCompany/pages/leaveList/leaveList" },
            { btnName: "班组列表", btnSrc: "resources/pic/listOfGroups.png", url: "/constructionCompany/pages/teamList/teamList" },
            { btnName: "部门人员", btnSrc: "resources/pic/listOfGroups.png", url: "/constructionCompany/pages/departmentPersonnel/departmentPersonnel"},
            { btnName: "组织安排", btnSrc: "resources/pic/organization.png", url: "/constructionCompany/pages/arrangePeople/arrangePeople" }, 
            { btnName: "我的任务", btnSrc: "resources/pic/task2.png", url: "/pages/index/pages/myTask/myTask" }, 
            { btnName: "通知", btnSrc: "resources/pic/notice.png", url: "/pages/index/pages/notice/notice" }
          ]       
        }
        // 项目部
        if (res.data == 2 || res.data == 3) {
          btnUrl = [
            { btnName: "招工列表",btnSrc: "resources/pic/recruitWorkers.png", url:"/projectManager/pages/findWorkersList/findWorkersList"},
            { btnName: "报验列表", btnSrc: "resources/pic/accep.png", url: "/projectManager/pages/checkList/checkList" },
            { btnName: "工作汇报", btnSrc: "resources/pic/workReport.png", url: "/projectManager/pages/progressReport/progressReport" },
            { btnName: "申请", btnSrc: "resources/pic/application.png", url: "/projectManager/pages/thingApplyList/thingApplyList" },
            { btnName: "项目详情", btnSrc: "resources/pic/JobDetails.png", url: "/projectManager/pages/projectDetails/projectDetails" },
            { btnName: "请假", btnSrc: "resources/pic/leave.png", url: "/projectManager/pages/leaveList/leaveList" },
            { btnName: "班组列表", btnSrc: "resources/pic/listOfGroups.png", url: "/projectManager/pages/teamList/teamList" },
            { btnName: "部门人员", btnSrc: "resources/pic/listOfGroups.png", url: "/projectManager/pages/departmentPersonnel/departmentPersonnel" ,ifType:'3'},
            { btnName: "签到", btnSrc: "resources/pic/signIn.png", url: "/projectManager/pages/signIn/signIn" },
            { btnName: "我的任务", btnSrc: "resources/pic/task2.png", url: "/pages/index/pages/myTask/myTask" },
            { btnName: "通知", btnSrc: "resources/pic/notice.png", url: "/pages/index/pages/notice/notice" }
          ]
          var btnUrl2 = [
            { btnName: "报验列表", btnSrc: "resources/pic/accep.png", url: "/projectManager/pages/checkList/checkList" },
            { btnName: "工作汇报", btnSrc: "resources/pic/workReport.png", url: "/projectManager/pages/progressReport/progressReport" },
            { btnName: "请假管理", btnSrc: "resources/pic/leave.png", url: "/projectManager/pages/leaveList/leaveList" },
            { btnName: "评价", btnSrc: "resources/pic/evaluate.png", url: "/projectManager/pages/evaluate/evaluate" },
            { btnName: "确认进场", btnSrc: "resources/pic/confirmEntering.png", url: "/projectManager/pages/admission/admission" }
          ]
          that.setData({
            fBtnUrl2: btnUrl2
          })
        }
        // 班组长
        if (res.data == 1) {
          btnUrl = [
            { btnName: "发布招工",btnSrc:"resources/pic/recruitWorkers.png",url: "/foreman/pages/findWorkersList/findWorkersList"},
            { btnName: "验收申请",btnSrc: "resources/pic/accep.png", url: "/foreman/pages/checkList/checkList" },
            { btnName: "进度汇报", btnSrc: "resources/pic/progress.png", url: "/foreman/pages/progressReport/progressReport" },
            { btnName: "申请", btnSrc: "resources/pic/application.png", url: "/foreman/pages/thingApplyList/thingApplyList" },
            { btnName: "请假", btnSrc: "resources/pic/leave.png", url: "/foreman/pages/leaveList/leaveList" },
            { btnName: "任务详情",btnSrc:"resources/pic/JobDetails.png",url: "/foreman/pages/projectTaskDetails/projectTaskDetails"},
            { btnName: "合同管理", btnSrc:"resources/pic/contract.png", url: "/foreman/pages/contractManage/contractManage"},
            { btnName: "我的任务", btnSrc: "resources/pic/task2.png", url: "/pages/index/pages/myTask/myTask" },
            { btnName: "我的带班", btnSrc: "resources/pic/myteam.png", url: "/foreman/pages/workerLeader/workerLeader" },
            { btnName: "评价", btnSrc: "resources/pic/evaluate.png", url: "/foreman/pages/evaluate/evaluate" },
            { btnName: "通知", btnSrc: "resources/pic/notice.png", url: "/pages/index/pages/notice/notice", tipsNum:'1'}
          ]
          var btnUrl2 = [
            { btnName: "考勤管理", btnSrc: "resources/pic/signIn.png", url: "/foreman/pages/userAtt/userAtt" },
            { btnName: "工人日报", btnSrc: "resources/pic/JobDetails.png", url: "/foreman/pages/workerDailyList/workerDailyList" },
            { btnName: "请假管理", btnSrc: "resources/pic/leave.png", url: "/foreman/pages/leaveList/leaveList" },
            { btnName: "计工管理", btnSrc: "resources/pic/recordingRecord.png", url: "/foreman/pages/workPointsList/workerList/workerList" },
            { btnName: "工作详情", btnSrc: "resources/pic/daily.png", url: "/foreman/pages/projectTaskDetails/projectTaskDetails" },
            { btnName: "我的工人", btnSrc: "resources/pic/myWokers.png", url: "/foreman/pages/myWorkers/myWorkers" },
            { btnName: "评价", btnSrc: "resources/pic/evaluate.png", url: "/foreman/pages/evaluate/evaluate" },
            { btnName: "确认进场", btnSrc: "resources/pic/confirmEntering.png", url: "/foreman/pages/admission/admission" }
          ]        
          that.setData({
            fBtnUrl2: btnUrl2
          })
        }
        // 工人
        if (res.data == 0) {
          btnUrl = [
            { btnName: "签到", btnSrc: "resources/pic/signIn.png", url: "/worker/pages/signIn/signIn" },
            { btnName: "日报", btnSrc: "resources/pic/JobDetails.png", url: "/worker/pages/workerDailyList/workerDailyList" },
            { btnName: "请假", btnSrc: "resources/pic/leave.png", url: "/worker/pages/leaveList/leaveList" },
            { btnName: "工作详情", btnSrc: "resources/pic/signIn.png", url: "/worker/pages/projectTaskDetails/projectTaskDetails" },
            { btnName: "计工记录", btnSrc: "resources/pic/recordingRecord.png", url: "/worker/pages/workPointsList/workPointsList" },
            { btnName: "评价", btnSrc: "resources/pic/evaluate.png", url: "/worker/pages/evaluate/evaluate" },
            { btnName: "我的任务", btnSrc: "resources/pic/task2.png", url: "/pages/index/pages/myTask/myTask" },
            { btnName: "通知", btnSrc: "resources/pic/notice.png", url: "/pages/index/pages/notice/notice" }
          ]
          var btnUrl2 = [
            { btnName: "考勤管理", btnSrc: "resources/pic/signIn.png", url: "/littleForeman/pages/userAtt/userAtt" },
            { btnName: "工人日报", btnSrc: "resources/pic/JobDetails.png", url: "/littleForeman/pages/workerDailyList/workerDailyList" },
            { btnName: "请假管理", btnSrc: "resources/pic/leave.png", url: "/littleForeman/pages/leaveList/leaveList" },
            { btnName: "记功管理", btnSrc: "resources/pic/recordingRecord.png", url: "/littleForeman/pages/workPointsList/workerList/workerList" },
            { btnName: "工作详情", btnSrc: "resources/pic/daily.png", url: "/littleForeman/pages/projectTaskDetails/projectTaskDetails" },
            { btnName: "我的工人", btnSrc: "resources/pic/myWokers.png", url: "/littleForeman/pages/myWorkers/myWorkers" },
            { btnName: "评价", btnSrc: "resources/pic/evaluate.png", url: "/littleForeman/pages/evaluate/evaluate" }
          ]
          that.setData({
            fBtnUrl2: btnUrl2
          })
        }
        that.setData({
          fBtnUrl: btnUrl
        })
        // 给主题和用户状态赋值
        that.setData({
          userType: res.data,
          theme: res.data == 0 ? 'yellow' : res.data == 1 || res.data ==2 || res.data ==3 ? 'red' : res.data == 4 ? 'blue' : ''
        })
        wx.setStorageSync('userTheme', that.data.theme);
        // 设置tabBar样式
        wx.setTabBarStyle({
          color: '#585858',
          selectedColor: res.data == 0 ? '#FCBB01' : res.data == 1 || res.data == 2 || res.data == 3 ? '#ff3100' : res.data == 4 ? '#179BD9' : '',
          backgroundColor: '#ffffff',
          borderStyle: 'black'
        })
        // 设置tabBar单个图标文字
        wx.setTabBarItem({
          index: 0,
          text: '首页',
          iconPath: 'images/home.png',
          selectedIconPath: res.data == 0 ? 'images/home_on.png' : res.data == 1 || res.data == 2 || res.data == 3 ? 'images/home_on_red.png' : res.data == 4 ? 'images/home_on_blue.png' : '',
          success: (res) => {
            console.log("改变样式成功")
          }
        })
        wx.setTabBarItem({
          index: 1,
          text: res.data == 0 || res.data == 1 || res.data == 2 ? '找活' : res.data == 3 ? '找班组' : res.data == 4 ? '项目与人员' : '',
          iconPath: res.data == 0 || res.data == 1 || res.data == 2 || res.data == 3 ? 'images/find.png' : res.data == 4 ? 'images/people.png' : '',
          selectedIconPath: res.data == 0 ? 'images/find_on.png' : res.data == 1 || res.data == 2 || res.data == 3 ? 'images/find_on_red.png' : res.data == 4 ? 'images/people_on.png' : '',
          success: (res) => {
            console.log("改变样式成功")
          }
        })
        wx.setTabBarItem({
          index: 2,
          text: '资料',
          iconPath: 'images/community.png',
          selectedIconPath: res.data == 0 ? 'images/community_on.png' : res.data == 1 || res.data == 2 || res.data == 3 ? 'images/community_on_red.png' : res.data == 4 ? 'images/community_on_blue.png' : '',
          success: (res) => {
            console.log("改变样式成功")
          }
        })
        wx.setTabBarItem({
          index: 3,
          text: '我的',
          iconPath: 'images/my.png',
          selectedIconPath: res.data == 0 ? 'images/my_on.png' : res.data == 1 || res.data == 2 || res.data == 3 ? 'images/my_on_red.png' : res.data == 4 ? 'images/my_on_blue.png' : '',
          success: (res) => {
            console.log("改变样式成功")
          }
        })
        // 设置顶部颜色
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data == 0 ? '#FCBB01' : res.data == 1 || res.data == 2 || res.data == 3 ? '#FE3F44' : res.data == 4 ? '#179BD9' : '',
        })
        console.log(that.data.theme)
      },
    })

    // 加载滚动新闻
    app.post('/sysnews/list', { news_type: 1, curpage: 1, pagesize: 20}).then((res) => {
      console.log('加载滚动成功')
      that.setData({
        newsList: res.data.list
      })
      console.log(that.data.newsList)
      
    }).catch((error) => { })
    
  },

  // 进入按钮详情
  toBtnDetil:function(e){
    var doingWorkId = this.data.doingWorkId;
    var callId = this.data.callId;
    if (this.data.currentTab == 1){
      if (callId == '') {
        wx.showToast({
          title: '请先选择一个项目',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }else{
      if (doingWorkId == '') {
        wx.showToast({
          title: '请先选择一个项目',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  }
})