import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import { State } from '@/index';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence<State>({
  storage: window.localStorage,
  reducer: state => ({ user: state.user }),
});

export default new Vuex.Store<State>({
  state: {
    authenticated: false,
    user: null,
  },
  getters: {
    authenticated: store => store.authenticated,
    user: store => store.user,
  },
  mutations: {
    setAuthenticated(store, payload: boolean) {
      Object.assign(store, {
        authenticated: payload,
      });
    },
    setUser(store, payload: object) {
      Object.assign(store, {
        user: payload,
      });
    },
  },
  actions: {
    setAuthenticated({ commit }, payload: boolean) {
      commit('setAuthenticated', payload);
    },
    setUser({ commit }, payload: object) {
      commit('setUser', payload);
    },
  },
  plugins: [vuexLocal.plugin],
});
