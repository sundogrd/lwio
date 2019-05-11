const app = {
  state: {
    showLogin: false
  },

  mutations: {
    TOGGLE_LOGIN_MODAL: state => {
      state.showLogin = !state.showLogin
    }
  },

  actions: {
  }
}

export default app
