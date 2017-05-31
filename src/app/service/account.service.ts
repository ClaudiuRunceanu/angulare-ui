import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class AccountService {
  constructor(private http: Http) {
  }

  get(): Observable<any> {
    let headers = new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem('authenticationToken')
    });

    return this.http.get('http://localhost:8080/api/account', {
      headers: headers
    }).map((res: Response) => res.json());
  }

  save(account: any): Observable<Response> {
    return this.http.post('http://localhost:8080/api/account', account);
  }
}


