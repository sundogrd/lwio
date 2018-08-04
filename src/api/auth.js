/* eslint camelcase: "off" */
import fetch from 'utils/fetch'
// import store from 'store'

export function getUserInfo(username) {
  return fetch({
    url: `users/${username}`,
    method: 'get'
  })
}

export function getToken({
  grant_type = process.env.OAUTH_LWIO.oauthClientInfo.grantType,
  client_id = process.env.OAUTH_LWIO.oauthClientInfo.id,
  client_secret = process.env.OAUTH_LWIO.oauthClientInfo.clientSecret,
  code,
  scope = process.env.OAUTH_LWIO.oauthClientInfo.scope,
  redirect_uri = process.env.OAUTH_LWIO.oauthClientInfo.redirectUri
}) {
  const data = {
    grant_type,
    client_id,
    client_secret,
    code,
    scope,
    redirect_uri
  }

  return fetch({
    url: process.env.OAUTH_LWIO.endpoint.token,
    method: 'post',
    data,
    transformRequest: [function(data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
