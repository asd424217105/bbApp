// var uploadFile = 'http://192.168.0.200:8081/bbgjupload/commonUploadOrDownload/uploadBackJson';  //添加附件
// var delUpload = 'http://192.168.0.200:8081/bbgjupload/commonUploadOrDownload/delUpload';  //删除附件
// var uploadFile = 'http://47.92.217.241:8081/bbgjupload/commonUploadOrDownload/uploadBackJson';  //添加附件
// var delUpload = 'http://47.92.217.241:8081/bbgjupload/commonUploadOrDownload/delUpload';  //删除附件
var uploadFile = 'https://www.testbbgj.com/bbgjupload/commonUploadOrDownload/uploadBackJson';  //添加附件
var delUpload = 'https://www.testbbgj.com/bbgjupload/commonUploadOrDownload/delUpload';  //删除附件

var app = getApp();
var upload = {};

// 生成file_code编号
upload.fileCode = function(thats){
  var that = thats;
  // 时间戳和随机数
  var timestamp = new Date().getTime();
  var randomNum = Math.floor(Math.random() * 100);
  // 组合时间戳和随机数上传文件用
  var file_code = timestamp + String(randomNum);
  that.setData({
    file_code: file_code
  })
  console.log('生成file_code编号成功' + file_code)
}


// 用来显示一个选择图片和拍照的弹窗
upload.chooseImageTap = function (thats) {
  var that = thats;
  if (that.data.imglist.length >= 6) {
    wx.showToast({
      title: '最多上传6个附件',
      icon: 'none',
      duration: 2000
    })
    return false;
  }
  wx.showActionSheet({
    itemList: ['图片', '视频'],
    itemColor: "#f7982a",
    success: function (res) {
      if (!res.cancel) {
        if (res.tapIndex == 0) {
          upload.chooseWxImage(that)
        } else if (res.tapIndex == 1) {
          var imglist = that.data.imglist;
          // 设置关卡 只能上传一个视频
          var point = true;
          for (var i in imglist) {
            if (imglist[i].fileType == 5) {
              point = false;
            }
          }
          if (point) {
            upload.chooseWxVideo(that)
          } else {
            wx.showToast({
              title: '只能上传一个视频',
              icon: 'none',
              duration: 2000
            })
          }
        }
      }
    }
  })
}

//用来选择图片以及接收图片路径回调的监听
upload.chooseWxImage = function (thats) {
  var that = thats;
  var i = 6;
  var length = that.data.imglist.length;
  var z = i - length;
  // 选择图片方法
  wx.chooseImage({
    count: z, // 默认9张
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      console.log(res)
      var tempFilePath = res.tempFilePaths;
      var file_code = that.data.file_code;
      console.log(file_code)
      // 上传文件的此批编号
      var data = {
        'file_code': file_code
      }
      // 上传图片
      upload.uploadFile(tempFilePath, data, function (data) {
        // 返回的附件编号
        var file_code = data.data.file_code;
        // 返回的图片数组
        var imgurl = data.data.data;
        // wx_data里的图片数组
        var imglist = that.data.imglist;
        // 拼接数组
        imglist.push.apply(imglist, imgurl);
        that.setData({
          file_code: file_code,
          imglist: imglist
        })
        console.log(that.data.imglist)
      })
    }
  });
}

//身份证选择图片以及接收图片路径回调的监听
upload.idCardChooseWxImage = function (thats,idCardType) {
  var that = thats;
  // 选择图片方法
  wx.chooseImage({
    count: 1, // 默认9张
    sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      console.log(res)
      var tempFilePath = res.tempFilePaths;
      var file_code = that.data.file_code;
      console.log(file_code)
      // 上传文件的此批编号
      var data = {
        'file_code': file_code
      }
      // 上传图片
      upload.uploadFile(tempFilePath, data, function (data) {
        // 返回的附件编号
        var file_code = data.data.file_code;
        // 返回的图片数组
        var imgurl = data.data.data[0].url;
        // 返回的图片ID
        var fileId = data.data.data[0].fileId;
        console.log(imgurl)
        if (idCardType == 0) {
          that.setData({
            file_code: file_code,
            positiveImg: imgurl,
            fileIdPositive: fileId,
            positiveImgShow: false
          })
        } else if (idCardType == 1) {
          that.setData({
            file_code: file_code,
            backImg: imgurl,
            fileIdBack: fileId,
            backImgShow: false
          })
        } else {
          console.log('身份证类型错误！')
        }
        
        console.log(that.data.positiveImg)
      })
    }
  });
}

