import { normalizePassiveListenerOptions } from '@angular/cdk/platform';

export interface LoginIndv {
  username: string,
  password: string
}

export class Login {
  LoginList: Array<LoginIndv> = [
    {username: "owo", password:"owo"},
    {username: "test", password:"test"},
  ]


}
