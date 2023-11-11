// import { Login } from './rule'
import request from '@/utils/request'

/**
 * 获取指定用户信息
 * @params id 用户ID
 */
const getUserInfoApi = () => {
  return request.get('/info')
}
/**
 * 获取管理员路由
 */
const getRouterMenuListApi = () => {
  return request.get('/routerList')
}
export default {
  getUserInfoApi,
  getRouterMenuListApi,
}
