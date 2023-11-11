export function getDateYear() {
  let time = new Date()
  return time.getFullYear()
}
export function convertFile(base64: string): File | Blob {
  let fileArray: any = base64.split(',')
  // 过滤出文件类型
  let fileType: string = fileArray[0].match(/:(.*?);/)[1]
  // atob 是对经过 base-64 编码的字符串进行解码
  let bstr = atob(fileArray[1])
  let n: number = bstr.length
  //Uint8Array 数组类型表示一个 8 位无符号整型数组
  let u8arr = new Uint8Array(n)
  while (n--) {
    // 返回字符串n个字符的 Unicode 编码
    u8arr[n] = bstr.charCodeAt(n)
  } // return new Blob([u8arr], { type: fileType })
  return new File([u8arr], '文件名', { type: fileType })
}

/**
 * 校验手机号
 * @phone 手机号
 * @required
 */
export function checkPhone(phone: string, required = true) {
  if (!phone) {
    return required ? false : true
  } else {
    // 必须是1开头，第二位数字可以是0-9任意一个，总长为11
    let reg = /^1([0-9])\d{9}$/
    // 必须是1开头，第二位数字可以是3|5|6|7|8|9任意一个，总长为11
    // let reg = /^1([3|5|6|7|8|9])\d{9}$/;
    if (reg.test(phone)) {
      return true
    } else {
      return false
    }
  }
}
/**
 * 校验邮箱
 * @email 邮箱
 */
export function checkEmail(email: string) {
  let pattern =
    /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
  return pattern.test(email)
}

/**
 * 计算两个日期天数差的函数
 * @sDate1 时间1
 * @sDate2 时间2
 */
export function daysBetween(sDate1: string, sDate2: string) {
  //Date.parse() 解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
  let time1 = Date.parse(new Date(sDate1).toString())
  let time2 = Date.parse(new Date(sDate2).toString())
  // var nDays = Math.abs(parseInt(((time2 - time1) / 1000 / 3600 / 24).toString()))
  let nDays = parseInt(((time2 - time1) / 1000 / 3600 / 24).toString())
  return nDays
}

/**
 * 获取当前日期
 * @return yyyy-mm-dd
 */
export function getNowFormatDate() {
  let date = new Date(),
    year = date.getFullYear(), //获取完整的年份(4位)
    month: number | string = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
    strDate: number | string = date.getDate() // 获取当前日(1-31)
  if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
  if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0

  return `${year}-${month}-${strDate}`
}
