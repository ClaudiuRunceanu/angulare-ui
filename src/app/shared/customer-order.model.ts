
import {OrderEntry} from "./order-entry.model";
import {Account} from "./account";
export const enum OrderStatus {
    'OPEN',
    'SUCCESS',
    'ACCEPTED',
    'CANCELED',
    'REJECTED'

};

export class CustomerOrder {
    constructor(
        public id?: number,
        public code?: string,
        public date?: any,
        public totalCost?: number,
        public status?: string,
        public taxCost?: number,
        public paymentCost?: number,
        public deliveryCost?: number,
        public discountValue?: number,
        public discountPercentage?: number,
        public entries?: OrderEntry[],
        public user?: Account,
    ) {
    }
}
