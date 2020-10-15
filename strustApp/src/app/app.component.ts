import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Reg, file }  from './interfaces/backendRes'

@Injectable()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'strustApp';

  registery: Reg;
  search: FormGroup;
  showBtn: boolean;
  showVid: boolean;
  vidurl: SafeResourceUrl;
  searchTerm: String;
  api_url: string;
  file: file;
  fileNotFound: file = {
    name: "file_not_found",
    size: 0,
    link: "not applicable",
    created_at: "never",
    downloads: 0,
    linkid: "not applicable",
    convert: "none"
  };
  NotFoundToggle: boolean = false;
  NotFoundDisplay: string;


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit() {
    this.showVid = false;
    this.showBtn = false;

    this.update();

    this.search = this.fb.group(
      {
        searchTerm: [null]
      }
    )
  }//end Init

  update(){
    this.api_url = "https://api.streamtape.com/file/listfolder?login=09c8392061b548eebd4e&key=Z1doL1Qjm6Fq9Yd&folder=DjOleF2OpRk"; //Change API Keys here.
    this.http.get<Reg>(this.api_url).subscribe(data => {                                                                           //All videos searchable in Struster should be in one folder at source.
      this.registery = data;
    });
  }//end update

  submit() {
    this.showVid = false;
    this.NotFoundToggle = false;
    this.searchTerm = this.search.value.searchTerm;
    this.searchTerm = this.searchTerm.toLowerCase().trim();
    //console.log(this.registery);
    let j:number = this.registery.result.files.length;

    for(let i=0; i<j; i++) {
      this.file = this.registery.result.files[i];
      if(this.searchTerm == this.file.name) {
        break;
      }
      this.file = this.fileNotFound;
    }
    //console.log(this.file);
    this.showBtn = true;
  }//end submit

  loadVid() {
    this.showBtn = false;

    if(this.file == this.fileNotFound){
      console.log("RIP not found");
      this.NotFoundToggle = true;
      this.NotFoundDisplay = "File not found."
    } else {
      let concat = "https://streamtape.com/e/" + this.file.linkid;
    this.vidurl = this.sanitizer.bypassSecurityTrustResourceUrl(concat);
    this.showVid = true;
    }
  }//end load

}//end class
