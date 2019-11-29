import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export type StoreState = {
  wtf: string
}

export default new Vuex.Store<StoreState>({
  state: {
    wtf: 'keke'
  },
  mutations: {
    changeWtf (state) {
      state.wtf = 'kekekeke'
    }
  },
  actions: {
  },
  modules: {
  }
})
