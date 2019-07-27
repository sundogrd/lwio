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
  targetId: string,  // 评论对象、文章id
  content: string,
  like: number,
  hate: number,
  createTime: number,
  floor: number,
  subComments?: SubComment[],
  extra: string, //CommentExtra,
  [propName: string]: any
}

// 评论的回复
export type SubComment = {
  id: string,
  creator: CommentCreator,
  reCommentCreator?: string, // 要回复的人（回复的回复）
  targetId: string,  // 评论对象、文章id
  commentId: string,  // 评论id
  content: string,
  like: number,
  createTime: number,
  // extra: CommentExtra,
  [propName: string]: any
}
