import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import auth from './modules/auth';
import getters from './getters';

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    auth
  },
  getters,
  plugins: [createPersistedState()]
});

export default store
