// pages/foreman/pages/findWorkers/findWorkers.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId:'',
    date1: '',
    date2: '',
    isOpenArray: [
      { 'id': 0, 'text': '邀约' },
      { 'id': 1, 'text': '公开' }
    ],
    isOpen: '',
    settlementTypeArray: [],
    settlementType: '',
    settlementUnitArray: [],
    settlementUnit: '',
    workkindArray: [],  // 工种
    workkind: [],
    cityArray: [], // 接口里的城市数组
    cityNameArray: [[], [], []], // 要渲染的城市数组
    multiIndex: ['0', '0', '0'], // 城市数组的默认下标
    cityValue: '',  // 选中的城市value值
    address: '',

    imglist: [],   //上传图片 视频所需字段（3个）
    file_code: '',  // 上传文件的此批编号
    videoBtnHidden: false  //播放视频覆盖按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    app.getTheme(that);
    var taskId = options.id;
    this.setData({
      taskId: taskId
    })

    // 获取上级地理位置
    app.post('/projecttask/get', {
      id: taskId
    }
    ).then((res) => {
      console.log(res)
      var cityId = res.data.projectTask.cityId;
      var cityName = res.data.projectTask.cityName;
      var address = res.data.projectTask.address;
      var ob = {};
      ob.name_path_level = cityName;
      ob.id = cityId;
      console.log(ob)
      that.setData({
        cityValue: ob,
        address: address
      })
    }).catch((error) => { })  

    // 生成file_code编号
    uploadfun.upload.fileCode(this)

    // -------调用app.js的获取字典方法-----
    // 活动类型  项目分类  是否重点
    app.getSysCode(
      ['SETTLEMENT_TYPE','SETTLEMENT_UNIT'],
      ['settlementTypeArray','settlementUnitArray'], this);

    // 获取系统工种
    app.post('/sysworkkind/list',{}
    ).then((res) => {
      console.log(res)
      var arr = res.data;
      arr.unshift({'kind_name':'清空工种','id':'00'})
      that.setData({
        workkindArray: arr
      })
    }).catch((error) => { })  

    // 获取三级联动
    app.post('/syscity/getCity', {}
    ).then((res) => {
      var arr = res.data;
      console.log(arr)
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

  },

  // 是否公开
  bindIsOpen: function (e) {
    var index = e.detail.value;
    var isOpenArray = this.data.isOpenArray;
    this.setData({
      isOpen: isOpenArray[index]
    })
  },
  // 结算方式
  bindSettlementType: function (e) {
    var index = e.detail.value;
    var settlementTypeArray = this.data.settlementTypeArray;
    this.setData({
      settlementType: settlementTypeArray[index]
    })
  },

  // 结算方式
  bindPickerChange: function (e) {
    var types = e.currentTarget.dataset.type;
    app.selectionBox(e, types, this)
  },
  
  // 工种
  bindworkkind: function (e) {
    var index = e.detail.value;
    if (index == 0){
      this.setData({
        workkind: []
      })
      wx.showToast({
        title: '清空成功',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var workkindArray = this.data.workkindArray;
    var workkind = this.data.workkind;
    var arr = [];
    arr.push(workkindArray[index]);
    workkind.push.apply(workkind, arr);
    this.setData({
      workkind: workkind
    })
  },

  // 日期选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (e.currentTarget.dataset.type == 'date1') {
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
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var formData = e.detail.value;
    formData.lng = '82.566';
    formData.lat = '63.66';

    // 工种数组转字符串
    var arr = [];
    var workkinds = this.data.workkind;
    for (var i in workkinds){
      arr.push(workkinds[i].id)
    }
    var workKindIds = arr.join(',');
    formData.workKindIds = workKindIds;
    console.log(formData)

    // 判断是否存在未填项
    for (var i in formData) {
      if (!formData[i]) {
        wx.showToast({
          title: '存在未填项',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    
    // 新增任务号召
    app.post('/taskcall/add', formData
    ).then((res) => {
      var id = res.data.callId;
      wx.showModal({
        title: '提示',
        content: '发布成功',
        cancelText: '邀约',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            // 返回上一页要刷新
            prevPage.setData({
              refresh: true
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 800)
          } else if (res.cancel) {
            console.log('用户点击邀约')        
            // 跳转到邀约工人页面
            wx.redirectTo({
              url: '../InvitationsList/InvitationsList?id=' + id + '',
            })
          }
        }
      })
    }).catch((error) => { })

  }
})