// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

// function formatTime(time) {
//   if (typeof time !== 'number' || time < 0) {
//     return time
//   }

//   var hour = parseInt(time / 3600)
//   time = time % 3600
//   var minute = parseInt(time / 60)
//   time = time % 60
//   var second = time

//   return ([hour, minute, second]).map(function (n) {
//     n = n.toString()
//     return n[1] ? n : '0' + n
//   }).join(':')
// }

// function formatLocation(longitude, latitude) {
//   if (typeof longitude === 'string' && typeof latitude === 'string') {
//     longitude = parseFloat(longitude)
//     latitude = parseFloat(latitude)
//   }

//   longitude = longitude.toFixed(2)
//   latitude = latitude.toFixed(2)

//   return {
//     longitude: longitude.toString().split('.'),
//     latitude: latitude.toString().split('.')
//   }
// }

//数据转化
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致number
*/
function formatTime(date, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  // var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

module.exports = {
  formatTime: formatTime
  // formatLocation: formatLocation,
  // formatTime: formatTime
}
