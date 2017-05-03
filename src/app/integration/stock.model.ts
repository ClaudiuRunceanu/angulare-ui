import { Warehouse } from './warehouse.model'
import { ProductIntegration } from './product.model';
export class Stock {
    constructor(
        public id?: number,
        public available?: number,
        public preOrder?: number,
        public reserved?: number,
        public expireDate?: any,
        public creationDate?: any,
        public warehouse?: Warehouse,
        public product?: ProductIntegration,
        public productId?: number,
    ) {
    }
}
