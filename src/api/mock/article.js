export default function articleRule(mockAdapter) {
  mockAdapter
    .onGet(/articles\/\d+/)
    .reply(200, {
      id: '2',
      title: '文章测试3',
      brief: '成功',
      tags: ['Javascript', 'AI'],
      updated_at: '2017-07-20T12:50:30.176Z',
      created_at: '2017-07-20T12:50:30.176Z',
      page_view: 4
    })
    .onGet(/articles\?/)
    .reply(200, {
      articles: [{
        id: '1',
        title: '文章接口测试',
        brief: '成功',
        tags: ['安全', '前端'],
        updated_at: '2017-07-20T12:50:30.176Z',
        created_at: '2017-07-20T12:50:30.176Z',
        page_view: 3
      }, {
        id: '2',
        title: '文章测试2',
        brief: '成功',
        tags: ['安全', '前端'],
        updated_at: '2017-07-20T12:50:30.176Z',
        created_at: '2017-07-20T12:50:30.176Z',
        page_view: 2
      }, {
        id: '2',
        title: '文章测试3',
        brief: '成功',
        tags: ['Javascript', 'AI'],
        updated_at: '2017-07-20T12:50:30.176Z',
        created_at: '2017-07-20T12:50:30.176Z',
        page_view: 4
      }],
      total: 3
    })
    .onPost('/articles')
    .reply(200, {
      id: 410
    });
}
