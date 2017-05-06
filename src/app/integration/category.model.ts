import { ClassificationClassAttribute } from './classification-class-attribute.model';
import { ProductIntegration } from './product.model';
export class CategoryIntegration {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public classificationAttribute?: ClassificationClassAttribute,
        public parent?: CategoryIntegration,
        public products?: ProductIntegration,
    ) {
    }
}
