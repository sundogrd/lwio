
export type User = {
    id: string,
    avatar_url: string,

}
export type Content = {
    id: string
    title: string
}

export type ContentBrief = {
    id: string,
    title: string,
    cover_url: string,
    user: User
}

type CommentCreator = {
    id: string,
    nick: string,
    img_url: string
}

type CommentExtra = {
    platform: string,   // 平台
    device?: string      // 设备
}

export type Comment = {
    id: string,
    creator: CommentCreator,
    re_comment_creator?: string,
    target_id: string,
    content: string,
    like?: number,
    hate?: number,
    create_time: number,
    floor: number,
    subComments?: Comment[],
    extra: CommentExtra
}
