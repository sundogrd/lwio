import request from '@/utils/request'
import * as ContentConst from '@/const/content'

type getContentByIdRequest = {
    contentId: string
}
type getContentByIdResponse = {
    content_id: string,
    title: string,
    description: string,
    author_id: string,
    category: string,
    type: ContentConst.EType,
    body: string,
    body_type: ContentConst.EBodyType,
    version: number,
    created_at: string,
    updated_at: string,
    extra: {
        star_num: number,
        [key: string]: any,
    },
}
export function getContentById(req: getContentByIdRequest) {
    return request<getContentByIdResponse>({
        url: `/contents/${req.contentId}`,
        params: {
        },
    });
}