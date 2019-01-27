import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import router from '@/router'
import config from '@/config'
import { MessageBox, Notification } from 'element-ui'
import mockData from 'api/mock'
import store from '../store'
// import router from '../router';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.auth.token.accessToken) {
    config.headers['Access-Token'] = store.getters.auth.token.accessToken
  }
  return config
}, error => {
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data
    }
    if (response.status === 204) {
      return {}
    }
  },
  error => {
    return Promise.reject(error.response)
  }
)

// const mock = new MockAdapter(service, { delayResponse: 2000 })

// mockData(mock)
// if (process.env.API_MOCK === undefined || !process.env.API_MOCK) {
//   mock.restore()
// }
export default service
