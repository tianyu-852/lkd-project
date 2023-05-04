Component({
  data: {
    selected: 0,
    color: '#666',
    selectedColor: '#0085FF',
    tabbarList: [
      {
        pagePath: '/pages/tabbar/index/index',
        text: '首页',
        iconPath: '/static/tabbar/index.png',
        selectedIconPath: '/static/tabbar/index-active.png'
      },
      {
        pagePath: '/pages/tabbar/center/center',
        text: '',
        iconPath: '/static/tabbar/law-center.png',
        selectedIconPath: '/static/tabbar/law-center.png',
        isSpecial: true,
      },
      {
        pagePath: '/pages/tabbar/profile/profile',
        text: '更多',
        iconPath: '/static/tabbar/profile.png',
        selectedIconPath: '/static/tabbar/profile-active.png'
      }
    ],
    safeAreaHeight: 0, // 底部安全条高度
  },
  attached() {
    wx.getSystemInfo({
      success: res => {
        const _safeAreaHeight = res.screenHeight - res.safeArea.bottom;
        this.setData({ safeAreaHeight: _safeAreaHeight });
      }
    });
  },
  methods: {
    /**
     * 切换 tabbar
     */
    switchTab(event) {
      const { dataset } = event.currentTarget;
      if (dataset.click) {
        wx.switchTab({ url: dataset.path });
      }
    }
  }
});
