// pages/template/date/date.js
var app = getApp();
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var week = date.getDay();
var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
week = weekday[week];
const years = []
const months = []
const days = []

for (let i = 1950; i <= year + 2; i++) {
  years.push(i)
  year % 100 == 0 ? (year % 400 == 0 ? 1 : 0) : (year % 4 == 0 ? 1 : 0)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}
// var firstDay = new Date('2018 ,08 ,01 00:00:00');


Page({

  /**
   * 页面的初始数据current
   */
  data: {
    calendarDate: [
      {
        list: '',
        isDay: false
      }
    ],
    year: year,
    month: month,
    day: day,
    years: years,
    months: months,
    days: days,
    selectYear: year,
    selectMonth: month,
    selectDay: day,
    week: week,
    calendarSValue: [0, 0, 0],
    showDialog: false,
    theme: 'red',
    amWeather: -1,
    pmWeather: -1,
    amTemperature: '',
    pmTemperature: '',
    amWindPower: '',
    pmWindPower: '',
    amWeatherVal: -1,
    pmWeatherVal: -1,
    userName: '',
    weatherArray: [],
    ifHasWeather: true
  },
  is_leap: function (year) {
    return (year % 100 == 0 ? (year % 400 == 0 ? 1 : 0) : (year % 4 == 0 ? 1 : 0));
  }, //是否为闰年
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(this.data.year)
    // console.log(this.data.month)
    // console.log(this.data.day)
    // this.setData({
    //   theme: app.globalData.userInfo.userType
    // })
    
  },
  getDates: function (nYear, nMonth) {
    let cYear = nYear ? nYear : year;
    let cMonth = nMonth ? nMonth : month;
    let firstDay = new Date(cYear + '/' + cMonth + '/ 1');//苹果手机只识别2018/10/8这样的格式，2018-10-8或者2018,10,8这样的只有安卓识别
    //mydata=data.replace(/-/g, '/');转换的正则
    wx.setStorageSync('selectDate', {
      year: cYear,
      month: cMonth,
      day: this.data.day
    })
    // console.log('打印时间数据')
    // console.log(cYear + '-' + cMonth + '-' + day)
    // console.log(firstDay)
    // console.log(firstDay.getDay())
    let dateArray = [];
    // console.log('闰年判断')
    // console.log(this.is_leap(cYear))
    let monthLength = [31, 28 + this.is_leap(cYear), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (var i = 0; i < 42; i++) {
      // console.log(monthLength[8])
      // console.log(i)
      // console.log(firstDay.getDay())
      // console.log(i + 1 - firstDay.getDay())
      let thisday = new Date(cYear + '/' + cMonth + '/' + (i - firstDay.getDay()));
      let thisdatStr = thisday.toString();
      if (i + 1 - firstDay.getDay() > 0 && i + 1 - firstDay.getDay() <= monthLength[cMonth - 1]) {
        dateArray.push({
          list: i + 1 - firstDay.getDay(),
          val: i + 1 - firstDay.getDay()
        })

      } else if (i + 1 - firstDay.getDay() <= 0) {
        if (cMonth - 1 <= 0) {
          dateArray.push({
            list: monthLength[11] + (i + 1 - firstDay.getDay()),
            val: '',
            other: true
          })
        } else {
          dateArray.push({
            list: monthLength[cMonth - 2] + (i + 1 - firstDay.getDay()),
            val: '',
            other: true
          })
        }

      } else if (i + 1 - firstDay.getDay() > monthLength[cMonth - 1]) {
        if (cMonth - 1 >= 11) {
          dateArray.push({
            list: (i - (monthLength[cMonth - 1] - monthLength[0] - 1) - firstDay.getDay()) - monthLength[0],
            val: '',
            other: true
          })
        } else {
          dateArray.push({
            list: (i - (monthLength[cMonth - 1] - monthLength[cMonth] - 1) - firstDay.getDay()) - monthLength[cMonth],
            val: '',
            other: true
          })
        }

      }


      // console.log(thisdatStr)
    }
    this.setData({
      calendarDate: dateArray
    })
  },
  //上月点击事件
  lastMonth: function (e) {
    // console.log('上月点击')
    // console.log(this.data.year - 1)
    // console.log(this.data.month - 1)
    if (this.data.month - 1 <= 0) {
      this.getDates(this.data.year - 1, 12);
      this.setData({
        year: this.data.year - 1,
        month: 12,
        calendarSValue: [this.data.year - 1950 - 1, 11, this.data.day - 1],
        selectMonth: 12,
        selectYear: this.data.year - 1,
        week: weekday[new Date((this.data.year - 1) + '/12' + '/' + this.data.day).getDay()]
      })
    } else {
      this.getDates(this.data.year, this.data.month - 1);
      this.setData({
        month: this.data.month - 1,
        calendarSValue: [this.data.year - 1950, this.data.month - 2, this.data.day - 1],
        selectMonth: this.data.month - 1,
        week: weekday[new Date(this.data.year + '/' + (this.data.month - 1) + '/' + this.data.day).getDay()]
      })
    }
    this.getWeather()
  },
  //下月点击事件
  netxMonth: function (e) {
    if (this.data.month + 1 > 12) {
      this.getDates(this.data.year + 1, 1);
      this.setData({
        year: this.data.year + 1,
        month: 1,
        calendarSValue: [this.data.year - 1950 + 1, 0, this.data.day - 1],
        selectMonth: 1,
        selectYear: this.data.year + 1,
        week: weekday[new Date((this.data.year + 1) + '/1' + '/' + this.data.day).getDay()]
      })
    } else {
      this.getDates(this.data.year, this.data.month + 1);
      this.setData({
        month: this.data.month + 1,
        calendarSValue: [this.data.year - 1950, this.data.month, this.data.day - 1],
        selectMonth: this.data.month + 1,
        week: weekday[new Date(this.data.year + '/' + (this.data.month + 1) + '/' + this.data.day).getDay()]
      })
    }
    this.getWeather()
  },
  //中间年月日点击事件
  calendarTitleClick: function (e) {

  },
  //日期选择框选择事件
  DateChange: function (e) {
    const val = e.detail.value
    let year = this.data.years[val[0]]
    let month = this.data.months[val[1]]
    let day = this.data.days[val[2]]
    // console.log('改变')
    // console.log(this.data.calendarSValue[1])
    // console.log(val[1])
    if (this.data.calendarSValue[0] != val[0]) {
      // console.log('ChangeYear')
      // console.log('年年' + this.data.years[val[0]])
      // console.log('月月' + this.data.months[val[1]])
      // console.log('日日' + this.data.days[val[2]])
      this.setData({
        selectYear: this.data.years[val[0]],
        calendarSValue: [val[0], val[1], val[2]]
        // month: this.data.months[val[1]],
        // day: this.data.days[val[2]]
      })


    }
    let monthLength = [31, 28 + this.is_leap(this.data.year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (this.data.calendarSValue[1] != val[1]) {
      // console.log('ChangeMonth')
      // console.log('年：'+val[0])
      // console.log('月：' +val[1])
      // console.log('日：' +val[2])
      // console.log('天数' + monthLength[val[1]])
      let array = [];
      for (let i = 1; i <= monthLength[val[1]]; i++) {
        array.push(i)
      }
      this.setData({
        days: array,
        // year: this.data.years[val[0]],
        selectMonth: this.data.months[val[1]],
        calendarSValue: [val[0], val[1], val[2]]
        // day: this.data.days[val[2]]
      })
    }
    if (this.data.calendarSValue[2] != val[2]) {
      this.setData({
        // year: this.data.years[val[0]],
        // month: this.data.months[val[1]],
        selectDay: this.data.days[val[2]],
        calendarSValue: [val[0], val[1], val[2]]
      })
    }

  },
  //日历点击事件
  calendarClick: function (e) {
    if (e.currentTarget.dataset.val) {
      this.setData({
        day: e.currentTarget.dataset.val,
        calendarSValue: [this.data.year - 1950, this.data.month - 1, e.currentTarget.dataset.val - 1],
        selectDay: e.currentTarget.dataset.val,
        week: weekday[new Date(this.data.year + '/' + this.data.month + '/' + e.currentTarget.dataset.val).getDay()]
      })
      wx.setStorageSync('selectDate', {
        year: this.data.year,
        month: this.data.day,
        day: this.data.day
      })
      this.getWeather()
    }
    // console.log(e.currentTarget.dataset)
  },
  //遮罩层选择点击事件
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  //选择提交
  pickerSubmit: function () {
    var that = this
    if (this.data.value == 'show') {
      // wx.showModal({
      //   title: '提示',
      //   content: '你没有选择任何内容',
      // })
    }
    that.setData({
      showDialog: !this.data.showDialog,
      year: this.data.selectYear,
      month: this.data.selectMonth,
      day: this.data.selectDay,
      week: weekday[new Date(this.data.selectYear + '/' + this.data.selectMonth + '/' + this.data.selectDay).getDay()]
    })
    this.getDates(this.data.year, this.data.month);
    this.getWeather()
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
  //获取天气
  getWeather: function () {
    let curdate = this.data.year + '-' + this.data.month + '-' + this.data.day;
    console.log('选择的日期！')
    console.log(curdate)
    app.post('/userWeather/list', { curdate: curdate}).then((res) => {
      console.log('获取天气成功！！！')
      console.log(res)
      if (res.data.length <= 0) {
        console.log("没有天气！")
        this.setData({
          ifHasWeather: false,
          amWeather: -1,
          pmWeather: -1,
          amTemperature: '',
          pmTemperature: '',
          amWindPower: '',
          pmWindPower: '',
          amWeatherVal: -1,
          pmWeatherVal: -1
        })
        return;
      }
      for(let i = 0; i < res.data.length; i++){
        if (res.data[i].am_pm == 0) {
          this.setData({
            amWeatherVal: res.data[i].weather_type,
            amWeather: this.getSomeOneArrayText(this.data.weatherArray, res.data[i].weather_type),
            amTemperature: res.data[i].tem,
            amWindPower: res.data[i].wind
          })
        } else if (res.data[i].am_pm == 1) {
          this.setData({
            pmWeatherVal: res.data[i].weather_type,
            pmWeather: this.getSomeOneArrayText(this.data.weatherArray, res.data[i].weather_type),
            pmTemperature: res.data[i].tem,
            pmWindPower: res.data[i].wind
          })
        } else {

        }
      }
      this.setData({ 
        userName: app.globalData.userInfo.real_name,
        ifHasWeather: true
      })
    }).catch((error) => {
      console.log('获取天气失败！！！')
    })
  },
  //获取对应参数字典
  getCodeArray: (codeArray, key) => {
    let array = [];
    for (var i = 0; i < codeArray.length; i++) {
      if (codeArray[i].list == key) {
        array.push(codeArray[i])
      }
    }
    return array;
  },
  //获取对应参数字典text
  getCodeArrayText: (codeArray, key, code) => {
    let text = '';
    for (var i = 0; i < codeArray.length; i++) {
      if (codeArray[i].list == key && codeArray[i].code == code) {
        text = codeArray[i].text
      }
    }
    return text;
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
  // 跳转到编辑天气页面
  editWeather: function () {
    // wx.navigateTo({
    //   url: '../../pages/editWeather/editWeather?year=' + this.data.year + '&month=' + this.data.month + '&day=' + this.data.day + '&week=' + this.data.week + '&amWeather=' + this.data.amWeather + '&amTemperature=' + this.data.amTemperature +'&amWindPower='+this.data.amWindPower,
    // })
    var data = JSON.stringify(this.data);
    wx.navigateTo({
      url: '../../pages/editWeather/editWeather?data=' + data,
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
    var that = this;
    app.getTheme(that)
    // wx.getStorage({
    //   key: 'userType',
    //   success: function(res) {
    //     // 给主题和用户状态赋值
    //     that.setData({
    //       userType: res.data,
    //       theme: res.data == 0 ? 'yellow' : res.data == 1 || res.data == 2 || res.data == 3 ? 'red' : res.data == 4 ? 'blue' : ''
    //     })
    //   },
    // })
    this.getDates()
    this.setData({
      calendarSValue: [this.data.year - 1950, this.data.month - 1, this.data.day - 1]
    })
    app.post('/common/sysParam/getSysCode', {}).then((res) => {
      console.log('获取参数字典成功！')
      console.log(res)
      this.setData({
        weatherArray: this.getCodeArray(res.data, 'WEATHER'),//天气
      })
      this.getWeather()
    }).catch((error) => {

    })
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