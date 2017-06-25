/**
 * Created by Claudiu on 5/9/2017.
 */
import {Component, OnInit, EventEmitter, Output, Class} from '@angular/core';
import {AuthenticationService} from "../service/authentication.service";
import {AccountService} from  "../service/account.service"
import {Account} from "../shared/account";

@Component({
  selector: 'meniu-bar',
  templateUrl: './meniu-bar.component.html',
  styleUrls: ['./meniu-bar.component.scss']
})
export class MeniuBarComponent implements OnInit {

  username: string;
  password: string;
  isLogged: boolean;
  account: Account;

  constructor(private authenticationService: AuthenticationService, private accountService:AccountService) {
  }

  ngOnInit() {
    this.isLogged=false;
    if(this.authenticationService.isAuthenticated()){
      let jsonData = JSON.parse(localStorage.getItem('currentAccount'));
      this.account = new Account(jsonData);
      this.isLogged = true;
    }
  }

  logout(){
    localStorage.clear();
    this.ngOnInit();
  }

  login() {
    // this.authenticationService.simpleLogin(this.username, this.password).subscribe(result => {
    this.authenticationService.login(this.username, this.password).subscribe(result => {
      if(result){
        this.accountService.get().toPromise().then(account => {
          this.account = new Account(account);
          this.isLogged=true;
          localStorage.setItem('currentAccount', JSON.stringify(this.account));

          console.log("in account",this.account);
        })
      }
    });
  }

}
