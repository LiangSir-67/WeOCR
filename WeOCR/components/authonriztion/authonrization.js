// components/authonriztion/authonrization.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 检测用户是否已经授权过某个权限，如果没有授权就调用小程序的授权，如果授权了就返回相应的状态给回调函数
     * scope为具体的某个权限 
     * cb为回调
     * 在使用这个组件时这个方法被第一个调用
     */
    isAuthorize(scope, cb) {
      let self = this;
      // 获取用户的权限信息
      wx.getSetting({
        success(res) {
          // 如果权限没有被授权
          if (!res.authSetting['scope.' + scope]) {
            wx.authorize({
              scope: 'scope.' + scope,
              success() {
                // 返回回调函数是否调用成功
                return typeof cb == "function" && cb();
              },
              // 如果失败将授权失败的信息记录下来
              fail() {
                self.setAuthTxt(scope);
                self.callBack = cb;
                self.setData({
                  popShow: true
                })
              }
            })
          } else {
            return typeof cb == "function" && cb();
          }
        }
      })
    },

    setAuthTxt(authType) {
      var authTxt = '';
      switch (authType) {
        case 'userInfo':
          authTxt = '用户信息';
          break;
        case 'userLocation':
          authTxt = '地理位置';
          break;
        case 'record':
          authTxt = '录音功能';
          break;
        case 'writePhotosAlbum':
          authTxt = '保存到相册';
          break;
        case 'camera':
          authTxt = '摄像头';
          break;
      }

      // 将获取的权限加入到Data
      this.setData({
        authType: authType,
        authTxt: authTxt
      })
    },

    // 获取权限的按钮事件
    getAuthorizeTool: function(res) {
      var scope = 'scope.' + this.data.authType;
      if (res.detail.authSetting[scope]) {
        this.setData({
          popShow: false
        })
        return typeof this.callBack == "function" && this.callBack();
      }
    },

    popClose() {
      this.setData({
        popShow: false
      })
    }


  }
})
