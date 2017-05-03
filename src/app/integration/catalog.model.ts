
const enum CatalogVersion {
    'ONLINE',
    'STAGE'

};
export class Catalog {
    constructor(
        public id?: number,
        public name?: string,
        public isDefault?: boolean,
        public version?: CatalogVersion,
    ) {
        this.isDefault = false;
    }
}
