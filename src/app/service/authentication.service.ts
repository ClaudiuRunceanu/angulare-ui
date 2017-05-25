﻿import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import {Principal} from "./principal.service";

@Injectable()
export class AuthenticationService {
    public token: string;

    constructor(private http: Http, private principal: Principal,) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    login(username: string, password: string): Observable<boolean> {
        // return this.http.post('/api/authenticate', JSON.stringify({ username: username, password: password }))

        let data = 'j_username=' + encodeURIComponent(username) +
            '&j_password=' + encodeURIComponent(password) +
            '&remember-me=' + false + '&submit=Login';
        let headers = new Headers ({
            'Content-Type': 'application/x-www-form-urlencoded'
        });


        console.log("in login authentification service");
        return this.http.post('http://localhost:8080/api/authentication', data, {
            headers: headers
        })
            .map((response: Response) => {

            console.log("response from authentification");
            console.log(response);
                // login successful if there's a jwt token in the response

              this.principal.identity(true).then(account => {
                // After the login the language will be changed to
                // the language selected by the user during his registration

                console.log("account: ",account);

              });


                // let token = response.json() && response.json().token;
                // if (token) {
                //     // set token property
                //     this.token = token;
                //
                //     // store username and jwt token in local storage to keep user logged in between page refreshes
                //     localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
                //
                //     // return true to indicate successful login
                //     return true;
                // } else {
                //     // return false to indicate failed login
                //     return false;
                // }

              return true;
            });
    }


    // loginInt (credentials): Observable<any> {
    //     let data = 'j_username=' + encodeURIComponent(credentials.username) +
    //         '&j_password=' + encodeURIComponent(credentials.password) +
    //         '&remember-me=' + credentials.rememberMe + '&submit=Login';
    //     let headers = new Headers ({
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     });
    //
    //     return this.http.post('api/authentication', data, {
    //         headers: headers
    //     });
    // }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}
