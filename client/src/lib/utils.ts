import router from '@/router';
import store from '@/store';

import JWT from '@/lib/jwt';

/**
 * Makes HTTP POST call with payload and returns parses JSON
 *
 * @param url {string} URL to be submitted on
 * @param data {object} Data to be submitted to
 * @returns {Promise<Response>}
 */
export function httpPost(url: string, data: object): Promise<Response> {
  return fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    // tslint:disable-next-line:arrow-parens
    .then(response => response.json());
}

function isLoginPage(): boolean {
  return router.currentRoute.name === 'login';
}

export function logOut(redirect = true): void {
  JWT.clear();
  // noinspection JSIgnoredPromiseFromCall
  store.dispatch('setAuthenticated', false);
  sessionStorage.clear();
  localStorage.clear();

  if (isLoginPage() || !redirect) {
    return;
  }
  router.push({ name: 'login' });
}
