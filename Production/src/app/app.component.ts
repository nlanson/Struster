import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { LoginService } from './login-service.service';
import { HomeComponent } from './home/home.component';


@Injectable()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {

  }

  constructor(
    public ls: LoginService,
    private hc: HomeComponent

  ) { }

}//end class
