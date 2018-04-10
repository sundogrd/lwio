import fetch from 'utils/fetch';
// TODO: add vuex in this file to simplify the params

export function getArticles(offset = 0, limit = 20) {
  return fetch({
    url: `/articles?offset=${offset}&limit=${limit}`,
    method: 'get'
  });
}

export function getArticle(id) {
  return fetch({
    url: `/articles/${id}`,
    method: 'get'
  });
}

export function postArticle({ title, content, tags }) {
  return fetch({
    url: '/articles',
    method: 'post',
    data: {
      title,
      content,
      tags
    }
  });
}