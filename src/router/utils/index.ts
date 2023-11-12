const _import = import.meta.glob('/src/views/demo/**/**.vue')

/**
 * alter URL also add params
 * @param url now router address
 * @param key params of key
 * @param keyVal params of value
 */
export const changeUrl = (url: string, key: string, keyVal: string) => {
  let pattern: string = key + '=([^&]*)',
    replaceText: string = key + '=' + keyVal
  if (url.match(pattern)) {
    let tmp: string = '/(' + key + '=)([^&]*)/gi'
    tmp = url.replace(eval(tmp), replaceText)
    return tmp
  } else {
    if (url.match('[?]')) {
      return url + '&' + replaceText
    } else {
      return url + '?' + replaceText
    }
  }
}

/**
 * 格式化路由列表
 */

export const formattingRouter = (router: Array<MyRouter>, father?: number) => {
  let temp: Array<RouteRule> = []
  router.forEach((item,index)=>{
    let v = {} as RouteRule
    v.meta = {}
    v.path = item.path
    v.name = item.path
    v.meta.icon = item.icon
    v.meta!.keepAlive = item.keepAlive ? true : false
    v.meta!.title = item.title
    v.meta!.needLogin = true
    v.children = []
    v.component = _import[`/src/views${item.component}/index.vue`]
    if(item.father === 0 && father === undefined){
      temp.push(v)
    }else{
      v.children.push(formattingRouter(router,item.pid) as unknown  as RouteRule) 
    }
    // 递归了
    if(!father === undefined){
      if(father === item.father){
      return v
      }
    }
  })
  return temp
}
