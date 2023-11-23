interface UserInfo {
  uid: number
  account: string
  password: string
  name: string
}

export interface UserState {
  token: string
  userInfo: UserInfo
  routerList: Array<UserInfo>
}

import type { LoginType } from '@/api/login/rule'
import loginApi from '@/api/login'
import userApi from '@/api/user'
import { defineStore } from 'pinia'
import { Session } from '@/utils/storage'
import { resetRouter, addRouterList } from '@/router/index'
import { formattingRouter } from '@/router/utils'
import {
  getToken,
  getUserInfo,
  setToken,
  setUserInfo,
  setRouterList,
  getRouterList,
} from '@/utils/auth'
export default defineStore('user', {
  state: (): UserState => {
    return {
      token: getToken(),
      userInfo: getUserInfo(),
      routerList: getRouterList(),
    }
  },
  actions: {
    // 登录
    async login(userinfo: LoginType) {
      const { account, password } = userinfo
      let { token } = await loginApi.login({ account: account.trim(), password: password.trim() })
      console.log(token)
      this.token = token
      setToken(token)
      await this.getInfo()
      await this.getRouterList()
    },
    // 退出
    async logout() {
      this.token = ''
      Session.clear()
      resetRouter()
      location.reload()
    },
    // 获取用户信息
    async getInfo() {
      let { data } = await userApi.getUserInfoApi()
      this.userInfo = data
      setUserInfo(data)
    },
    // 获取管理员路由
    async getRouterList() {
      let { data } = await userApi.getRouterMenuListApi()
      data = formattingRouter(data)
      addRouterList(data)
      setRouterList(data)
      this.routerList = data
    },
  },
})
