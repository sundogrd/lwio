import Vue from 'vue'
import { getUserInfo as getUserInfoAPI } from 'api/auth'

const auth = {
  state: {
    user: {
      id: null
    },
    token: {
      accessToken: null,
      refreshToken: null,
      tokenType: null,
      expiresAt: null
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      for (const key in token) {
        state.token[key] = token[key]
      }
    },
    CLEAR_TOKEN: state => {
      for (const key in state.token) {
        state.token[key] = null
      }
    },
    SET_USER: (state, userInfo) => {
      for (const key in userInfo) {
        if (key in state) {
          state.user[key] = userInfo[key]
        } else {
          Vue.set(state.user, key, userInfo[key])
        }
      }
    },
    CLEAR_USER: state => {
      for (const key in state.user) {
        state.user[key] = null
      }
    }
  },

  actions: {
    async setToken ({ commit }, token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]))
      commit('SET_TOKEN', {
        accessToken: token,
        expiresAt: tokenPayload.iat// when the access token will expire
      })
      commit('SET_USER', {
        username: tokenPayload.user.username
      })
      return true
    },
    async getUserInfo ({ commit, state }) {
      const user = await getUserInfoAPI(state.user.username)
      commit('SET_USER', {
        ...user
      })
      return user
    },
    async signoutAction ({ commit }) {
      commit('CLEAR_USER')
      commit('CLEAR_TOKEN')
    }
  }
}

export default auth
