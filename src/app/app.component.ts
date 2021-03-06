import {Component, OnInit, ViewChild} from "@angular/core";
import {Product} from "./shared/product.model";
import {DataService} from "./data.service";
import {CartService} from "./cart.service";
import {ProductService} from "./service/product.service";
import {CategoryService} from "./service/category.service";
import {PriceFilterService} from "./service/priceFilter.service";

import {FiltersComponent} from "./filters/filters.component";
import {SearchBarComponent} from "./search-bar/search-bar.component";
import {Category} from "./shared/category.model";
import {PriceFilter} from "./shared/custom-filter.model";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  products: Product[]


  mainFilter: any

  currentSorting: string

  @ViewChild('filtersComponent')
  filtersComponent: FiltersComponent;

  @ViewChild('searchComponent')
  searchComponent: SearchBarComponent;

  // rootCategory: any[] = [
  //   {name: 'Brands', id: 1},
  //   {name: 'Gender', id: 2}
  // ]

  sortFilters: any[] = [
    {name: 'Name (A to Z)', value: 'name'},
    {name: 'Price (low to high)', value: 'priceAsc'},
    {name: 'Price (high to low)', value: 'priceDes'}
  ]

  customFilters: any[] = [
    {name: 'All', value: 'all', checked: true},
    {name: 'Available', value: 'available', checked: false},
    {name: 'Not Available', value: 'unavailable', checked: false},
    {name: 'Bestseller', value: 'bestseller', checked: false}
  ]

  // priceFilters: any[] = [
  //   {name: 'All', value: 'all', checked: true},
  //   {name: 'Price > 30.000', value: 'more_30000', checked: false},
  //   {name: 'Price < 10.000', value: 'less_10000', checked: false}
  // ]

  priceFilters: PriceFilter[] = []

  originalData: any = []
  originalProducts: Product[] = []
  categories: Category[] = []
  rootCategory: Category[] = []

  constructor(private dataService: DataService, private cartService: CartService, private  productService: ProductService, private categoryService: CategoryService, private priceFilterService: PriceFilterService) {
  }

  ngOnInit() {
    this.mainFilter = {
      search: '',
      categories: this.categories,
      customFilter: this.customFilters[0],
      priceFilter: this.priceFilters[0]
    }

    this.productService.getRemoteProductData().subscribe(
      (res: Product[]) => {

        this.products = res;

        //Make a copy of original data to keep an original array of products.
        this.originalProducts = res;
        console.log("Raspuns de la product integration service");
        console.log(res);
      },
    );

    this.categoryService.getRemoteCategoryData().subscribe(
      (res: Category[]) => {
        this.categories = res;

        this.categories.forEach(category => {
          if (!category.parent_id) {
            this.rootCategory.push(category);
          }
        });

        this.mainFilter.categories = this.categories;

        // this.mainFilter = {
        //   search: '',
        //   categories: this.categories,
        //   customFilter: this.customFilters[0],
        //   priceFilter: this.priceFilters[0]
        // }

        console.log("Raspuns de la category integration service");
        console.log(this.categories);
        console.log(this.rootCategory);
      }
    );

    this.priceFilterService.getRemotePriceFilterData().subscribe(
      (res: PriceFilter[]) => {

        this.priceFilters = res;
        this.mainFilter.priceFilter = this.priceFilters[0];

        console.log("price filter response: ", this.priceFilters);
      }
    )


    // this.dataService.getData().then(data => {
    //   this.originalData = data
    //    this.mainFilter = {
    //     search: '',
    //      categories: this.originalData.categories.slice(0),
    //     customFilter: this.customFilters[0],
    //     priceFilter: this.priceFilters[0]
    //   }
    //
    //   //Make a deep copy of the original data to keep it immutable
    //   this.products = this.originalData.products.slice(0)
    //    this.sortProducts('name')
    // })


  }

  onURLChange(url) {
    this.dataService.getRemoteData(url).subscribe(data => {
      this.originalData = data
      this.mainFilter = {
        search: '',
        categories: this.originalData.categories.slice(0),
        customFilter: this.customFilters[0],
        priceFilter: this.priceFilters[0]
      }

      //Make a deep copy of the original data to keep it immutable
      // this.products = this.originalData.products.slice(0)
      this.products = this.originalProducts
      this.sortProducts('name')
      this.filtersComponent.reset(this.customFilters, this.priceFilters)
      this.searchComponent.reset()
      this.cartService.flushCart()
    })
  }


  onSearchChange(search) {
    this.mainFilter.search = search.search
    this.updateProducts({
      type: 'search',
      change: search.change
    })
  }

  onFilterChange(data) {
    if (data.type == 'category') {
      if (data.isChecked) {
        this.mainFilter.categories.push(data.filter)
      } else {
        this.mainFilter.categories = this.mainFilter.categories.filter(category => {
          return category.categori_id != data.filter.categori_id
        })
      }
    } else if (data.type == 'custom') {
      this.mainFilter.customFilter = data.filter
    } else if (data.type == 'price') {
      this.mainFilter.priceFilter = data.filter
    }
    this.updateProducts({
      type: data.type,
      change: data.change
    })
  }

  updateProducts(filter) {
    // let productsSource = this.originalData.products
    let productsSource = this.originalProducts
    let prevProducts = this.products
    let filterAllData = true
    if ((filter.type == 'search' && filter.change == 1) || (filter.type == 'category' && filter.change == -1)) {
      productsSource = this.products
      filterAllData = false
    }
    //console.log('filtering ' + productsSource.length + ' products')

    this.products = productsSource.filter(product => {
      //Filter by search
      if (filterAllData || filter.type == 'search') {
        if (!product.name.match(new RegExp(this.mainFilter.search, 'i'))) {
          return false;
        }
      }

      //Filter by categories
      if (filterAllData || filter.type == 'category') {
        let passCategoryFilter = false
        product.categories.forEach(product_category => {
          if (!passCategoryFilter) {
            passCategoryFilter = this.mainFilter.categories.reduce((found, category) => {
              return found || product_category == category.categori_id
            }, false)
          }
        })
        if (!passCategoryFilter) {
          return false
        }
      }

      //Filter by custom filters
      if (filterAllData || filter.type == 'custom') {
        let passCustomFilter = false
        let customFilter = this.mainFilter.customFilter.value
        if (customFilter == 'all') {
          passCustomFilter = true;
        } else if (customFilter == 'available' && product.available) {
          passCustomFilter = true;
        } else if (customFilter == 'unavailable' && !product.available) {
          passCustomFilter = true;
        } else if (customFilter == 'bestseller' && product.best_seller) {
          passCustomFilter = true;
        }
        if (!passCustomFilter) {
          return false
        }
      }

      //Filter by price filters
      if (filterAllData || filter.type == 'price') {
        let passPriceFilter = false
        let customFilter = this.mainFilter.priceFilter.value
        // let productPrice = parseFloat(product.price.replace(/\./g, '').replace(',', '.'))
        let productPrice = product.price.value;

        // if (customFilter == 'all') {
        //   passPriceFilter = true;
        // } else if (customFilter == 'more_30000' && productPrice > 30000) {
        //   passPriceFilter = true;
        // } else if (customFilter == 'less_10000' && productPrice < 10000) {
        //   passPriceFilter = true;
        // }

        if (customFilter == 'all') {
          passPriceFilter = true;
        }
        else {
          let priceName = this.mainFilter.priceFilter.name;
          if (priceName.indexOf(">") >= 0) {
            if (productPrice > customFilter) {
              passPriceFilter = true;
            }
          }
          if (priceName.indexOf("<") >= 0) {
            if (productPrice < customFilter) {
              passPriceFilter = true;
            }
          }
          if (priceName.indexOf("=") >= 0) {
            if (productPrice == customFilter) {
              passPriceFilter = true;
            }
          }
          if (priceName.indexOf("in") >= 0) {
            let edges=customFilter.split("-");
            let lowerEdge = edges[0];
            let upperEdge = edges[1];

            if (productPrice > lowerEdge && productPrice < upperEdge) {
              passPriceFilter = true;
            }
          }
        }

        if (!passPriceFilter) {
          return false
        }
      }

      return true
    })

    //If the number of products increased after the filter has been applied then sort again
    //If the number of products remained equal, there's a high chance that the items have been reordered.
    if (prevProducts.length <= this.products.length && this.products.length > 1) {
      this.sortProducts(this.currentSorting)
    }

    //These two types of filters usually add new data to the products showcase so a sort is necessary
    if (filter.type == 'custom' || filter.type == 'price') {
      this.sortProducts(this.currentSorting)
    }
  }

  sortProducts(criteria) {
    //console.log('sorting ' + this.products.length + ' products')
    this.products.sort((a, b) => {
      // let priceComparison = parseFloat(a.price.replace(/\./g, '').replace(',', '.')) - parseFloat(b.price.replace(/\./g, '').replace(',', '.'))
      let priceComparison = a.price.value - b.price.value;

      if (criteria == 'priceDes') {
        return -priceComparison
      } else if (criteria == 'priceAsc') {
        return priceComparison
      } else if (criteria == 'name') {
        let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
        if (nameA < nameB)
          return -1;
        if (nameA > nameB)
          return 1;
        return 0;
      } else {
        //Keep the same order in case of any unexpected sort criteria
        return -1
      }
    })
    this.currentSorting = criteria
  }
}
