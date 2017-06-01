import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import {PriceFilter} from "../shared/custom-filter.model";


@Injectable()
export class PriceFilterService {

  private resourceUrlForFilter = 'http://localhost:8080/api/custom-filters';

  constructor(private http: Http) {
  }


  getRemotePriceFilterData(): Observable<any> {
    return this.http.get(this.resourceUrlForFilter)
      .map(this.extractPriceFilter)
      .catch(this.handleError);
  }

  private extractPriceFilter(res: Response) {
    let integrationFilter = res.json();
    let datas: PriceFilter[] = [];

    integrationFilter.forEach(integration => {
      if(integration.name=='Price' && integration.active == true){
        let data = new PriceFilter();
        data.name=integration.displayValue;
        data.value=integration.value;
        data.checked = data.value == 'all';

        datas.push(data);
      }


    });

    return datas || {};
  }


  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}
