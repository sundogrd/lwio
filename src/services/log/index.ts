import request from '@/utils/request'

export type LogCountInfo = {
    count: number
}

type getClapCountByIdRequest = {
    contentId: string
}

type getClapCountByIdResponse = {
} & LogCountInfo

type addClapRequest = {
    articleId: string,
    userId: string,
}

type addClapResponse = {
    type:    string,
    id:       string,
    user_id:   string,
    target_id: string,
    extra:    any,
} 

export function getStatementById(req: getClapCountByIdRequest) {
    return request<getClapCountByIdResponse>({
        url: `/statement`,
        params: {
            target_id: req.contentId,
            type: 'clap'
        },
    });
}

export function addStatement(req: addClapRequest) {
    return request<addClapResponse>({
        method: 'post',
        url: `/statement`,
        data: {
            target_id: req.articleId,
            user_id: req.userId,
            type: 'clap'
        },
    });
}
