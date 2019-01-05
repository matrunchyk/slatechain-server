import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'wallet',
      component: () => import(/* webpackChunkName: "home" */ './views/AppWallet.vue'),
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import(/* webpackChunkName: "about" */ './views/AppTransactions.vue'),
    },
    {
      path: '/buy-sale',
      name: 'buy_sale',
      component: () => import(/* webpackChunkName: "about" */ './views/AppBuySale.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import(/* webpackChunkName: "about" */ './views/AppSettings.vue'),
    },
    {
      path: '/support',
      name: 'support',
      component: () => import(/* webpackChunkName: "about" */ './views/AppSupport.vue'),
    },
  ],
});
