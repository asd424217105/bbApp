// pages/my/pages/info/info.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    theme: 'red',
    id: 0,
    date1: '2016-09-01',
    date2: '2016-09-01',
    POLITICAL_LANDSCAPE: '',
    EDUCATION_LEVEL: '',
    MEDICAL_HISTORY: '',
    WORK_KIND: '',
    sPoliticalLandscape: '',
    sEducationLevel: '',
    sMedicalHistory: '',
    swork_kind: [],//工种值数组
    swork_kindName: [],//工种名字数组
    swork_kindArray: [],//工种选择数组
    swork_kindcache: [],//工种选择缓存数组
    cityArray: [], // 接口里的城市数组
    cityNameArray: [[], [], []], // 要渲染的籍贯数组
    cityNameArray1: [[], [], []], // 要渲染的期望工作范围数组
    multiIndex: ['0', '0', '0'], // 城市数组的默认下标
    multiIndex1: ['0', '0', '0'], // 城市数组的默认下标
    cityValue: '',  // 选中的籍贯value值
    cityValue1: '', // 选中的期望工作范围value值
    realName: '',
    head_img: '../../resources/pic/head_img_default.png',
    cityId1: '',
    showDialog: false
  },

  changeHeadImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      success: function (res) {
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res) {
            console.log(res)
            that.setData({
              head_img: res.path
            })
          }
        })
      }
    })
  },

  goRZ: function () {
    wx.navigateTo({
      url: '../realNameAuthentication/realNameAuthentication',
    })
  },

  //遮罩层选择点击事件
  toggleDialog(e) {
    console.log(e)
    if (e.target.dataset.ifam) {
      this.setData({
        ifAm: e.target.dataset.ifam
      });
    }
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  //选择提交
  pickerSubmit: function (e) {
    var that = this
    if (that.data.swork_kindcache.length > 0) {
      that.setData({
        swork_kind: that.data.swork_kindcache,
        showDialog: !this.data.showDialog
      })
      let array = [];
      for (let i = 0; i < that.data.swork_kindcache.length; i ++) {
        let text = app.getWorkKindArrayText(that.data.WORK_KINDArray, that.data.swork_kindcache[i]);
        array.push(text)
      }
      that.setData({
        swork_kindName: array
      })
    } else {
      that.setData({
        swork_kind: that.data.swork_kind,
        showDialog: !this.data.showDialog
      })
    }
    
  },
  //选择取消
  pickerReset: function () {
    var that = this
    // wx.showModal({
    //   title: '提示',
    //   content: '你没有选择任何内容',
    // })
    that.setData({
      showDialog: !this.data.showDialog,
      value: 'show',
      checked: false,
    })
  },

  //复选框选择事件
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      swork_kindcache: e.detail.value
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

  bindCityPickerChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var pIndex = e.detail.value[0];
    var cIndex = e.detail.value[1];
    var aIndex = e.detail.value[2];
    var cityArray = this.data.cityArray;
    var area = cityArray[pIndex].child[cIndex].child[aIndex];
    this.setData({
      cityValue1: area
    })
    console.log(this.data.cityValue1)
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

  bindCityColumnChange1: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var that = this;
    var cityArray = this.data.cityArray;
    var cityNameArray1 = that.data.cityNameArray1;
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
        cityNameArray1[1] = arr1;
        cityNameArray1[2] = arr2;

        this.setData({
          multiIndex1: [e.detail.value, 0, 0],
          cityNameArray1: cityNameArray1
        })
        break;
      case 1:
        var multiIndex1 = this.data.multiIndex1;
        var areaarr = cityArray[multiIndex1[0]].child[e.detail.value].child;
        arr2 = [];
        for (var i in areaarr) {
          arr2.push(areaarr[i].name)
        }
        // 获取县级数组
        cityNameArray1[2] = arr2;

        multiIndex1[1] = e.detail.value;
        multiIndex1[2] = 0;
        this.setData({
          multiIndex1: multiIndex1,
          cityNameArray1: cityNameArray1
        })
        break;
    }
  },

  /*提交修改*/
  submit: function (e) {
    var that = this;
    let { address, emergencyContact, emergencyContactMobile } = e.detail.value;
    let swork_kind = that.data.swork_kind;
    console.log({
      cityId: that.data.cityValue1.id,
      educationLevel: that.data.EDUCATION_LEVEL.code,
      medicalHistory: that.data.MEDICAL_HISTORY.code,
      emergencyContact: emergencyContact,
      emergencyContactMobile: emergencyContactMobile,
      address: address,
      workBegindate: that.data.date2,
      nativePlace: that.data.cityValue.name_path_level,
      politicalLandscape: that.data.POLITICAL_LANDSCAPE.code,
      workKindIds: swork_kind
    })
    let cityId = that.data.cityId;
    if (!cityId) {
      cityId = that.data.cityValue1.id
    }
    // console.log('cityId')
    // console.log(cityId)
    if (that.data.cityValue.name_path_level !== "暂无籍贯，请选择！" && that.data.sMedicalHistory !== "" && cityId) {
      app.post('/user/edit', {
        cityId: that.data.cityValue1.id,
        educationLevel: that.data.EDUCATION_LEVEL.code,
        medicalHistory: that.data.MEDICAL_HISTORY.code,
        emergencyContact: emergencyContact,
        emergencyContactMobile: emergencyContactMobile,
        address: address,
        workBegindate: that.data.date2,
        nativePlace: that.data.cityValue.name_path_level,
        politicalLandscape: that.data.POLITICAL_LANDSCAPE.code,
        workKindIds: swork_kind
      }).then((res) => {
        wx.showToast({
          title: '修改信息成功！',
        })
        app.post('/home/userInfo', {}).then((res) => {
          console.log(res)
          console.log('修改成功更新globalData和本地储存的userinfo');
          wx.setStorageSync('userInfo', res.data);
          app.globalData.userInfo = res.data;
        }).catch((error) => {
          console.log('更新globalData和本地储存的userinfo失败');
        })
      }).catch((error) => {

      })
    } else {
      wx.showToast({
        title: '必填项不能为空！',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getTheme(that);
    app.getSysCode(
      ['SEX', 'POLITICAL_LANDSCAPE', 'EDUCATION_LEVEL', 'MEDICAL_HISTORY'],
      ['SEXArray', 'POLITICAL_LANDSCAPEArray', 'EDUCATION_LEVELArray', 'MEDICAL_HISTORYArray'], that);
    if (options.id) {
      that.setData({
        id: options.id
      })
    }
    if (options.userid) {
      that.setData({
        userid: options.userid
      })
    }

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
        cityNameArray: cityNameArray,
        cityNameArray1: cityNameArray
      })
    }).catch((error) => { })
    
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
    var that = this;
    //获取工种成功后给列表赋值
    app.post('/sysworkkind/list', {}).then((res) => {
      console.log('获取工种成功！')
      console.log(res)
      that.setData({
        WORK_KINDArray: res.data,
      })
      wx.getStorage({
        key: 'userInfo',
        success: function (res) {
          console.log(res)
          let sex = app.getOneCodeArrayText(that.data.SEXArray, res.data.sex);
          let political_landscape = app.getOneCodeArrayText(that.data.POLITICAL_LANDSCAPEArray, res.data.political_landscape);
          let education_level = app.getOneCodeArrayText(that.data.EDUCATION_LEVELArray, res.data.education_level);
          let medical_history = app.getOneCodeArrayText(that.data.MEDICAL_HISTORYArray, res.data.medical_history);
          let work_status = app.getWorkKindArrayText(that.data.WORK_KINDArray, res.data.work_status);
          let city = "";
          let city1 = "";
          if (res.data.native_place) {
            city = { name_path_level: res.data.native_place };
          } else {
            city = { name_path_level: '暂无籍贯，请选择！' };
          }
          if (res.data.city_name) {
            city1 = { name_path_level: res.data.city_name };
          } else {
            city1 = { name_path_level: '暂无希望范围，请选择！' };
          }
          console.log(res.data.work_status)
          app.post('/userWorkKind/list', {}).then((res) => {
            console.log('获取个人工种列表成功！')
            console.log(res)
            let array = [];
            let nameArray = [];
            let idArray = [];
            for (let i = 0; i < res.data.length; i++) {
              array.push(res.data[i])
              nameArray.push(res.data[i].kind_name)
              idArray.push(res.data[i].kind_id)
            }
            console.log(array)
            let workArray = that.data.WORK_KINDArray;
            console.log(workArray.length)
            for (let i = 0; i < workArray.length; i++) {
              for (let j = 0; j < array.length; j++) {
                if (workArray[i].id == array[j].kind_id) {
                  workArray[i].checked = true
                }
              }
            }

            that.setData({
              swork_kindArray: array,
              WORK_KINDArray: workArray,
              swork_kind: idArray,
              swork_kindName: nameArray
            })
            console.log("chenggong")
            console.log(that.data.WORK_KINDArray)
          }).catch((error) => {

          })
          let img = "";
          if (res.data.head_img) {
            img = res.data.head_img
          } else {
            img = that.data.head_img
          }
          that.setData({
            head_img: img,
            realName: res.data.real_name,
            cardType: '身份证',
            idCard: res.data.id_card,
            // SEX: { code: res.data.sex, text: sex },
            sex: sex,
            nation: res.data.national,
            Bdate: res.data.birth_day,
            cityValue: city,
            cityValue1: city1,
            cityId: res.data.city_id,
            address: res.data.address,
            certification_status: res.data.certification_status,
            POLITICAL_LANDSCAPE: { code: res.data.political_landscape, text: political_landscape },
            sPoliticalLandscape: res.data.political_landscape,
            mobile: res.data.mobile,
            EDUCATION_LEVEL: { code: res.data.education_level, text: education_level },
            sEducationLevel: res.data.education_level,
            MEDICAL_HISTORY: { code: res.data.medical_history, text: medical_history },
            sMedicalHistory: res.data.medical_history,
            // WORK_KIND: { id: res.data.work_status, kind_name: work_status },
            // swork_kind: res.data.work_status,
            date2: res.data.work_begindate,
            emergencyContact: res.data.emergency_contact,
            emergencyContactMobile: res.data.emergency_contact_mobile
          })
          console.log(that.data)
        },
      })
    }).catch((error) => {

    })

    console.log(that.data.id)
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
    var that = this;
    //获取工种成功后给列表赋值
    app.post('/sysworkkind/list', {}).then((res) => {
      console.log('获取工种成功！')
      console.log(res)
      that.setData({
        WORK_KINDArray: res.data,
      })
      wx.getStorage({
        key: 'userInfo',
        success: function (res) {
          console.log(res)
          let sex = app.getOneCodeArrayText(that.data.SEXArray, res.data.sex);
          let political_landscape = app.getOneCodeArrayText(that.data.POLITICAL_LANDSCAPEArray, res.data.political_landscape);
          let education_level = app.getOneCodeArrayText(that.data.EDUCATION_LEVELArray, res.data.education_level);
          let medical_history = app.getOneCodeArrayText(that.data.MEDICAL_HISTORYArray, res.data.medical_history);
          let work_status = app.getWorkKindArrayText(that.data.WORK_KINDArray, res.data.work_status);
          let city = "";
          let city1 = "";
          if (res.data.native_place) {
            city = { name_path_level: res.data.native_place };
          } else {
            city = { name_path_level: '暂无籍贯，请选择！' };
          }
          if (res.data.city_name) {
            city1 = { name_path_level: res.data.city_name };
          } else {
            city1 = { name_path_level: '暂无希望范围，请选择！' };
          }
          console.log(res.data.work_status)
          app.post('/userWorkKind/list', {}).then((res) => {
            console.log('获取个人工种列表成功！')
            console.log(res)
            let array = [];
            let nameArray = [];
            let idArray = [];
            for (let i = 0; i < res.data.length; i++) {
              array.push(res.data[i])
              nameArray.push(res.data[i].kind_name)
              idArray.push(res.data[i].kind_id)
            }
            console.log(array)
            let workArray = that.data.WORK_KINDArray;
            console.log(workArray.length)
            for (let i = 0; i < workArray.length; i++) {
              for (let j = 0; j < array.length; j++) {
                if (workArray[i].id == array[j].kind_id) {
                  workArray[i].checked = true
                }
              }
            }

            that.setData({
              swork_kindArray: array,
              WORK_KINDArray: workArray,
              swork_kind: idArray,
              swork_kindName: nameArray
            })
            console.log("chenggong")
            console.log(that.data.WORK_KINDArray)
          }).catch((error) => {

          })
          let img = "";
          if (res.data.head_img) {
            img = res.data.head_img
          } else {
            img = that.data.head_img
          }
          that.setData({
            head_img: img,
            realName: res.data.real_name,
            cardType: '身份证',
            idCard: res.data.id_card,
            // SEX: { code: res.data.sex, text: sex },
            sex: sex,
            nation: res.data.national,
            Bdate: res.data.birth_day,
            cityValue: city,
            cityValue1: city1,
            cityId: res.data.city_id,
            address: res.data.address,
            certification_status: res.data.certification_status,
            POLITICAL_LANDSCAPE: { code: res.data.political_landscape, text: political_landscape },
            sPoliticalLandscape: res.data.political_landscape,
            mobile: res.data.mobile,
            EDUCATION_LEVEL: { code: res.data.education_level, text: education_level },
            sEducationLevel: res.data.education_level,
            MEDICAL_HISTORY: { code: res.data.medical_history, text: medical_history },
            sMedicalHistory: res.data.medical_history,
            // WORK_KIND: { id: res.data.work_status, kind_name: work_status },
            // swork_kind: res.data.work_status,
            date2: res.data.work_begindate,
            emergencyContact: res.data.emergency_contact,
            emergencyContactMobile: res.data.emergency_contact_mobile
          })
          console.log(that.data)
        },
      })
    }).catch((error) => {

    })

    console.log(that.data.id)
    wx.stopPullDownRefresh();
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