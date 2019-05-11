import request from '@/utils/request'

type getIResponse = {
    id: string,
    name: string
}
export function getI () {
  return request<getIResponse>({
    url: `/i`
  })
}
