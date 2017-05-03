import { Price } from './price.model';
import { Stock } from './stock.model';
import { Media } from './media.model';
import { Catalog } from './catalog.model';
import { Category } from './category.model';

export class ProductIntegration {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public description?: string,
        public price?: Price,
        public stocks?: Stock[],
        public media?: Media[],
        public catalog?: Catalog,
        public categories?: Category[],

    )
    {
    }
}
