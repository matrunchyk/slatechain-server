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
        <v-card dark class="white black--text border-radius-1 pt-4 pl-4 pb-4 no-elevation">
          <coin-graph/>
        </v-card>
        <div class="ml-5">
          <v-btn class="primary" @click="dialogSendVisible = true">Send JsCoin</v-btn>
          <v-btn class="secondary">Buy JsCoin</v-btn>
        </div>
      </v-flex>
      <v-flex xs6>
        <v-card class="white no-elevation">
          <coin-transactions :brief="true"/>
        </v-card>
      </v-flex>
    </v-layout>
    <dialog-send v-model="dialogSendVisible"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    CoinCard: () => import(/* webpackChunkName: "coin-card" */ '@/components/CoinCard.vue'),
    CoinTransactions: () => import(/* webpackChunkName: "coin-transactions" */ '@/components/CoinTransactions.vue'),
    CoinGraph: () => import(/* webpackChunkName: "coin-graph" */ '@/components/CoinGraph.vue'),
    DialogSend: () => import(/* webpackChunkName: "dialog-send" */ '@/components/DialogSend.vue'),
  },
})
export default class AppWallet extends Vue {
  protected dialogSendVisible: boolean = false;
}
</script>

