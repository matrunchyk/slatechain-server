<template>
  <div class="app-login mt-5">
    <v-layout align-center
              justify-center>
      <v-flex xs12
              sm8
              md4>
        <v-card class="elevation-12">
          <v-toolbar dark
                     color="primary">
            <v-toolbar-title>JsCoin Wallet Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field prepend-icon="person"
                            v-model="model.email"
                            label="Email"
                            type="text"/>
              <v-text-field prepend-icon="lock"
                            v-model="model.password"
                            label="Password"
                            type="password"/>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="primary"
                   @click="login">Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import Login from '@/models/Login';
import { LoginData } from '@/index';
import JWT from '@/lib/jwt';

@Component
export default class AppLogin extends Vue {
  @Action('setAuthenticated') setAuthenticated: any;
  @Action('setUser') setUser: any;

  public model = new Login();

  public async login(): Promise<void> {
    try {
      const loginData: LoginData = await this.model.submit();

      JWT.storageSet('accessToken', loginData.accessToken);
      await this.setAuthenticated(loginData.auth);
      await this.setUser(loginData.user);

      this.$router.push({ name: 'wallet' });
    } catch (e) {
    }
  }
}
</script>
