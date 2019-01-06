<template>
  <div class="coin-graph">
    <div class="title my-4">JsCoin chart</div>
    <canvas ref="coinGraphChart"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Chart from 'chart.js';
import {stubChartData} from '@/plugins/stubChartData';

@Component({})
export default class CoinGraph extends Vue {
  protected chart: Chart|object = {};

  private mounted() {
    const canvas = this.$refs.coinGraphChart as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    this.chart = new Chart(ctx, {
      type: stubChartData.type,
      data: stubChartData.data,
      options: stubChartData.options,
    });
  }
}
</script>


