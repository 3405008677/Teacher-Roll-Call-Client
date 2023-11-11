import axios from 'axios'
import { getToken } from '../auth'
import { ElNotification } from 'element-plus'

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 50000,
  headers: {},
})

// request interceptor
request.interceptors.request.use(
  (config: any) => {
    // 设置请求头
    config!.headers['ContentType'] = `application/json;charset=UTF-8`
    // request before judge
    const userToken: string = getToken()
    if (userToken) config!.headers['Authorization'] = `Bearer ${userToken}`
    return config
  },
  (err) => {
    return Promise.reject(err)
  },
)

// response interceptor
request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code === 200 || data.code === 0) return data
    ElNotification({
      title: '错误！',
      message: data.msg,
      type: 'error',
    })
  },
  (err) => {
    ElNotification({
      title: '错误!',
      message: '服务器发生错误!',
      type: 'error',
    })
    return Promise.reject(err)
  },
)

export default request
