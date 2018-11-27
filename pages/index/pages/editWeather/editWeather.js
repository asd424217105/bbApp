// pages/index/pages/editWeather/editWeather.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: 'red',
    amWeather: -1,
    pmWeather: -1,
    amWeatherVal: -1,
    pmWeatherVal: -1,
    amTemperature: '29',
    pmTemperature: '26',
    amWindPower: '1',
    pmWindPower: '2',
    userName: '',
    weatherArray: [],
    showDialog: false,
    weatherSelectArray: [],
    ifAm: false,
    year: '',
    month: '',
    day: ''
  },
  //遮罩层选择点击事件
  toggleDialog(e) {
    console.log(e)
    if (e.target.dataset.ifam){
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
    if (that.data.ifAm == 0){
      that.setData({
        amWeatherVal: e.target.dataset.weather,
        amWeather: this.getSomeOneArrayText(this.data.weatherArray, e.target.dataset.weather),
      })
    } else if (that.data.ifAm == 1){
      that.setData({
        pmWeatherVal: e.target.dataset.weather,
        pmWeather: this.getSomeOneArrayText(this.data.weatherArray, e.target.dataset.weather),
      })
    }
    that.setData({
      showDialog: !that.data.showDialog
    })
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
  //提交修改
  editSubmit: function (e) {
    console.log(e)
    console.log('提交')
    var that = this
    that.setData({
      amTemperature: e.detail.value.amTemperatureVal,
      amWindPower: e.detail.value.amWindPowerVal,
      pmTemperature: e.detail.value.pmTemperatureVal,
      pmWindPower: e.detail.value.pmWindPowerVal
    })
    let cdate = that.data.year + '-' + that.data.month + '-' + that.data.day;
    if (that.data.amWeatherVal >= 0) {
      app.post('/userWeather/add', { 
        weatherType: that.data.amWeatherVal, 
          amPm: 0, 
          wdate: cdate, 
          tem: that.data.amTemperature, 
          wind: that.data.amWindPower
        }).then((res) => {
        console.log('上午添加成功！')
          if (that.data.pmWeatherVal >= 0){

        }else{
          wx.navigateBack({
            delta: 1
          })
        }
      }).catch((error) => {
        console.log('上午添加失败！')
      })
    }
    if (that.data.pmWeatherVal >= 0) {
      app.post('/userWeather/add', { 
        weatherType: that.data.pmWeatherVal, 
          amPm: 1, 
          wdate: cdate, 
          tem: that.data.pmTemperature, 
          wind: that.data.pmWindPower 
        }).then((res) => {
        console.log('下午添加成功！')
        wx.navigateBack({
          delta: 1
        })
      }).catch((error) => {
        console.log('下午添加失败！')
      })
    }
    
  },
  //获取某个数组对应参数字典text
  getSomeOneArrayText: (codeArray, code) => {
    let text = '';
    for (var i = 0; i < codeArray.length; i++) {
      if (codeArray[i].code == code) {
        text = codeArray[i].text
      }
    }
    return text;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var data = JSON.parse(options.data);
    var that = this;
    console.log(data)
    app.getTheme(that)
    // wx.getStorage({
    //   key: 'userTheme',
    //   success: function(res) {
    //     console.log(res.data)
    //     that.setData({
    //       theme: res.data,
    //       showDialog: false
    //     })
    //     console.log('zheshi:' + res.data == 'yellow' ? '#FE3F44' : res.data == 'red' ? '#FEBA01' : res.data == 'blue' ? '#169CD9' : '')
    //     wx.setNavigationBarColor({
    //       frontColor: '#000000',
    //       backgroundColor: res.data == 'yellow' ? '#FEBA01' : res.data == 'red' ? '#FE3F44' : res.data == 'blue' ? '#169CD9' : ''
    //     })
    //   },
    // })
    if(data){
      that.setData(data);
    }

    this.setData({
      calendarSValue: [this.data.year - 1950, this.data.month - 1, this.data.day - 1]
    })

    app.post('/common/sysParam/getSysCode', {}).then((res) => {
      console.log('获取参数字典成功！')
      console.log(res)
      this.setData({
        weatherSelectArray: app.getCodeArray(res.data, 'WEATHER'),//天气
      })
      console.log(app.getCodeArray(res.data, 'WEATHER'))
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