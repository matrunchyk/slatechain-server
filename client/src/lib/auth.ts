import { Route } from 'vue-router/types/router';
import JWT from '@/lib/jwt';
import { NextFunction } from '@/index';
import { logOut } from '@/lib/utils';
import store from '@/store';

export async function checkAuth(): Promise<boolean> {
  const authenticated = JWT.retrieve().then(token => !!token).catch(() => false);

  await store.dispatch('setAuthenticated', authenticated);

  return authenticated;
}

export async function requireAuth(from: Route, to: Route, next: NextFunction) {
  const isAuth = await checkAuth();

  if (isAuth) {
    next();
    return;
  }

  return next({ name: 'login' });
}

export async function rejectAuth(from: Route, to: Route, next: NextFunction) {
  const isAuth = await checkAuth();

  if (isAuth) {
    next({ name: 'wallet' });
    return;
  }

  // Logout completely and clear left-overs, skip redirection though
  logOut(false);
  return next();
}
