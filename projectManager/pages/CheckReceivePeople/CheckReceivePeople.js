// pages/ConstructionCompany/pages/CheckReceivePeople/CheckReceivePeople.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    id: '',
    list: [],
    usertype:'',
    userIds: '',
    userNames: ''
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    var that = this;
    app.getTheme(that);
    var id = options.id;
    that.setData({
      id: id
    })
    // 获取身份
    app.getUserType(that,function(){
      that.getProjectUserlist();
    })
    
  },

  // 项目经理获取接受人信息 -- 项目部调用
  getProjectUserlist: function () {
    var that = this;
    var id = this.data.id;
    var usertype = this.data.usertype;
    if(usertype == 2){
      // 项目经理获取接受人信息 -- 项目部调用
      app.post('/thingApply/mercAdmin',
        {
          projectId: id
        }).then((res) => {
          var reslist = res.data;
          that.setData({
            list: reslist
          })
        }).catch((error) => { })
    }
    if (usertype == 3) {
      // 八大员获取接受人信息 -- 项目部调用
      app.post('/report/deptAdmin',
        {
          projectId: id
        }).then((res) => {
          var reslist = res.data;
          that.setData({
            list: reslist
          })
        }).catch((error) => { })
    }
  },

  // 多选框
  // checkboxChange: function (e) {
  //   console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  //   var list = this.data.list;
  //   var name=[];
  //   if (list.id == e.detail.value) {
  //     name[0] = list.realName
  //   }
  //   this.setData({
  //     userIds: e.detail.value,
  //     userNames: name
  //   })
  //   console.log('选择的id：', this.data.userIds)
  //   console.log('选择的name：', this.data.userNames)
  // },

  // 多选框
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var idArr = e.detail.value;
    // id去重
    idArr = this.uniques(idArr)
    var list = this.data.list;
    var nameArr = [];

    for (var z in idArr) {
      var id = idArr[z];
      for (var i in list) {
        // 判断是否存在二级数组user
        if (list[i].user) {
          for (var y in list[i].user) {
            if (id == list[i].user[y].userId) {
              nameArr.push(list[i].user[y].realName)
            }
          }
        } else {
          if (id == list[i].id) {
            nameArr.push(list[i].userName || list[i].realName)
          }
        }

      }
    }

    // 名字去重
    nameArr = this.uniques(nameArr)
    this.setData({
      userIds: idArr,
      userNames: nameArr
    })
    console.log(this.data.userIds)
    console.log(this.data.userNames)
  },

  // 数组去重
  uniques: function (arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (newArr.indexOf(arr[i]) == -1) {
        console.log(arr[i])
        newArr.push(arr[i]);
      }
    }
    return newArr;
  },


  // 确定
  toOk: function () {
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var userIds = this.data.userIds;
    var userNames = this.data.userNames;

    // 返回上一页要刷新
    prevPage.setData({
      userIds: userIds,
      userNames: userNames,
    })
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
    }, 800)
  }

})