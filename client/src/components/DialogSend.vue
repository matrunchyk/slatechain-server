<template>
  <v-dialog v-model="value" persistent max-width="600px">
    <v-card>
      <v-card-text>
        <v-layout column class="align-center">
          <img src="/img/popup-add-wallet-icon.png"
               width="150"
               alt="">
          <div class="title mt-3">Send JSC</div>
        </v-layout>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 >
              <v-text-field label="Enter JSC address" required/>
            </v-flex>
            <v-flex xs12>
              <v-text-field type="number" label="Amount" required/>
            </v-flex>
            <v-flex xs12>
              <v-textarea label="Write an optional message"/>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="close">Close</v-btn>
        <v-btn color="blue darken-1 white--text" @click="close">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class DialogSend extends Vue {
  @Prop(Boolean) protected value: boolean = false;

  protected close($event: Event) {
    this.$emit('input', false);
  }
}
</script>
