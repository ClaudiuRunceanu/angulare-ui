import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {CustomerOrder} from "../shared/customer-order.model";


@Injectable()
export class CustomerOrderService {

  private resourceUrl = 'http://localhost:8080/api/customer-orders';

  constructor(private http: Http) {
  }

  create(customerOrder: CustomerOrder): Observable<CustomerOrder> {

    let headers = new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem('authenticationToken')
    });

    let copy: CustomerOrder = Object.assign({}, customerOrder);
    // copy.date = this.dateUtils.toDate(customerOrder.date);
    return this.http.post(this.resourceUrl, copy, {headers: headers}).map((res: Response) => {
      return res.json();
    });
  }
}
