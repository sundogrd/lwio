import request from '@/utils/request'

export type LogCountInfo = {
    count: number
}

type getClapCountByIdRequest = {
    contentId?: string,
    userId?: string
}

type getClapCountByIdResponse = {
} & LogCountInfo

type addClapRequest = {
    articleId: string,
    userId: string,
}

type addClapResponse = {
    type: string,
    id: string,
    user_id: string,
    target_id: string,
    extra: any,
    msg?: string,
}

export function getStatementById (req: getClapCountByIdRequest) {
  return request<getClapCountByIdResponse>({
    url: `/log/count`,
    params: {
      user_id: req.userId,
      target_id: req.contentId,
      type: 'CLAP'
    }
  })
}

export function addStatement (req: addClapRequest) {
  return request<addClapResponse>({
    method: 'post',
    url: '/log',
    data: {
      target_id: req.articleId,
      user_id: req.userId,
      type: 'CLAP'
    }
  })
}
