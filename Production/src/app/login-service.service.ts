import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private route: Router,
  ) { }

  loginStatus: boolean = false;

  lslogin() {
    this.loginStatus = true;
    this.route.navigate(['home']);
  }

  lslogout() {
    this.loginStatus = false;
    this.route.navigate(['login']);
  }
}
