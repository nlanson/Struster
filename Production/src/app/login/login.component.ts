import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, Form } from '@angular/forms';
import { Login } from '../interfaces/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  LoginForm: FormGroup;
  LoginErrorMsg: string;

  constructor(
    private ls: LoginService,
    private route: Router,
    private fb: FormBuilder,
    private logints: Login

  ) { }

  ngOnInit(): void {
    if(this.ls.loginStatus == true){
      this.route.navigate(['home']);
    }

    this.LoginForm = this.fb.group(
      {
        u: [null],
        p: [null]
      }
    );

  }

  submit() {
    var username = this.LoginForm.value.u;
    var password = this.LoginForm.value.p;
    var array = this.logints.LoginList;
    var match: boolean = false;
    if(username == null || password == null){
      this.LoginErrorMsg = "Username or Password cannot be empty."
    } else {
      for(let i=0; i < array.length; i++){
        if(array[i].username == username && array[i].password == password){
          match = true;
          this.LoginErrorMsg = "";
          this.login();
        }
      }
      if(match != true) {
        this.LoginErrorMsg = "Username or Password is Incorrect"
      }
    }
  }

  login(){
    this.ls.lslogin();
  }

}
