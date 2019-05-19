import request from './request'
import { Comment, SubComment } from './types/comment'

export type SundogComment = {
  count: number
}

type getCommentsRequest = {
  commentId?: string,
  targetId: string,
  page?: number
  pageSize?: number
}

type getCommentsResponse = {
  list: Comment[]
  total: number
  page: number
  pageCount: number
}

type getSubCommentsResponse = {
  list: SubComment[]
  total: number
  page: number
  pageCount: number
}

type sendCommentRequest = {
  commentId?: string,
  targetId: string,
  content: string,
  creatorId: string,
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

export function getMainComments (url: string, req: getCommentsRequest) {
  const params = {
    content_id: req.targetId,
    page: req.page || 1,
    page_size: req.pageSize || 10
  }

  return request<getCommentsResponse>({
    url,
    params
  })
}

export function getSubComments (url: string, req: getCommentsRequest) {
  const params = {
    content_id: req.targetId,
    page: req.page || 1,
    page_size: req.pageSize || 10,
    target_id: req.commentId || 0
  }

  return request<getSubCommentsResponse>({
    url,
    params
  })
}

export function sendComment (url: string, req: sendCommentRequest) {
  return request<sendCommentResponse>({
    method: 'post',
    url,
    // url: '/comments',
    // url: 'http://localhost:8086/comments',
    data: {
      content_id: req.targetId.toString(), // 文章id
      parent_id: req.commentId ? req.commentId.toString() : '', // 评论id
      content: req.content.toString(),
      re_comment_id: req.reCommentId ? req.reCommentId.toString() : '' // 回复id
    }
  })
}

export function likeComment (url: string, req: likeCommentRequest) {
  return request<likeCommentResponse>({
    method: 'post',
    url,
    data: {
      comment_id: req.id
    }
  })
}

export function hateComment (url: string, req: hateCommentRequest) {
  return request<hateCommentResponse>({
    method: 'post',
    url,
    data: {
      comment_id: req.id
    }
  })
}
