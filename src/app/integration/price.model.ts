import { Currency } from './currency.model';
export class Price {
    constructor(
        public id?: number,
        public value?: number,
        public currency?: Currency,
    ) {
    }
}
