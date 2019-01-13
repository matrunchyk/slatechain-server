<template>
  <div>
    <div class="title ma-4">JsCoin wallet transactions</div>
    <v-data-table
      hide-headers
      :headers-length="3"
      :items="transactions"
      item-key="_id"
      :pagination.sync="defaultPagination"
    >
      <template slot="items"
                slot-scope="props">
        <tr @click="toggleTransaction(props)">
          <td class="text-xs-right grey--text text--lighten-1 font-weight-bold">
            {{ brief ? props.item.shortDate : props.item.longDate  }}
          </td>
          <td class="text-xs-left">
            <!--<v-icon class="amber&#45;&#45;text"-->
                    <!--v-if="props.item.status === 0">remove_circle_outline-->
            <!--</v-icon>-->
            <v-icon class="circle-icon green--text"
                    v-if="props.item.isIncoming">keyboard_arrow_left
            </v-icon>
            <v-icon class="circle-icon light-blue--text"
                    v-else>keyboard_arrow_right
            </v-icon>
            <!--<v-icon class="deep-orange&#45;&#45;text"-->
                    <!--v-if="props.item.status === 3">highlight_off-->
            <!--</v-icon>-->
            {{ props.item.verbText }} {{ props.item.recipient._id }}
          </td>
          <td class="text-xs-right">
            <div :class="{
              'deep-orange--text': props.item.isOutgoing,
              'green--text': props.item.isIncoming,
            }">
              <span v-if="props.item.isOutgoing">-</span>
              {{ props.item.amount.toFixed(2) }} JSC
            </div>
            <div class="grey--text text--lighten-1">{{ props.item.dollar_amount.toFixed(2) }} USD</div>
          </td>
        </tr>
      </template>
      <template slot="expand"
                slot-scope="props">
        <div class="transaction-details"
             v-if="selectedTransaction">
          <div class="font-weight-bold">Date:</div>
          <div>{{ selectedTransaction.date }}</div>
          <div class="font-weight-bold">Sender name:</div>
          <div>{{ selectedTransaction.sender.profile.name }}</div>
          <div class="font-weight-bold">Sender address:</div>
          <div>{{ selectedTransaction.sender.profile.location }}</div>
          <div class="font-weight-bold">Direction:</div>
          <div>{{ selectedTransaction.direction }}</div>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ICollection, ITransaction, IVDatatableProps } from '@/index';
import Transaction from '@/models/Transaction';

@Component
export default class CoinTransactions extends Vue {
  @Prop({default: false}) protected brief: boolean;

  protected model: Transaction = new Transaction();
  protected transactions: ITransaction[] = [];

  protected defaultPagination = {
    descending: false,
    page: 1,
    rowsPerPage: 10,
    sortBy: null,
    totalItems: 0,
  };

  protected selectedTransaction: Transaction = Transaction.empty();

  protected toggleTransaction(props: IVDatatableProps): void {
    props.expanded = !props.expanded;
    this.selectedTransaction = props.item;
  }

  async mounted() {
    this.transactions = (await this.model.get() as ICollection).all();
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

  .transaction-details
    display grid
    grid-template-columns 110px 200px
    margin 20px 0 20px 80px
</style>
