<template>
  <div id="app" :class="{ authenticated }">
    <v-app id="jscoin">
      <v-navigation-drawer
        v-if="authenticated"
        :width="220"
        v-model="drawer"
        fixed
        app
        class="drawer-left"
      >
        <v-toolbar class="elevation-0 toolbar-left">
          <v-toolbar-title class="ml-0 pl-3">
            <div class="hidden-sm-and-down d-flex logo-wrapper">
              <coin-logo/>
              <span>JsCoin</span>
            </div>
          </v-toolbar-title>
        </v-toolbar>

        <v-list class="navigation-main">
          <template v-for="item in items">
            <v-list-tile :key="item.text" :to="item.href" exact dark active-class="primary--text">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-navigation-drawer>

      <v-toolbar v-if="authenticated" dark fixed app class="elevation-0 toolbar-main">
        <v-toolbar-title class="ml-0 pl-3">
          <v-toolbar-side-icon @click.stop="drawer = !drawer"/>
        </v-toolbar-title>
        <v-spacer/>
        <v-btn icon>
          <v-icon>notifications</v-icon>
        </v-btn>
        <v-btn icon large @click="doShowMenu">
          <v-avatar size="32px">
            <img :src="user.gravatar"
                 :alt="user.profile.name"
            >
          </v-avatar>
        </v-btn>
        <span @click="doShowMenu">{{ user.profile.name }}</span>
        <v-menu
          v-model="showMenu"
          :position-x="menuX"
          :position-y="menuY"
          absolute
          offset-y
        >
          <v-list dense>
            <v-list-tile @click="">
              <v-list-tile-title>Support</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="">
              <v-list-tile-title>Settings</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="logOut">
              <v-list-tile-title>Log out</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar>

      <v-content>
        <v-container fluid class="pa-0">
          <router-view/>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { UserModel } from '../../server/models/User';
import { logOut } from '@/lib/utils';

@Component({
  components: {
    CoinLogo: () => import(/* webpackChunkName: "coin-logo" */ '@/components/CoinLogo.vue'),
  },
})
export default class App extends Vue {
  @Getter protected authenticated!: boolean;
  @Getter protected user!: UserModel;

  protected menuX = 0;
  protected menuY = 0;
  protected showMenu = false;
  protected dialog = false;
  protected drawer = null;
  protected items = [
    { icon: 'account_balance_wallet', text: 'Wallet', href: { name: 'wallet' } },
    { icon: 'history', text: 'Transactions', href: { name: 'transactions' } },
    { icon: 'payment', text: 'Buy/Sale', href: { name: 'buy_sale' } },
    { icon: 'settings', text: 'Settings', href: { name: 'settings' } },
    { icon: 'chat_bubble', text: 'Support', href: { name: 'support' } },
  ];

  protected doShowMenu(event: MouseEvent) {
    this.menuX = event.x - 25;
    this.menuY = event.y + 15;
    this.showMenu = true;
  }

  protected logOut() {
    logOut();
  }
}
</script>

<style lang="stylus">
  #jscoin
    font-family 'Titillium Web', sans-serif !important

  .toolbar-main
  .toolbar-left
    .v-toolbar__content
      height 90px !important
      background-color #F2F5F6

  .toolbar-main
    .v-toolbar__content
      background-image linear-gradient(to right, #724cfd 0, #3da8f3 100%)

  .logo-wrapper
    width 150px
    align-items center

  .drawer-left
    background-image linear-gradient(-6deg, #30343a 0, #24272d 100%)

    .v-list
      background none
      height calc(100% - 90px)
      display flex
      flex-direction column
      justify-content center
      padding-left 20px
      color #fff

      .v-icon
        color #fff

  .authenticated
    main.v-content
      padding-top 90px !important
</style>
