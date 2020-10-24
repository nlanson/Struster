import { normalizePassiveListenerOptions } from '@angular/cdk/platform';

export interface LoginIndv {
  username: string,
  password: string
}

export interface apiKey {
  login: string,
  key: string,
  folder_id: string
}

export class Login {
  //add you own custom logins here.
  LoginList: Array<LoginIndv> = [
    {username: "nlanson", password:" "},
    {username: "test", password:"test1234"},
  ]
}

export class apiKeys {
  //use your streamtape api keys here.
  //the folder_id is the folder where all the videos will be fetch and uploaded to.
  apiKey: apiKey = {
    login: "09c8392061b548eebd4e",
    key: "Z1doL1Qjm6Fq9Yd",
    folder_id: "DjOleF2OpRk"
  }
}
