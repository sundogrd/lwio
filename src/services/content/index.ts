import request from '@/utils/request'
export type ContentInfo = {
    content_id: string,
    title: string,
    description: string,
    author_id: string,
    category: string,
    type: EType,
    body: string,
    body_type: EBodyType,
    version: number,
    created_at: string,
    updated_at: string,
    extra: {
        star_num: number,
        [key: string]: any,
    },
}

export enum EType {
    TEXT = 1,
    AUDIO = 2,
    VIDEO = 4,
}

export enum EBodyType {
    BODY_TEXT = 1,
    BODY_HTML = 2,
    BODY_MARKDOWN = 3,
    BODY_LATEX = 4,
}

type getContentByIdRequest = {
    contentId: string
}
type getContentByIdResponse = {
    
} & ContentInfo
export function getContentById(req: getContentByIdRequest) {
    return request<getContentByIdResponse>({
        url: `/contents/${req.contentId}`,
        params: {
        },
    });
}

type createContentRequest = {
    title: string,
    type: EType,
    body: string,
    body_type: EBodyType
}
type createContentResponse = {
} & ContentInfo
export function createContent(req: createContentRequest) {
    return request<createContentResponse>({
        method: 'post',
        url: `/contents`,
        data: {
            ...req
        },
    });
}

type getContentsRequest = {
}
type getContentsResponse = {
    list: ContentInfo[],
    total: number
}

export function getContents(req: getContentsRequest) {
    return request<getContentsResponse>({
        method: 'get',
        url: `/contents`,
    })
}