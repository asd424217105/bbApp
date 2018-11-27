// pages/ConstructionCompany/pages/CheckReceivePeople/CheckReceivePeople.js
var app = getApp();

Page({
  // 页面的初始数据
  data: {
    id: '',
    projectId: '',  // 项目id 用于新建申请  汇报是选择接收人
    items: [
      { name: 'all', value: '全选' },
    ],
    list: [],
    idArr: [],
    nameArr: [],
    userIdsName:[]
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    app.getTheme(this);
    var id = options.id;
    this.setData({
      id: id
    })
    if (options.projectId) {
      this.setData({
        projectId: options.projectId
      })
      this.getUserlist2();
    }else{
      this.getUserlist();
    }  
  },

  // 获取接收人信息列表 -- 班组长调用  （验收）
  getUserlist: function () {
    var that = this;
    var id = this.data.id;
    // 获取接收人信息列表（全为项目管理人员）与获取项目人员配置列表相同
    app.post('/project/userListByTaskId',
      {
        id: id
      }).then((res) => {
        var reslist = res.data;
        that.setData({
          list: reslist
        })
      }).catch((error) => {

      })
  },

  // 获取接收人信息列表 -- 班组长调用  （汇报 申请）
  getUserlist2: function () {
    var that = this;
    var projectId = this.data.projectId;
    // 获取接收人信息列表（全为项目管理人员）与获取项目人员配置列表相同
    app.post('/project/userlist',
      {
        id: projectId
      }).then((res) => {
        var reslist = res.data;
        that.setData({
          list: reslist
        })
      }).catch((error) => {

      })
  },

  // 全选框
  checkboxAll: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var list = this.data.list;
    var idArr = [];
    var nameArr = [];
    if (e.detail.value[0] == 'all') {
      for (var i in list) {
        for(var y in list[i].user){
          list[i].user[y].checked = true;
          idArr.push(list[i].user[y].userId)
          nameArr.push(list[i].user[y].realName)
        }       
      }
      this.setData({
        list: list,
        idArr: idArr,
        nameArr: nameArr
      })
    }
    if (e.detail.value.length == '0') {
      for (var i in list) {
        for (var y in list[i].user) {
          list[i].user[y].checked = false;
        }  
      }
      this.setData({
        list: list,
        idArr: [],
        nameArr: []
      })
    }
    console.log(this.data.idArr)
    console.log(this.data.nameArr)
  },

  // 多选框
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var idArr = e.detail.value;
    // id去重
    idArr = this.uniques(idArr)
    var list = this.data.list;
    var nameArr = [];
    for (var z in idArr){
      var id = idArr[z];
      for (var i in list) {
        for (var y in list[i].user) {
          if (id == list[i].user[y].userId){
            nameArr.push(list[i].user[y].realName)
          }
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
  uniques: function (arr){
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