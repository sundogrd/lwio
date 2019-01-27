import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import config from '../../config'
// import store from '../store'

export interface IResponse<T> {
  err_msg: string;
  err_no: EResponseCode;
  data: T;
}

export enum EResponseCode {
  SUCCESS = 0,
}

interface IAxiosRequestCustomConfig {}

export class ResponseError<T = any> extends Error {
  response: IResponse<T>;
  constructor(resp: IResponse<T>) {
      super(resp.err_msg);
      this.response = resp;
  }
}

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
  (response: AxiosResponse<IResponse<any>>) => {
    return response
  },
  error => {
    return Promise.reject(error.response)
  }
)

export { service };

export const requestRaw = <T>(
    config: AxiosRequestConfig & IAxiosRequestCustomConfig,
) => service.request<IResponse<T>>(config);

// tslint:disable-next-line:no-any
export default function request<T = any>(
    config: AxiosRequestConfig & IAxiosRequestCustomConfig,
) {
    return requestRaw<T>(config).then(ret => ret.data.data);
}
