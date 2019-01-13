import BaseModel from './BaseModel';
import loginQuery from '@/gql/auth/mutations/login.graphql';

export default class Login extends BaseModel {
  public email: string = '';
  public password: string = '';

  // noinspection JSMethodCanBeStatic
  get defaults() {
    return {
      email: '',
      password: '',
    };
  }

  public submit() {
    const { email, password } = this;
    // @ts-ignore
    return this.save(loginQuery, {
      email,
      password,
    });
  }
}
