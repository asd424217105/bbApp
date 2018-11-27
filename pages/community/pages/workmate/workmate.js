// pages/community/pages/workmate/workmate.js
var app = getApp();
var uploadfun = require('../../../../utils/upload.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx: '', //评论的第几个数据
    name:'', //评论人姓名
    userid:'',
    list:[],
    pagesize: 20,
    curpage: 1,
    refresh: false,
    locking: false,
    showModal:false,
    id:'',   //  帖子id
    usertype:'',
    inputValue:'',
    scrollTop:'',
    animationData: {},
    videoBtnHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 设置顶部背景色
    app.getTheme(this);
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          userid: res.data.id,
          usertype: res.data.user_type,
          name: res.data.real_name || res.data.nick_name,
          curpage: 1,
          list: []
        })
        that.corpUsersZone();
      },
    })
  },

  // 页面显示时
  onShow:function(){
    if (this.data.refresh){
      this.onPullDownRefresh();
      this.setData({
        refresh: false
      })
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      curpage: 1,
      list: []
    })
    this.corpUsersZone();
    wx.stopPullDownRefresh();
  },

  // 上拉加载
  onReachBottom: function () {
    var curpage = this.data.curpage;
    var locking = this.data.locking;
    if (!locking){
      curpage++;
      this.setData({
        curpage: curpage
      })
      this.corpUsersZone();
    }else{
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 上下滚动时
  onPageScroll:function(ev){
    var _this = this;
    //当滚动的top值最大或最小时，为什么要做这一步是因为在手机实测小程序的时候会发生滚动条回弹，所以为了处理回弹，设置默认最大最小值
    if (ev.scrollTop <= 0) {
      ev.scrollTop = 0;
    } 

    // 动画
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    _this.animation = animation

    //判断浏览器滚动条上下滚动
    if (ev.scrollTop > this.data.scrollTop || ev.scrollTop == wx.getSystemInfoSync().windowHeight) {
      //向下滚动
      animation.rotateX(90).step()
  
    } else {
      //向上滚动
      animation.rotateX(0).step()

    }

    //给scrollTop重新赋值
    setTimeout(function () {
      _this.setData({
        scrollTop: ev.scrollTop,
        animationData: animation.export()
      })
    }, 0)
  },

  // 获取工友圈列表
  corpUsersZone:function(){
    var that = this;
    var curpage = this.data.curpage;
    var pagesize = this.data.pagesize;
    // 获取工友圈api
    app.post('/corpUsersZone/list',
      {
        userid: 0,
        curpage: curpage,
        pagesize: pagesize
      }).then((res) => {
        var reslist = res.data.list;
        var list = that.data.list;
        list.push.apply(list, reslist);
        that.setData({
          list: list
        })
        // 如果没有下一页数据了 上拉锁定
        if (!res.data.hasNextPage) {
          that.setData({
            locking: true
          })
        }else{
          that.setData({
            locking: false
          })
        }  
      }).catch((error) => { })
  },


  // 视频 图片 预览播放--------------------------

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
    var imglist = e.target.dataset.list;
    var current = e.target.dataset.src;
    var arr = [];
    for (var i in imglist){
      if (imglist[i].fileType == 3){
        arr.push(imglist[i].newFilename)
      }
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接数组
    })
  },

  //-----------------------------------------------


  // 发布帖子按钮
  addNote:function(){
    wx.navigateTo({
      url: 'addDynamic/addDynamic'
    })
  },

  // 评论按钮
  commentBtn:function(e){
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      showModal: true,
      id: id,
      idx: idx
    })
  },

  // 键盘输入时触发
  bindinput:function(e){
    var value = e.detail.value;
    this.setData({
      inputValue: value
    });
  },

  // 添加评论按钮
  bindconfirm:function(e){
    var value = e.detail.value;
    this.addComment(value);
  },

  // 添加评论按钮
  send: function () {
    var value = this.data.inputValue;
    this.addComment(value);
  },

  // 添加评论
  addComment:function(value){
    var that = this;
    var id = this.data.id;
    var idx = this.data.idx;
    var name = this.data.name;
    var userid = this.data.userid;
    if (value == '') {
      wx.showToast({
        title: '评论内容不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    //添加评论api
    app.post('/corpUsersZone/addReply',
      {
        id: id,
        content: value,
        file_code: ''
      }).then((res) => {
        that.setData({
          showModal: false
        });
        var obj = {};
        obj.id = res.data;
        obj.user_id = userid;
        obj.content = value;
        obj.real_name = name;
        var list = that.data.list;
        list[idx].reply_list.push(obj);
        that.setData({
          list: list,
          inputValue: ''
        })
      }).catch((error) => { })
  },

  // 删除评论
  delComment: function (e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var item = e.currentTarget.dataset.item;
    var id = item.id;
    var userid_c = item.user_id;
    var userid = this.data.userid;
    var list = this.data.list;
    // 如果是自己评论的
    if (userid_c == userid) {
      wx.showActionSheet({
        itemList: ['删除我的评论'],
        success: function (res) {
          console.log(res.tapIndex)
          if (res.tapIndex == 0) {
            // 删除帖子回复
            app.post('/corpUsersZone/delReply',
              {
                id: id
              }).then((res) => {
                // that.onPullDownRefresh();
                var reply_list = list[idx].reply_list;
                for (var i in reply_list){
                  if (reply_list[i].id == id){
                    reply_list.splice(i, 1);
                    that.setData({
                      list: list
                    })
                  }
                }

              }).catch((error) => { })
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }
  },
 
  // --------------模态弹窗-----------

  // 输入框失去焦点
  bindblur: function () {
    this.setData({
      showModal: false
    });
  }

})