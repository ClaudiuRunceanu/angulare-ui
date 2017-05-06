import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import {CategoryIntegration} from "../integration/category.model";
import {Category} from "../shared/category.model";


@Injectable()
export class CategoryService {
  integrationCategories: CategoryIntegration[];
  private resourceUrlForCategories = 'http://localhost:8080/api/categories';

  constructor(private http: Http) {
  }


  getRemoteCategoryData(): Observable<any> {
    return this.http.get(this.resourceUrlForCategories)
      .map(this.extractCategory)
      .catch(this.handleError);
  }

  private extractCategory(res: Response) {
    this.integrationCategories = res.json();
    let datas: Category[] = [];

    this.integrationCategories.forEach(integration => {
      let data = new Category();
      data.categori_id = integration.id;
      data.name = integration.name;

      datas.push(data);
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
