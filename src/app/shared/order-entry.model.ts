
import {Product} from "./product.model";
import {CustomerOrder} from "./customer-order.model";
export class OrderEntry {
    constructor(public id?: number,
                public quantity?: number,
                public productOrderId?: number,
                public value?: number,
                public product?: Product,
                public customerOrder?: CustomerOrder,
                public orderId?: number,) {
    }
}
