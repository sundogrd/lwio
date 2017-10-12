import fetch from 'utils/fetch';

export function githubLogin(code) {
  return fetch({
    url: `/api/auth/github?code=${code}`,
    method: 'get',
  });
}