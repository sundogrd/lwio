import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import config from '../../config'
// import store from '../store'

export enum EResponseCode {
  SUCCESS = 0,
}

interface IAxiosRequestCustomConfig {}

// 创建axios实例
const service = axios.create({
  baseURL: config.baseUrl, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  return config
}, error => {
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return response
  },
  error => {
    return Promise.reject(error.response)
  }
)

export { service };

export const requestRaw = <T>(
    config: AxiosRequestConfig & IAxiosRequestCustomConfig,
) => service.request<T>(config);

// tslint:disable-next-line:no-any
export default function request<T = any>(
    config: AxiosRequestConfig & IAxiosRequestCustomConfig,
) {
    return requestRaw<T>(config).then(ret => ret.data);
}
