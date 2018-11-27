// pages/my/pages/companyInfo/companyInfo.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    theme: 'red',
    id: 0,
    CORP_TYPE: '',
    CORP_TYPEArray: [],
    sCorpCjtype: '',
    cityArray: [], // 接口里的城市数组
    cityNameArray: [[], [], []], // 要渲染的籍贯数组
    multiIndex: ['0', '0', '0'], // 城市数组的默认下标
    cityValue: '',  // 选中的籍贯value值
    legalPersonImg: '../../resources/pic/head_img_default.png',
    qualificationsImg: '../../resources/pic/head_img_default.png',
    cityId: ''
  },

  goRZ: function () {
    wx.navigateTo({
      url: '../realNameAuthentication/realNameAuthentication',
    })
  },

  // 单选下拉框
  bindPickerChange: function (e) {
    var types = e.currentTarget.dataset.type;
    app.selectionBox(e, types, this)
    console.log(this.data)
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

  previewImage: function (e) {
    uploadfun.upload.previewIdCardImage(e, this)
  },

  /*提交修改*/
  submit: function (e) {
    var that = this;
    let corpName = e.detail.value.corpName;
    let sCorpCjtype = that.data.sCorpCjtype;
    app.post('/corpMerchants/edit', {
      cityId: that.data.cityId,
      corpName: corpName,
      corpCjtype: sCorpCjtype,
      corp_furl: qualificationsImg
    }).then((res) => {
      wx.showToast({
        title: '修改信息成功！',
      })
    }).catch((error) => {

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getTheme(that)
    app.getSysCode(
      ['CORP_TYPE'],
      ['CORP_TYPEArray'], that);

    // 获取三级联动
    app.post('/syscity/getCity', {}
    ).then((res) => {
      var arr = res.data;
      console.log('获取三级联动成功！')
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
    console.log({ id: app.globalData.userInfo.merchantsId })
    app.post('/corpMerchants/getMerchants', { id: app.globalData.userInfo.merchantsId }).then((res) => {
      let corp_type = app.getOneCodeArrayText(that.data.CORP_TYPEArray, res.data.corp_type);
      that.setData({
        corpName: res.data.corp_name,
        corpCode: res.data.corp_code,
        legalPerson: res.data.legal_person,
        legalPersonIdentify: res.data.legal_person_identify,
        legalPersonMobile: res.data.legal_person_mobile,
        CORP_TYPE: { code: res.data.corp_type, text: corp_type },
        sCorpType: res.data.corp_type,
        cityValue: {
          id: res.data.cityId,
          name_path_level: res.data.city_name
        }
      })
      if (res.data.file_list.length > 0) {
        that.setData({
          licenseImg: res.data.file_list[0].newFilename,
          fileIdLicense: res.data.file_list[0].id,
          file_code: res.data.file_code
        })
      }
    }).catch((error) => {

    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})