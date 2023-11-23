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
/**
 * 获取学生列表
 */
const getStudentList = (uid: string) => {
  return request.get('/student/list', { uid })
}
export default {
  getUserInfoApi,
  getRouterMenuListApi,
  getStudentList,
}
