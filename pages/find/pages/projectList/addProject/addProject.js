// pages/ConstructionCompany/pages/addProject/addProject.js
var app = getApp();
var uploadfun = require('../../../../../utils/upload.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date1: '',
    date2: '',
    merchantsId:'',
    projectActiveTypeArray: [],  // 项目活动类型
    projectActiveType: '',  
    projectTypeArray: [],   // 项目分类
    projectType: '',   
    projectMajorArray: [],  // 是否重点项目
    projectMajor: '',
    cityArray: [], // 接口里的城市数组
    cityNameArray: [[],[],[]], // 要渲染的城市数组
    multiIndex: ['0', '0', '0'], // 城市数组的默认下标
    cityValue: '',  // 选中的城市value值
    
    imglist: [],   //上传图片 视频所需字段（3个）
    file_code: '',  // 上传文件的此批编号
    videoBtnHidden: false  //播放视频覆盖按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getTheme(that);
    // 生成file_code编号
    uploadfun.upload.fileCode(this)

    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          merchantsId: res.data.merchantsId
        })
      },
    })

    // -------调用app.js的获取字典方法-----
    // 活动类型  项目分类  是否重点
    app.getSysCode(
      ['PROJECT_ACTIVE_TYPE', 'PROJECT_TYPE', 'PROJECT_MAJOR'],
      ['projectActiveTypeArray', 'projectTypeArray', 'projectMajorArray'], this);

    // 获取三级联动
    app.post('/syscity/getCity', {}
    ).then((res) => {
      var arr = res.data;
      console.log(arr)
      var cityNameArray = that.data.cityNameArray;
      var pArray = arr,
          cArray = arr[0].child,
          aArray = arr[0].child[0].child;
      for (var i in pArray){
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
    }).catch((error) => {})

  },

  // 单选下拉框
  bindPickerChange: function (e) {
    var types = e.currentTarget.dataset.type;
    app.selectionBox(e, types, this)
  },

  // 日期选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (e.currentTarget.dataset.type == 'date1'){
      this.setData({
        date1: e.detail.value
      })
    }
    if (e.currentTarget.dataset.type == 'date2') {
      this.setData({
        date2: e.detail.value
      })
    }
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
        arr1 = [],arr2 = [];
        for (var i in cityarr){
          arr1.push(cityarr[i].name)
        }
        for (var i in cityarr[0].child) {
          arr2.push(cityarr[0].child[i].name)
        }
        // 获取市 县级数组
        cityNameArray[1] = arr1;    
        cityNameArray[2] = arr2;    
              
        this.setData({
          multiIndex: [e.detail.value,0,0],
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

  // 上传图片 视频方法-------------------------------------------

  // 用来显示一个选择图片和拍照的弹窗
  chooseImageTap: function () {
    uploadfun.upload.chooseImageTap(this)
  },

  // 点击预览图片时播放视频
  bindplayimg: function (e) {
    var idname = e.currentTarget.dataset.idname;
    uploadfun.upload.bindplay(idname, this);
  },

  // 退出全屏时
  bindfullscreenchange: function (e) {
    uploadfun.upload.bindfullscreenchange(e, this)
  },

  // 预览图片
  previewImage: function (e) {
    uploadfun.upload.previewImage(e, this)
  },

  // 删除图片
  deleteImage: function (e) {
    uploadfun.upload.deleteImage(e, this)
  },

  // ---------------------------------------------------------

  // 提交数据
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var formData = e.detail.value;
    formData.merchantsId = this.data.merchantsId;
    formData.lng = '82.566';
    formData.lat = '63.66';
    app.post('/project/add', formData
    ).then((res) => {
      // 返回上一页要刷新
      prevPage.setData({
        refresh: true
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 800)
    }).catch((error) => {})
  }
})