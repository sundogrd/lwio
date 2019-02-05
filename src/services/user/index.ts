import request from '@/utils/request'
export type UserInfo = {
    user_id: string,
    name: string,
    avatar_url: string,
    company?: string,
    created_at: string,
    updated_at: string,
    email: string,
    extra: {
        github_home?: string
    },
}
