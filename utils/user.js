module.exports = {

  appid: '9f9ce5c3605178daadc2d85ce9f8e064',

  auth: function(user, password, callback) {
    var that = this
    if (user.length != 9) {
      wx.$.showError('请输入9位一卡通号')
      return
    }
    if (password.length == 0) {
      wx.$.showError('请输入密码')
      return
    }
    wx.$.requestCompat({
      route: 'uc/auth',
      method: 'POST',
      data: {
        user: user,
        password: password,
        appid: that.appid
      },
      success: function(res) {
        if (res.statusCode < 400 && res.data.length == 40) {
          getApp().storage.uuid = res.data
          wx.$.log('Herald', 'Logged in as', user + '(' + res.data + ')')
          getApp().forceUpdateStorage()
          callback && callback(res)
        } else {
          wx.$.showError('用户名和密码不匹配，请重试')
        }
      }
    })
  },

  getUuid: function() {
    return getApp().storage.uuid || '0000000000000000000000000000000000000000'
  },

  isLogin: function() {
    return this.getUuid() != '0000000000000000000000000000000000000000'
  },

  logout: function() {
    getApp().storage.uuid = null
    wx.clearStorageSync()
  }
}