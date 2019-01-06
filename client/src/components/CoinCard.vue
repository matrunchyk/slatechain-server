<template>
  <div class="coin-card">
    <div class="coin-card-l1">
      <coin-logo
        fill="#F7A737"
        :size="64"
        class="coin-logo"
      />

      <v-layout column>
        <div class="font-weight-bold">JSCoin Wallet</div>
        <div>JSC</div>
      </v-layout>

      <v-layout column>
        <div class="font-weight-bold">1 JSC</div>
        <div>{{ CURRENT_RATE }} USD</div>
      </v-layout>

      <v-layout column>
        <div class="font-weight-bold font-14">Balance</div>
        <div class="font-weight-bold">0.321 JSC</div>
        <div>13,321.01 USD</div>
      </v-layout>
    </div>
    <div class="coin-card-l2 coin-card-l2 font-12 pr-4 pt-4">
      <span class="font-weight-bold">Wallet number: </span>
      <span>0x45e1D2D3C1d001aC30E9C0B10e3a9cdD35018Bf0</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {CURRENT_RATE} from '@/constants';

@Component({
  components: {
    CoinLogo: () => import(/* webpackChunkName: "coin-logo" */ '@/components/CoinLogo.vue'),
  },
})
export default class CoinCard extends Vue {
  protected CURRENT_RATE = CURRENT_RATE;
}
</script>

<style lang="stylus" scoped>
  .coin-card
    font-size 16px

    .coin-card-l1
      display grid
      grid-template-columns 75px auto auto auto
      align-items center

      .coin-logo
        background-color #fff
        padding 7px
        border-radius 10px

    .coin-card-l2
      text-align right
</style>
