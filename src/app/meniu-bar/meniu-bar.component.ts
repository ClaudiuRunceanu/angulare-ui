/**
 * Created by Claudiu on 5/9/2017.
 */
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'meniu-bar',
  templateUrl: './meniu-bar.component.html',
  styleUrls: ['./meniu-bar.component.scss']
})
export class MeniuBarComponent implements OnInit {

  username: string;
  password: string;

  constructor() { }

  ngOnInit() {

  }

  login () {
    console.log("username: ", this.username);
    console.log("password: ", this.password);
  }

}
