// pages/index/index.js
Page({
  data: {
    item: 0,
    tap: 0,

    // 播放列表数据
    playlist: [{
      id: 1,
      title: 'Dancing With Your Ghost',
      singer: 'Sasha Alex Sloan',
      src: 'https://music.163.com/song/media/outer/url?id=1374329431.mp3',
      coverImgUrl: 'http://p1.music.126.net/T2vjSPaRZxFGIC2HOXElkQ==/109951165986777646.jpg'
    }, {
      id: 2,
      title: 'STAY',
      singer: 'The Kid LAROI / Justin Bieber',
      src: 'https://music.163.com/song/media/outer/url?id=1859245776.mp3',
      coverImgUrl: 'http://p1.music.126.net/e5cvcdgeosDKTDrkTfZXnQ==/109951166155165682.jpg'
    }, {
      id: 3,
      title: 'My Way',
      singer: 'Calvin Harris',
      src: 'https://music.163.com/song/media/outer/url?id=430297325.mp3',
      coverImgUrl: 'http://p2.music.126.net/FPK8PLn8CqbrRcogWif3mg==/109951166216944015.jpg'
    }, {
      id: 4,
      title: "Since You've Been Gone",
      singer: 'Novaspace / Joseph Vincent',
      src: 'https://music.163.com/song/media/outer/url?id=441116579.mp3',
      coverImgUrl: 'http://p2.music.126.net/3pNIekahSDZS7tr3frCpsg==/109951166990374017.jpg'
    }, {
      id: 5,
      title: "Love Is Gone (Acoustic)",
      singer: 'SLANDER / Dylan Matthew',
      src: 'https://music.163.com/song/media/outer/url?id=1401671455.mp3',
      coverImgUrl: 'http://p1.music.126.net/E5JYsO4DR4_Y-CdidpUVCw==/109951164473460772.jpg'
    }],
    state: 'paused', //音乐播放状态
    playIndex: 0, //当前播放音乐在列表中的下标
    play: {
      currentTime: '00:00', //当前播放音乐播放位置（单位 s）
      duration: '00:00', //当前播放音乐的总长度，（单位s)
      percent: 0, //当前播放音乐播放位置占据滑块百分比
      title: '',
      singer: '',
      coverImgUrl: '/images/cover.jpg',
    }
  },
  audioCtx: null,
  onReady: function () {
    this.audioCtx = wx.createInnerAudioContext()
    var that = this
    //播放失败检测
    this.audioCtx.onError(function () {
      console.log('播放失败：' + that.audioCtx.src)
    })
    //播放完成自动切换下一首
    this.audioCtx.onEnded(function () {
      that.next()
    })
    //自动更新播放速度
    this.audioCtx.onPlay(function () {})
    this.audioCtx.onTimeUpdate(function () {
      that.setData({
        'play.duration': formatTime(that.audioCtx.duration),
        'play.currentTime': formatTime(that.audioCtx.currentTime),
        'play.percent': that.audioCtx.currentTime / that.audioCtx.duration * 100
      })
    })
    //默认第一首
    this.setMusic(0)
    //格式化时间
    function formatTime(time) {
      var minute = Math.floor(time / 60) % 60;
      var second = Math.floor(time) % 60
      return (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
    }
  },
  sliderChange: function (e) {
    var second = e.detail.value * this.audioCtx.duration / 100
    this.audioCtx.seek(second)
  },
  setMusic: function (index) {
    var music = this.data.playlist[index]
    this.audioCtx.src = music.src
    this.setData({
      playIndex: index,
      'play.title': music.title,
      'play.singer': music.singer,
      'play.coverImgUrl': music.coverImgUrl,
      'play.currentTime': '00:00',
      'play.duration': '00:00',
      'play.percent': 0
    })
  },
  play: function () {
    this.audioCtx.play()
    this.setData({
      state: 'running'
    })
  },
  pause: function () {
    this.audioCtx.pause()
    this.setData({
      state: 'paused'
    })
  },
  next: function () {
    var index = this.data.playIndex >= this.data.playlist.length - 1 ? 0 : this.data.playIndex + 1
    this.setMusic(index)
    if (this.data.state === 'running') {
      this.play()
    }
  },
  changeItem: function (e) {
    this.setData({
      item: e.target.dataset.item
    })
  },
  changeTab: function (e) {
    this.setData({
      tab: e.detail.current
    })
  }
})