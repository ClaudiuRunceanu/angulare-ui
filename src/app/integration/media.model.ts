import { ProductIntegration } from './product.model';
export class Media {
    constructor(
        public id?: number,
        public code?: string,
        public title?: string,
        public image?: any,
        public imageContentType?: string,
        public product?: ProductIntegration,
        public productId?: number,
    ) {
    }
}
