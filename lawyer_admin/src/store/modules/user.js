import storage from 'store'
import { login, getInfo } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },
  actions: {
    // 用户登录 
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        // 调取登录 api
        login(userInfo).then(response => {
          const result = response.data
          // 将 access_token 存入 storage
          storage.set(ACCESS_TOKEN, result.access_token, result.access_token_expired * 1000)
          commit('SET_TOKEN', result.access_token) // access_token 存入 vuex state 
          commit('SET_NAME', { name: result.nickname, welcome: welcome() }) // 用户名 存入 vuex state
          commit('SET_AVATAR', result.avatar) // 用户头像 存入 vuex state
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        // 调取获取用户信息 api
        getInfo().then(response => {
          const result = response.data

          if (result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions // 用户角色路由列表
            // 这段 map 函数无用代码
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
                console.log(per)
              }
            })

            // 关键一步：向 response 响应对象 role 添加 permissionList 字段 (response 是 Object 类型，堆类型)
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
            // console.log(role.permissionList)

          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 用户登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        // logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          resolve()
        // }).catch(() => {
        //   resolve()
        // }).finally(() => {
        // })
      })
    }
  }
}

export default user
