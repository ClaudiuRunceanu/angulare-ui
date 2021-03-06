import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {ProductIntegration} from "../integration/product.model";
import {Product} from "../shared/product.model";
import {Price} from "../shared/price.model";


@Injectable()
export class ProductService {
  integrationProducts: ProductIntegration[];
  private resourceUrlForProducts = 'http://localhost:8080/api/products'

  constructor(private http: Http) {
  }


  getRemoteProductData(): Observable<any> {
    return this.http.get(this.resourceUrlForProducts)
      .map(this.extractProduct)
      .catch(this.handleError);
  }


  private extractProduct(res: Response) {
    this.integrationProducts = res.json();
    let datas: Product[] = [];

    this.integrationProducts.forEach(integration => {
      if (true == integration.catalog.isDefault) {
        let data = new Product();
        data.id = integration.id;
        data.name = integration.name;

        let price = new Price();
        price.value = integration.price.value;
        price.id = integration.price.id;

        data.price = price;

        data.description = integration.description;
        if (integration.media) {
          let firstImage = integration.media.pop();
          if (firstImage) {
            data.imageThumbnail = firstImage.image;
            data.imageContentType = firstImage.imageContentType;
          }
        }

        if (integration.stocks) {
          data.available = integration.stocks.length > 0;
        }

        let categoryNumbers: number[] = [];
        integration.categories.forEach(category => {
          categoryNumbers.push(category.id);
        });
        data.categories = categoryNumbers;

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
