import request from '@/utils/request'

const host = 'http://localhost:8086'

export type CommentCreator = {
  id: string,
  nick: string,
  imgUrl: string
}

export type CommentExtra = {
  platform?: string, // 平台
  device?: string // 设备
}

// 主评论
export type Comment = {
  id: string,
  creator: CommentCreator,
  targetId: string, // 评论对象、文章id
  content: string,
  like: number,
  hate: number,
  createTime: number,
  floor: number,
  subComments?: SubComment[],
  extra: string, // CommentExtra,
  [propName: string]: any
}

// 评论的回复
export type SubComment = {
  id: string,
  creator: CommentCreator,
  reCommentCreator?: string, // 要回复的人（回复的回复）
  targetId: string, // 评论对象、文章id
  commentId: string, // 评论id
  content: string,
  like: number,
  createTime: number,
  // extra: CommentExtra,
  [propName: string]: any
}

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
  page_size: number
}

type getSubCommentsResponse = {
  list: SubComment[]
  total: number
  page: number
  page_size: number
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

export function getMainComments (req: getCommentsRequest) {
  const params = {
    content_id: req.targetId,
    page: req.page || 1,
    page_size: req.pageSize || 10
  }

  return request<getCommentsResponse>({
    url: `${host}/comments`,
    params
  })
}

export function getSubComments (req: getCommentsRequest) {
  const params = {
    content_id: req.targetId,
    page: req.page || 1,
    page_size: req.pageSize || 10,
    target_id: req.commentId || 0
  }

  return request<getSubCommentsResponse>({
    url: `${host}/subcomments`,
    params
  })
}

export function sendComment (req: sendCommentRequest) {
  return request<sendCommentResponse>({
    method: 'post',
    url: `${host}/comments`,
    data: {
      content_id: req.targetId.toString(), // 文章id
      parent_id: req.commentId ? req.commentId.toString() : '', // 评论id
      content: req.content.toString(),
      re_comment_id: req.reCommentId ? req.reCommentId.toString() : '' // 回复id
    }
  })
}

export function likeComment (req: likeCommentRequest) {
  return request<likeCommentResponse>({
    method: 'post',
    url: `${host}/comments/like`,
    data: {
      comment_id: req.id
    }
  })
}

export function hateComment (req: hateCommentRequest) {
  return request<hateCommentResponse>({
    method: 'post',
    url: `${host}/comments/hate`,
    data: {
      comment_id: req.id
    }
  })
}
