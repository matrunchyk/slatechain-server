import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './global.styl';
import VueGraphqlModels from 'vue-graphql-models';
import { cachePersistor, createProvider } from '@/lib/vue-apollo';

Vue.config.productionTip = false;

Vue.use(VueGraphqlModels, {
  debug: true,
  cachePersistor,
  cacheLife: 60,
  dataLoader(path: string) {
    return import(/* webpackChunkName: "data/[request]" */ `@/data/${path}`);
  },
  modelLoader(path: string) {
    return import(/* webpackChunkName: "models/[request]" */ `@/models/${path}`);
  },
  gqlLoader(path: string) {
    return import(/* webpackChunkName: "gql/[request]" */ `@/gql/${path}.graphql`);
  },
});

new Vue({
  router,
  store,
  render: h => h(App),
  apolloProvider: createProvider(),
}).$mount('#app');
