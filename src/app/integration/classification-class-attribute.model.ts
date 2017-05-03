
const enum ClassificationAttributeType {
    'STRING',
    'DOUBLE',
    'BOOLEAN',
    'RANGE',
    'DATE'

};
import { Category } from './category.model';
export class ClassificationClassAttribute {
    constructor(
        public id?: number,
        public description?: string,
        public attributeName?: string,
        public value?: string,
        public type?: ClassificationAttributeType,
        public category?: Category,
    ) {
    }
}
