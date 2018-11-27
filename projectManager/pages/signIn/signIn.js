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
    targetId: '',   // 项目id
    userid: '',     // 人员id
    targetType: 0,  // 目标类型(0-项目1-任务 2-号召)
    usertype: '',   // 人员身份
    list: [],

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
    console.log(options)
    var that = this;
    app.getTheme(that);
    var id = options.id;
    // 判断身份
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res)
        that.setData({
          usertype: res.data.user_type,
          userid: res.data.id,
        })
        that.setData({
          targetId: id,
          list: []
        })
        that.getWeather();
      },
    })
  },

  getDates: function (nYear, nMonth) {
    let cYear = nYear ? nYear : year;
    let cMonth = nMonth ? nMonth : month;
    let firstDay = new Date(cYear + '/' + cMonth + '/ 1');
    wx.setStorageSync('selectDate', {
      year: cYear,
      month: cMonth,
      day: this.data.day
    })
    let dateArray = [];
    let monthLength = [31, 28 + this.is_leap(cYear), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (var i = 0; i < 42; i++) {
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
    }
    this.setData({
      calendarDate: dateArray
    })
  },

  //上月点击事件
  lastMonth: function (e) {
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
    if (this.data.calendarSValue[0] != val[0]) {
      this.setData({
        selectYear: this.data.years[val[0]],
        calendarSValue: [val[0], val[1], val[2]]
      })
    }
    let monthLength = [31, 28 + this.is_leap(this.data.year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (this.data.calendarSValue[1] != val[1]) {
      let array = [];
      for (let i = 1; i <= monthLength[val[1]]; i++) {
        array.push(i)
      }
      this.setData({
        days: array,
        selectMonth: this.data.months[val[1]],
        calendarSValue: [val[0], val[1], val[2]]
      })
    }
    if (this.data.calendarSValue[2] != val[2]) {
      this.setData({
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

  //获取签到记录
  getWeather: function () {
    let curdate = this.data.year + '-' + this.data.month + '-' + this.data.day;
    var that = this;
    var userid = this.data.userid;
    var targetId = this.data.targetId;
    var targetType = this.data.targetType;
    // 某人某天考勤打卡记录列表(type: 0 - 获取自己的1 - 获取指定人员的)
    app.post('/userAtt/listByDay',
      {
        userId: userid,
        targetId: targetId,
        targetType: targetType,
        dDate: curdate,
        type: 0,  // 0-获取自己的1-获取指定人员的
      }).then((res) => {
        that.setData({
          list: res.data
        })
      }).catch((error) => {

      })

  },

  // 签到
  editWeather: function () {
    var that = this;
    var userid = this.data.userid;
    var targetId = this.data.targetId;
    var targetType = this.data.targetType;
    var targetId = this.data.targetId;
    wx.showLoading({
      title: '正在打卡...',
    })
    wx.getLocation({
      type: 'gcj02',
      success: function (e) {
        console.log(e)
        var latitude = e.latitude;
        var longitude = e.longitude;
        // 某人考勤打卡或补签(type: 0 - 自己打卡1 - 上级为下级补签)
        app.post('/userAtt/add',
          {
            userId: userid,
            targetId: targetId,
            targetType: targetType,
            attType: 0,  // 打卡类型(0-正常1-补签)
            type: 0,   // 0-自己打卡1-上级为下级补签
            lng: longitude,
            lat: latitude,
            address: '',  // 地址（选填）
          }).then((res) => {
            wx.hideLoading();
            wx.showToast({
              title: '打卡成功',
              icon: 'success',
              duration: 2000
            })
            that.getWeather()
          }).catch((error) => {

          })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.getTheme(that)
    this.getDates()
    this.setData({
      calendarSValue: [this.data.year - 1950, this.data.month - 1, this.data.day - 1]
    })
  },

  // 查看位置
  weizhi: function (e) {
    console.log(e.currentTarget.dataset.item)
    var latitude = e.currentTarget.dataset.item.lat;
    var longitude = e.currentTarget.dataset.item.lng;
    latitude = Number(latitude);
    longitude = Number(longitude);
    console.log(latitude)
    console.log(longitude)
    wx.openLocation({
      latitude,
      longitude
    })
  }


})