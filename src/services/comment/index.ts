import request from '@/utils/request'

export type Comment = {
  commentId: string
  targetId: string
  creatorId: string
  parentId?: string
  reCommentId?: string
  content: string
  extra: string
  like: number
  hate: number
  state: number
  createdAt: number
  modifiedAt?: number
  floor: number
}

export type SundogComment = {
  count: number
}

type getCommentsRequest = {
  contentId: string,
  targetId?: string,
  page?: number
  pageSize?: number
}

type getCommentsResponse = {
  list: Comment[]
  total: number
}

type sendCommentRequest = {
  contentId: string,
  targetId: string,
  content: string,
  reCommentId?: string,
}

type sendCommentResponse = {
  commentId: string
}

type likeCommentRequest = {
  id: string
}

type likeCommentResponse = {
  id: string
}

type hateCommentRequest = {
  id: string
}

type hateCommentResponse = {
  id: string
}

export function getComments (req: getCommentsRequest) {
  const params = {
    content_id: req.contentId,
    page: req.page || 1,
    pageSize: req.pageSize || 10,
    target_id: req.targetId || 0
  }

  return request<getCommentsResponse>({
    // url: `/comments`,
    url: 'http://localhost:8086/comments',
    params
  })
}

export function sendComment (req: sendCommentRequest) {
  return request<sendCommentResponse>({
    method: 'post',
    // url: '/comments',
    url: 'http://localhost:8086/comments',
    data: {
      content_id: req.contentId, // 文章id
      parent_id: req.targetId, // 评论id
      content: req.content,
      re_comment_id: req.reCommentId || '' // 回复id
    }
  })
}

export function likeComment (req: likeCommentRequest) {
  return request<likeCommentResponse>({
    method: 'post',
    url: 'http://localhost:8086/comments',
    data: {
      comment_id: req.id
    }
  })
}

export function hateComment (req: hateCommentRequest) {
  return request<hateCommentResponse>({
    method: 'post',
    url: 'http://localhost:8086/comments',
    data: {
      comment_id: req.id
    }
  })
}
