<template>
  <div>
    <div class="title ma-4">JsCoin wallet transactions</div>
    <v-data-table
      hide-headers
      :items="transactions"
      item-key="_id"
    >
      <template slot="items"
                slot-scope="props">
        <tr @click="props.expanded = !props.expanded">
          <td class="text-xs-right grey--text text--lighten-1 font-weight-bold">{{ props.item.date }}</td>
          <td class="text-xs-left">
            <v-icon class="amber--text" v-if="props.item.status === 0">remove_circle_outline</v-icon>
            <v-icon class="circle-icon light-blue--text" v-if="props.item.status === 1">keyboard_arrow_right</v-icon>
            <v-icon class="circle-icon green--text" v-if="props.item.status === 2">keyboard_arrow_left</v-icon>
            <v-icon class="deep-orange--text" v-if="props.item.status === 3">highlight_off</v-icon>
            {{ props.item.description }}
          </td>
          <td class="text-xs-right">
            <div :class="{
              'deep-orange--text': props.item.jsc_amount < 0,
              'green--text': props.item.jsc_amount > 0,
            }">{{ props.item.jsc_amount }} JSC</div>
            <div class="grey--text text--lighten-1">{{ props.item.$_amount }} USD</div>
          </td>
        </tr>
      </template>
      <template slot="expand"
                slot-scope="props">
        <v-card flat>
          <v-card-text>Peek-a-boo!</v-card-text>
        </v-card>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {CURRENT_RATE, TRANSACTION_STATUS, TRANSACTION_STATUS_MAPS} from "@/constants";

const regDateOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
};
const regTimeOptions = {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
};

@Component({
  props: {
    shortDate: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
})
export default class CoinTransactions extends Vue {
  protected transactions = [];

  mounted() {
    const dateOptions = this.shortDate ? regDateOptions : Object.assign({}, regDateOptions, regTimeOptions);

    for (let i = 0; i < 200; i++) {
      const date = new Date();
      const status = Math.floor(Math.random() * 4);
      const op = Math.random() > 0.5 ? -1 : 1;
      const amount = (Math.floor(Math.random() * 10) * op);

      const trn = {
        _id: i,
        date: new Intl.DateTimeFormat('en-US', dateOptions).format(date),
        status,
        description: `${TRANSACTION_STATUS_MAPS[status]} to 3Bhe5sbhSTNxcDpYyy..`,
        jsc_amount: amount.toFixed(2),
        $_amount: (amount * CURRENT_RATE).toFixed(2),
      };
      this.transactions.push(trn);
    }
  }
}
</script>

<style lang="stylus">
  .circle-icon
    border 2px solid
    border-radius 20px
    margin-right 3px
    font-size 16px
    margin-left 1px
</style>
