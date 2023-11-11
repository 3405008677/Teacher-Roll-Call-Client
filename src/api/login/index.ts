import { LoginType } from './rule'
import request from '@/utils/request'

/**
 * 登录
 * @params username 用户名
 * @params password 密码
 */
const login = (data: LoginType) => {
  return request.post('/login', data)
}
/**
 * 退出
 */
const logout = () => {
  return request.get('/logout')
}

export default {
  login,
  logout,
}
