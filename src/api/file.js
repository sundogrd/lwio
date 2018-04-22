import fetch from 'utils/fetch';

export function getFiles() {
  return fetch({
    url: '/file/list',
    method: 'get'
  });
}