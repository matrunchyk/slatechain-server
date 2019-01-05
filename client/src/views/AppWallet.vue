<template>
  <div class="app-wallet">
    <h3 class="blue-grey lighten-5 headline pa-4 font-weight-medium">
      JsCoin Wallet
    </h3>
    <v-layout row wrap>
      <v-flex xs6>
        <v-card dark class="yellow darken-3 border-radius-1 pt-4 pl-4 pb-4 no-elevation">
          <coin-card/>
        </v-card>
      </v-flex>
      <v-flex xs6>
        <v-card class="white no-elevation">
          <coin-transactions :shortDate="true"/>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    CoinCard: () => import(/* webpackChunkName: "coin-card" */ '@/components/CoinCard.vue'),
    CoinTransactions: () => import(/* webpackChunkName: "coin-transactions" */ '@/components/CoinTransactions.vue'),
  },
})
export default class AppWallet extends Vue {}
</script>

