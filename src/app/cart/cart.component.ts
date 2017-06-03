import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {CartService} from '../cart.service';
import {CustomerOrderService} from '../service/customer-order.service';
import {Subscription} from 'rxjs/Subscription';
import {OrderEntry} from "../shared/order-entry.model";
import {CustomerOrder, OrderStatus} from "../shared/customer-order.model";
import {Account} from "../shared/account";

const OFFSET_HEIGHT: number = 170
const PRODUCT_HEIGHT: number = 48

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  products: any[] = []
  numProducts: number = 0
  animatePlop: boolean = false
  animatePopout: boolean = false
  expanded: boolean = false
  expandedHeight: string
  cartTotal: number = 0
  isOrderPlace: boolean = false


  changeDetectorRef: ChangeDetectorRef


  constructor(private cartService: CartService, changeDetectorRef: ChangeDetectorRef, private customerOrderService: CustomerOrderService) {
    this.changeDetectorRef = changeDetectorRef
  }

  ngOnInit() {
    this.expandedHeight = '0'
    this.cartService.productAdded$.subscribe(data => {
      this.products = data.products
      this.cartTotal = data.cartTotal
      this.numProducts = data.products.reduce((acc, product) => {
        acc += product.quantity
        return acc
      }, 0)

      //Make a plop animation
      if (this.numProducts > 1) {
        this.animatePlop = true
        setTimeout(() => {
          this.animatePlop = false
        }, 160)
      } else if (this.numProducts == 1) {
        this.animatePopout = true
        setTimeout(() => {
          this.animatePopout = false
        }, 300)
      }
      this.expandedHeight = (this.products.length * PRODUCT_HEIGHT + OFFSET_HEIGHT) + 'px'
      if (!this.products.length) {
        this.expanded = false
      }
      this.changeDetectorRef.detectChanges()
    })
  }

  deleteProduct(product) {
    this.cartService.deleteProductFromCart(product)
  }

  placeOrder() {

    //create entries with products and quantity
    let entries: OrderEntry[] = [];

    this.products.forEach(data => {
      let entry = new OrderEntry();

      entry.productOrderId = data.product.id;
      entry.quantity = data.quantity;

      entries.push(entry)
    });


    //create order details
    let order = new CustomerOrder();
    let currentAccountFromStorage = JSON.parse(localStorage.getItem('currentAccount'));
    let currentAccount = new Account(currentAccountFromStorage);

    order.status = "OPEN"
    order.code = currentAccount.login + "-" + this.cartTotal + "-" + new Date().getTime();
    order.date = new Date();
    order.entries = entries;
    order.totalCost = this.cartTotal;
    order.user = currentAccount;

    //place order
    this.customerOrderService.create(order).subscribe((res: CustomerOrder) => {
      console.log("order place succsefull ", res)
      this.isOrderPlace=true;
    })

    //  this.onCartClick();

  }

  finalizeOrder(){
    this.expanded = !this.expanded
    this.cartService.flushCart();
    this.isOrderPlace=false;
  }

  onCartClick() {
    this.expanded = !this.expanded
  }

}
