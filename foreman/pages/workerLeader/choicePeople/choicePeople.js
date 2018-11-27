// pages/ConstructionCompany/pages/CheckReceivePeople/CheckReceivePeople.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    id: '',
    list: [],
    idArr: [],
    nameArr: [],
    userIdsName: []
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    app.getTheme(this);
    var id = options.id;
    this.setData({
      id: id
    })
    this.getUserlist();
  },

  // 正在进行中的班组长的工人列表 -- 班组长调用
  getUserlist: function () {
    var that = this;
    var id = this.data.id;
    // 正在进行中的班组长的工人列表
    app.post('/callPerson/listWorkIngSec',
      {
        taskId: id
      }).then((res) => {
        var reslist = res.data;
        that.setData({
          list: reslist
        })
      }).catch((error) => {

      })
  },

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
        if (id == list[i].userId) {
          nameArr.push(list[i].realName)
        }
      }
    }
    // 名字去重
    nameArr = this.uniques(nameArr)
    this.setData({
      idArr: idArr,
      nameArr: nameArr
    })
    console.log(this.data.idArr)
    console.log(this.data.nameArr)
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
    var idArr = this.data.idArr;
    var nameArr = this.data.nameArr;

    // 返回上一页要刷新
    prevPage.setData({
      userIds: idArr,
      userNames: nameArr,
    })
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
    }, 800)
  }

})