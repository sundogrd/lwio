import { githubLogin, signup, setinfo } from 'api/auth';
import { storeWithExpiration } from 'utils';


const user = {
  state: {
    // OPTIMIZE: the logic is so shit...
    accessToken: storeWithExpiration.get('user.accessToken') ? storeWithExpiration.get('user.accessToken') : null,
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.accessToken = token;
    },
  },

  actions: {
    // 邮箱登录
    // TODO: login_params descripe

    GithubLogin({ commit }, code) {
      return new Promise((resolve, reject) => {
        console.log('promise start');
        githubLogin(code).then(response => {
          console.log('response get')
          const data = response;
          console.log(response);
          storeWithExpiration.set('user.accessToken', response.token, 86400000); 
          commit('SET_TOKEN', response.token);  
          resolve();      
        }).catch(error => {
          reject(error);
        });
   
      });
    },
  }
};

export default user;
