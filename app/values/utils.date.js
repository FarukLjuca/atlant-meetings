module.exports = {
  getTimeText(date) {
    let dateObj = new Date(date)
    let hours = dateObj.getHours()
    let minutes = dateObj.getMinutes()
    if (minutes < 10) minutes = '0' + minutes
    return hours + ':' + minutes
  },
  getDateText(date) {
    let dateObj = new Date(date)
    let day = dateObj.getDate()
    let month = this.getMonthText(dateObj.getMonth())
    let year = dateObj.getFullYear()
    return day + '. ' + month + ' ' + year + '.'
  },
  getMonthText(month) {
    switch (month) {
      case 0: return 'Jan'
      case 1: return 'Feb'
      case 2: return 'Mar'
      case 3: return 'Apr'
      case 4: return 'May'
      case 5: return 'Jun'
      case 6: return 'Jul'
      case 7: return 'Aug'
      case 8: return 'Sep'
      case 9: return 'Oct'
      case 10: return 'Nov'
      case 11: return 'Dec'
    }
  },
  getDayText(date) {
    switch (date.getDay()) {
      case 0: return 'Sun'
      case 1: return 'Mon'
      case 2: return 'Tue'
      case 3: return 'Wed'
      case 4: return 'Thu'
      case 5: return 'Fri'
      case 6: return 'Sat'
    }
  },
  getRepeatText(repeat) {
    switch (repeat) {
      case '0': return 'One time'
      case '1': return 'Every day'
      case '7': return 'Every week'
      case '14': return 'Every two weeks'
      case '30': return 'Every month'
    }
  },
  setFullDate(date, year, month, day) {
    let result = new Date(date.getTime())
    date.setFullYear(year)
    date.setMonth(month, day)
    return result
  }
}
