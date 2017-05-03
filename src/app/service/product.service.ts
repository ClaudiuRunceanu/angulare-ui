import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {ProductIntegration} from "../integration/product.model";
import {Product} from "../shared/product.model";


@Injectable()
export class ProductService {
  integrationProducts: ProductIntegration[];
  private resourceUrlForProducts = 'http://localhost:8080/api/products'

  constructor(private http: Http) {
  }


  getRemoteProductData(url): Observable<any> {
    return this.http.get(url)
      .map(this.extractProduct)
      .catch(this.handleError);
  }


  private extractProduct(res: Response) {
    this.integrationProducts = res.json();
    let datas: Product[] =[];

    this.integrationProducts.forEach(integration => {
      let data = new Product();
      data.id = integration.id;
      data.name = integration.name;
      data.price = "" + integration.price.value;
      data.available = true;
      data.description = integration.description;
      datas.push(data);
    });

    return datas|| {};
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
