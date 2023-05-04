// 封装一个日期函数 计算两个时间的差值

export const getData = oldDay => {
  var nowDay = Date.now()
  var oldDay = new Date(oldDay).getTime()
  const differenceDays = (nowDay - oldDay) / (1000 * 3600 * 24)
  if (Math.ceil(differenceDays) >= 30) {
    return '已结束'
  } else {
    return Math.ceil(differenceDays) + '天'
  }
}
