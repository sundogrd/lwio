module.exports = {
  NODE_ENV: '"development"',
  BASE_API: '"http://localhost:8800/api/"',
  APP_ORIGIN: '"https://wallstreetcn.com"',
  API_MOCK: false,

  // OAUTH相关配置
  OAUTH_LWIO: {
    oauthClientInfo: {
      id: '"5b6539c9788cd3ac3d39ce80"',
      clientSecret: '"sundog_do_great"',
      name: '"lwio"',
      scope: '"user_info_base:read user_info_base:write"',
      responseType: '"token"',
      grantType: '"implicit_code"',
      redirectUri: '"http://localhost:9527/receive-grant"'
    },
    endpoint: {
      authorize: '"http://localhost:29305/login/oauth/authorize"'
    }
  }
};
