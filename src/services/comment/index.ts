import request from '@/utils/request'

export type Comment = {
  CommentId: string
  TargetId: string
  CreatorId: string
  ParentId: string
  ReCommentId: string
  Content: string
  Extra: string
  Like: number
  Hate: number
  State: number
  CreatedAt: number
  ModifiedAt: number
  Floor: number
}

export type SundogComment = {
  count: number
}

type getCommentsRequest = {
  contentId?: string,
  page?: number
  pageSize: number
}

type getCommentsResponse = {
  list: Comment[]
  total: number
}

type sendCommentRequest = {
  targetId: string,
  content: string,
}

type sendCommentResponse = {
  commentId: string
}

export function getComments (req: getCommentsRequest) {
  return request<getCommentsResponse>({
    url: `/comments`,
    params: {
      content_id: req.contentId,
      page: req.page || 1,
      pageSize: 20
    }
  })
}

export function sendComment (req: sendCommentRequest) {
  return request<sendCommentResponse>({
    method: 'post',
    url: '/comments',
    data: {
      target_id: req.targetId,
      content: req.content
    }
  })
}
