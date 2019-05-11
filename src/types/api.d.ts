
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
