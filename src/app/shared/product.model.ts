export class Product {
  constructor(public id?: number,
              public name?: string,
              public price?: string,
              public available?: boolean,
              public best_seller?: boolean,
              public categories?: number[],
              public img?: string,
              public imageThumbnail?: any,
              public imageContentType?: string,
              public description?: string) {
  }
}


