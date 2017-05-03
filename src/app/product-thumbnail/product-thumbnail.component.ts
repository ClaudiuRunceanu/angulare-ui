import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../shared/product.model';
import { CartService } from '../cart.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'product-thumbnail',
  templateUrl: './product-thumbnail.component.html',
  styleUrls: ['./product-thumbnail.component.scss']
})
export class ProductThumbnailComponent implements OnInit {
  @Input() product: Product

  detailViewActive: boolean

  constructor(private cartService: CartService, public _DomSanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.detailViewActive = false
  }

  onProductClick(){
    this.detailViewActive = !this.detailViewActive
  }

  onAddToCart(){
    this.cartService.addProductToCart(this.product)
  }

}
