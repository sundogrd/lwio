import { login, signup, setinfo } from 'api/auth';
import { storeWithExpiration } from 'utils';


const user = {
  state: {
    // OPTIMIZE: the logic is so shit...
    accessToken: storeWithExpiration.get('user.accessToken') ? storeWithExpiration.get('user.accessToken') : null,
    userInfo: storeWithExpiration.get('user.userInfo') ? storeWithExpiration.get('user.userInfo') : null,
  },

  mutations: {
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    SET_TOKEN: (state, token) => {
      state.accessToken = state;
    },
  },

  actions: {
    // 邮箱登录
    // TODO: login_params descripe

    GithubLogin({ commit }, login_params) {
      return new Promise((resolve, reject) => {
        login(login_params.code).then(response => {
          const data = response;
          storeWithExpiration.set('user.userInfo', response, 86400000);
          storeWithExpiration.set('user.accessToken', response['Access-Token'], 86400000);
          commit('SET_USERINFO', response);  
          commit('SET_TOKEN', response['Access-Token']);  
          resolve();      
        }).catch(error => {
          reject(error);
        });
   
      });
    },
  }
};

export default user;
