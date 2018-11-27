// pages/find/find.js
var app = getApp();
var uploadfun = require('../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentId: '0',
    theme: 'yellow',
    userType: 0,
    mobile: '',
    list: [],
    pagesize: 20,
    curpage: 1,
    locking: false,
    refresh: false,
    taskJilUnitArray:[], // 工资单位
    cityArray: [], // 接口里的城市数组
    cityNameArray: [[], [], []], // 要渲染的城市数组
    multiIndex: ['0', '0', '0'], // 城市数组的默认下标
    cityValue: '',  // 选中的城市value值
    certification_status:'1',
    workkindArray: [],  // 工种
    workkind: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取认证状态
    that.setData({
      certification_status: app.globalData.userInfo.certification_status
    })
    //从本地取出用户状态
    wx.getStorage({
      key: 'userType',
      success: function (res) {
        // 给主题和用户状态赋值
        that.setData({
          userType: res.data,
          theme: res.data == 0 ? 'yellow' : res.data == 1 || res.data == 2 || res.data == 3 ? 'red' : res.data == 4 ? 'blue' : ''
        })

        // 设置顶部文字
        wx.setNavigationBarTitle({
          title: res.data == 0 || res.data == 1 ? '找活' : res.data == 2 || res.data == 3 ? '找班组' : res.data == 4 ? '项目与人员' : '',
        })

        // 设置顶部颜色
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data == 0 ? '#FCBB01' : res.data == 1 || res.data == 2 || res.data == 3 ? '#FE3F44' : res.data == 4 ? '#179BD9' : '',
        })

        // 获取系统工种
        app.post('/sysworkkind/list', {}
        ).then((res) => {
          console.log(res)
          var arr = res.data;
          that.setData({
            workkindArray: arr
          })
        }).catch((error) => { })

        // 如果是工人模块-----------
        if (res.data == 0) {
          // 获取项目部招工列表
          that.calljoblist();

          // 获取参数字典
          app.post('/common/sysParam/getSysCode', {}).then((res) => {
            that.setData({
              taskJilUnitArray: app.getCodeArray(res.data, 'SETTLEMENT_UNIT'),//单位
            })
          }).catch((error) => {})

          // 获取三级联动
          app.post('/syscity/getCity', {}
          ).then((res) => {
            var arr = res.data;
            var cityNameArray = that.data.cityNameArray;
            var pArray = arr,
              cArray = arr[0].child,
              aArray = arr[0].child[0].child;
            for (var i in pArray) {
              cityNameArray[0].push(pArray[i].name)
            }
            for (var i in cArray) {
              cityNameArray[1].push(cArray[i].name)
            }
            for (var i in aArray) {
              cityNameArray[2].push(aArray[i].name)
            }
            that.setData({
              cityArray: arr,
              cityNameArray: cityNameArray
            })
          }).catch((error) => { })
        }

        // 如果是班组模块-----------
        if (res.data == 1){
          // 获取项目部招工列表
          that.taskJobList();
          var project = res.data.taskCall;

          // 获取三级联动
          app.post('/syscity/getCity', {}
          ).then((res) => {
            var arr = res.data;
            var cityNameArray = that.data.cityNameArray;
            var pArray = arr,
              cArray = arr[0].child,
              aArray = arr[0].child[0].child;
            for (var i in pArray) {
              cityNameArray[0].push(pArray[i].name)
            }
            for (var i in cArray) {
              cityNameArray[1].push(cArray[i].name)
            }
            for (var i in aArray) {
              cityNameArray[2].push(aArray[i].name)
            }
            that.setData({
              cityArray: arr,
              cityNameArray: cityNameArray
            })
          }).catch((error) => { })
        }

        // 如果是项目部模块----------  
        if (res.data == 2 || res.data == 3) {
          // 获取班组长求工列表
          that.teamlist();
        } 

      },
    })

  },

  // 页面显示时是否下拉刷新
  onShow: function () {
    if (this.data.refresh) {
      this.onPullDownRefresh();
      this.setData({
        refresh: false
      })
    }
  },

  // 选择工种
  bindworkkind: function (e) {
    var index = e.detail.value;
    var workkindArray = this.data.workkindArray;
    this.setData({
      workkind: workkindArray[index]
    })
    this.onPullDownRefresh();
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    var userType = this.data.userType;
    var idx = this.data.currentId;
    this.setData({
      curpage: 1,
      list: []
    })   
    if(idx == 0){
      // 判断是哪个模块
      if (userType == 0) {
        this.calljoblist();
      }
      if (userType == 1) {
        this.taskJobList();
      }
      if (userType == 2 || userType == 3) {
        this.teamlist();
      }
    }
    if(idx == 1){
      // 判断是哪个模块
      if (userType == 0) {
        this.calljoblist2();
      }
      if (userType == 1) {
        this.taskJobList2();
      }
      if (userType == 2 || userType == 3) {
        this.teamlist2();
      }
    }
    wx.stopPullDownRefresh();
  },

  // 上拉加载
  onReachBottom: function () {
    var userType = this.data.userType;
    var curpage = this.data.curpage;
    var locking = this.data.locking;
    var idx = this.data.currentId;
    if (!locking) {
      curpage++;
      this.setData({
        curpage: curpage
      })
      if(idx == 0){
        // 判断是哪个模块
        if (userType == 0) {
          this.calljoblist();
        }
        if (userType == 1) {
          this.taskJobList();
        }
        if (userType == 2 || userType == 3) {
          this.teamlist();
        }
      }
      if (idx == 1) {
        // 判断是哪个模块
        if (userType == 0) {
          this.calljoblist2();
        }
        if (userType == 1) {
          this.taskJobList2();
        }
        if (userType == 2 || userType == 3) {
          this.teamlist2();
        }
      }
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 进入列表详情
  toDetil: function (e) {
    var id = e.currentTarget.dataset.id;
    var invi = e.currentTarget.dataset.invi;
    var userType = this.data.userType;
    var currentId = this.data.currentId;
    if (userType == 0){
      wx.navigateTo({
        url: 'pages/calljoblist/calljoblist?id=' + id + '&invi=' + invi +''
      })
    }
    if (userType == 1){
      wx.navigateTo({
        url: 'pages/taskjobDetails/taskjobDetails?id=' + id + '&invi=' + invi +''
      })
    }
    if (userType == 2 || userType == 3){
      wx.navigateTo({
        url: 'pages/groupDetails/groupDetails?id=' + id + ''
      })
    }

  },

  // 项目部模块js----------------------------------

  // 获取班组长求工列表
  teamlist: function () {
    var that = this;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    var mobile = this.data.mobile;
    var workKindId = this.data.workkind.id;
    if (!workKindId) {
      workKindId = ''
    }
    // 获取班组长求工列表api
    app.post('/taskPerson/teamlist',
      {
        curpage: curpage,
        pagesize: pagesize,
        workKindId: workKindId,
        mobile: mobile
      }).then((res) => {
        console.log(res)
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
      }).catch((error) => { })
  },

  // 获取邀约过的班组长列表
  teamlist2: function () {
    var that = this;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取邀约过的班组长列表
    app.post('/taskPerson/teamlist',
      {
        curpage: curpage,
        pagesize: pagesize
      }).then((res) => {
        console.log(res)
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
      }).catch((error) => { })
  },

  // 搜索框
  bindKeyInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  // 手机号搜索班组
  searchBtn: function () {
    this.onPullDownRefresh();
  },


  // 班组长模块js-----------------------------------

  // 获取项目部招工列表
  taskJobList: function () {
    var that = this;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    var workKindId = this.data.workkind.id;
    if (!workKindId) {
      workKindId = ''
    }
    var cityId = this.data.cityValue.id;
    if (!cityId){
      cityId = ''
    }
    // 获取项目部招工列表
    app.post('/projecttask/taskjoblist',
      {
        cityId: cityId,
        workKindId: workKindId,
        curpage: curpage,
        pagesize: pagesize
      }).then((res) => {
        console.log(res)
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
      }).catch((error) => { })
  },

  // 获取班组长负责的项目任务列表 （自己报名任务的列表）
  taskJobList2: function () {
    var that = this;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取班组长负责的项目任务列表 （自己报名任务的列表）
    app.post('/projecttask/bmTaskList',
      {
        inviStatus: '9',
        taskName:'',
        curpage: curpage,
        pagesize: pagesize
      }).then((res) => {
        console.log(res)
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
      }).catch((error) => { })
  },


  // 工人模块js----------------------------------

  // 获取工人端任务号召列表--找活
  calljoblist: function () {
    var that = this;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    var workKindId = this.data.workkind.id;
    if (!workKindId) {
      workKindId = ''
    }
    var cityId = this.data.cityValue.id;
    if (!cityId) {
      cityId = ''
    }
    // 获取工人端任务号召列表--找活
    app.post('/taskcall/calljoblist',
      {
        cityId: cityId,
        workKindId: workKindId,
        curpage: curpage,
        pagesize: pagesize
      }).then((res) => {
        console.log(res)
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
      }).catch((error) => { })
  },

  // 获取工人负责的任务号召列表 （自己报名号召的列表）
  calljoblist2: function () {
    var that = this;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取工人负责的任务号召列表 （自己报名号召的列表）
    app.post('/taskcall/bmCallList',
      {
        inviStatus: '9',
        curpage: curpage,
        pagesize: pagesize
      }).then((res) => {
        console.log(res)
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
      }).catch((error) => { })
  },

  // 三级联动
  bindCityPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var pIndex = e.detail.value[0];
    var cIndex = e.detail.value[1];
    var aIndex = e.detail.value[2];
    var cityArray = this.data.cityArray;
    var area = cityArray[pIndex].child[cIndex].child[aIndex];
    this.setData({
      cityValue: area
    })
    console.log(this.data.cityValue)
    this.onPullDownRefresh();
  },
  bindCityColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var that = this;
    var cityArray = this.data.cityArray;
    var cityNameArray = that.data.cityNameArray;
    var arr1, arr2;

    switch (e.detail.column) {
      case 0:
        var cityarr = cityArray[e.detail.value].child;
        arr1 = [], arr2 = [];
        for (var i in cityarr) {
          arr1.push(cityarr[i].name)
        }
        for (var i in cityarr[0].child) {
          arr2.push(cityarr[0].child[i].name)
        }
        // 获取市 县级数组
        cityNameArray[1] = arr1;
        cityNameArray[2] = arr2;

        this.setData({
          multiIndex: [e.detail.value, 0, 0],
          cityNameArray: cityNameArray
        })
        break;
      case 1:
        var multiIndex = this.data.multiIndex;
        var areaarr = cityArray[multiIndex[0]].child[e.detail.value].child;
        arr2 = [];
        for (var i in areaarr) {
          arr2.push(areaarr[i].name)
        }
        // 获取县级数组
        cityNameArray[2] = arr2;

        multiIndex[1] = e.detail.value;
        multiIndex[2] = 0;
        this.setData({
          multiIndex: multiIndex,
          cityNameArray: cityNameArray
        })
        break;
    }
  },

  // 清空地址
  emptyAddress:function(){
    this.setData({
      cityValue:''
    })
    this.onPullDownRefresh();
  },

  // 清空工种
  emptyKind: function () {
    this.setData({
      workkind: ''
    })
    this.onPullDownRefresh();
  },

  // toptab切换
  switchTab: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      currentId: id
    })
    this.onPullDownRefresh()
  }
})