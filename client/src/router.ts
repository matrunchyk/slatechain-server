import Vue from 'vue';
import Router from 'vue-router';
import { rejectAuth, requireAuth } from '@/lib/auth';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'wallet',
      beforeEnter: requireAuth,
      component: () => import(/* webpackChunkName: "home" */ './views/AppWallet.vue'),
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter: rejectAuth,
      component: () => import(/* webpackChunkName: "login" */ './views/AppLogin.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      beforeEnter: rejectAuth,
      component: () => import(/* webpackChunkName: "signup" */ './views/AppSignup.vue'),
    },
    {
      path: '/transactions',
      name: 'transactions',
      beforeEnter: requireAuth,
      component: () => import(/* webpackChunkName: "about" */ './views/AppTransactions.vue'),
    },
    {
      path: '/buy-sale',
      name: 'buy_sale',
      beforeEnter: requireAuth,
      component: () => import(/* webpackChunkName: "about" */ './views/AppBuySale.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      beforeEnter: requireAuth,
      component: () => import(/* webpackChunkName: "about" */ './views/AppSettings.vue'),
    },
    {
      path: '/support',
      name: 'support',
      beforeEnter: requireAuth,
      component: () => import(/* webpackChunkName: "about" */ './views/AppSupport.vue'),
    },
  ],
});