//营业执照选择图片以及接收图片路径回调的监听
upload.licenseChooseWxImage = function (thats, idCardType) {
  var that = thats;
  // 选择图片方法
  wx.chooseImage({
    count: 1, // 默认9张
    sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      console.log(res)
      var tempFilePath = res.tempFilePaths;
      var file_code = that.data.file_code;
      console.log(file_code)
      // 上传文件的此批编号
      var data = {
        'file_code': file_code
      }
      // 上传图片
      upload.uploadFile(tempFilePath, data, function (data) {
        // 返回的附件编号
        var file_code = data.data.file_code;
        // 返回的图片数组
        var imgurl = data.data.data[0].url;
        // 返回的图片ID
        var fileId = data.data.data[0].fileId;
        console.log(imgurl)

        that.setData({
          file_code: file_code,
          licenseImg: imgurl,
          fileIdLicense: fileId,
          licenseImgShow: false
        })

        console.log(that.data.licenseImg)
      })
    }
  });
}

// 用来选择视频以及接收视频路径回调的监听
upload.chooseWxVideo = function (thats) {
  var that = thats;
  wx.chooseVideo({
    sourceType: ['album', 'camera'],
    maxDuration: 60,
    camera: 'back',
    success: function (res) {
      console.log(res)
      // 视频不能大于5分钟
      if (res.duration >= 300) {
        wx.showToast({
          title: '不能上传大于5分钟的视频',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      var tempFilePath = [res.tempFilePath];
      console.log(tempFilePath)
      var file_code = that.data.file_code;
      // 上传文件的此批编号
      var data = {
        'file_code': file_code
      }
      // 上传视频
      upload.uploadFile(tempFilePath, data, function (data) {
        console.log(data)
        // 返回的附件编号
        var file_code = data.data.file_code;
        // 返回的图片数组
        var imgurl = data.data.data;
        // wx_data里的图片数组
        var imglist = that.data.imglist;
        // 拼接数组
        imglist.push.apply(imglist, imgurl);
        that.setData({
          file_code: file_code,
          imglist: imglist
        })
        console.log(that.data.imglist)
      })
    }
  })
}


// 上传附件方法
var s=0;
upload.uploadFile = function (tempFilePath, datas, callback) {
  wx.showLoading({
    title: '正在上传...',
  })
  console.log(uploadFile)
  wx.uploadFile({
    url: uploadFile,
    filePath: tempFilePath[s],
    name: 'file',
    formData: datas,
    success: function (res) {
      wx.hideLoading();
      console.log(res)
      if (res.statusCode == 200) {   
        var data = JSON.parse(res.data);
        if (data.code == 0) {
          wx.showToast({
            title: data.message,
            icon: 'success',
            duration: 1200
          })
          callback(data)

          s++;
          if (s == tempFilePath.length){
            console.log('上传完毕')
            s=0;
          }else{
            console.log(s);
            console.log('开始下一张')
            upload.uploadFile(tempFilePath, datas, callback)
          }

        }else{
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
  })
}

// 视频播放时自动全屏
upload.bindplay = function (idname,thats) {
  var that = thats;
  that.setData({
    videoBtnHidden: true
  })
  var videoContext = wx.createVideoContext(`${idname}`);
  videoContext.play();
  videoContext.requestFullScreen();
}

// 退出全屏时
upload.bindfullscreenchange = function (e, thats) {
  var that = thats
  var idname = e.currentTarget.id;
  if (e.detail.fullScreen == false) {
    that.setData({
      videoBtnHidden: false
    })
    var videoContext = wx.createVideoContext(`${idname}`);
    videoContext.seek(0.0);
    videoContext.pause();
  }
}

// 预览图片
upload.previewImage = function (e, thats) {
  var that = thats;
  var imglist = that.data.imglist;
  var current = e.target.dataset.src;
  var arr = [];
  for (var i in imglist) {
    if (imglist[i].fileType == 3) {
      arr.push(imglist[i].url)
    }
  }
  wx.previewImage({
    current: current, // 当前显示图片的http链接
    urls: arr // 需要预览的图片http链接数组
  })
}

// 预览身份证
upload.previewIdCardImage = function (e, thats) {
  console.log(e)
  var that = thats;
  var current = e.target.dataset.src;
  var array = [];
  array.push(current)
  wx.previewImage({
    current: current, // 当前显示图片的http链接
    urls: array
  })
}

// 反馈预览图片
upload.feedbackPreviewImage = function (e, thats) {
  var that = thats;
  var index = e.target.dataset.index;
  var imglist = [];
  if (e.target.dataset.type == 0) {
    imglist = that.data.feedbackList[index].file_list;
  } else if (e.target.dataset.type == 1) {
    imglist = that.data.feedbackList[index].reply_list[0].file_list;
  }
  var current = e.target.dataset.src;
  var arr = [];
  for (var i in imglist) {
    if (imglist[i].fileType == 3) {
      arr.push(imglist[i].newFilename)
    }
  }
  wx.previewImage({
    current: current, // 当前显示图片的http链接
    urls: arr // 需要预览的图片http链接数组
  })
}

// 业绩预览图片
upload.AchievementPreviewImage = function (e, thats) {
  var that = thats;
  var index = e.target.dataset.index;
  var imglist = [];
  console.log(that.data.achienementList);
  imglist = that.data.achienementList[index].file_list;

  var current = e.target.dataset.src;
  var arr = [];
  for (var i in imglist) {
    if (imglist[i].fileType == 3) {
      arr.push(imglist[i].newFilename)
    }
  }
  wx.previewImage({
    current: current, // 当前显示图片的http链接
    urls: arr // 需要预览的图片http链接数组
  })
}

// 删除附件
upload.deleteImage = function (e, thats) {
  var that = thats;
  var idx = e.target.dataset.idx;
  var imglist = that.data.imglist;
  var fileId = imglist[idx].fileId;
  wx.showLoading({
    title: '正在删除...',
  })
  // 删除附件api
  wx.request({
    url: delUpload,
    data: {
      id: fileId
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    method: 'post',
    success: res => {
      wx.hideLoading();
      console.log(res)
      if (res.statusCode == 200){
        if(res.data.code == 0){
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
          imglist.splice(idx, 1);
          that.setData({
            imglist: imglist
          })
          console.log(that.data.imglist);
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
  })
}

// 删除身份证照片
upload.deleteIdCardImage = function (e, thats) {
  var that = thats;
  var fileId = e.target.dataset.id;
  var idType = e.target.dataset.idtype;
  var imglist = that.data.imglist;
  // console.log('idtype'+idType)
  wx.showLoading({
    title: '正在删除...',
  })
  // 删除附件api
  wx.request({
    url: delUpload,
    data: {
      id: fileId
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    method: 'post',
    success: res => {
      wx.hideLoading();
      console.log(res)
      if (res.statusCode == 200) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
          if (idType == 'positive') {
            // console.log('goPos')
            that.setData({
              positiveImg: '',
              fileIdPositive: '',
              positiveImgShow: true
            })
          } else if (idType == 'back') {
            // console.log('goBack')
            that.setData({
              backImg: '',
              fileIdBack: '',
              backImgShow: true
            })
          } else {

          }
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
  })
}

// 删除身份证照片
upload.deleteLicenseImage = function (e, thats) {
  var that = thats;
  var fileId = e.target.dataset.id;
  var idType = e.target.dataset.idtype;
  var imglist = that.data.imglist;
  // console.log('idtype'+idType)
  wx.showLoading({
    title: '正在删除...',
  })
  // 删除附件api
  wx.request({
    url: delUpload,
    data: {
      id: fileId
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    method: 'post',
    success: res => {
      wx.hideLoading();
      console.log(res)
      if (res.statusCode == 200) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            licenseImg: '',
            fileIdLicense: '',
            licenseImgShow: true
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
  })
}


module.exports = {
  upload: upload,
}
