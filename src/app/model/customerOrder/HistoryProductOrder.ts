import {Product} from "../Product";

export class HistoryProductOrder {

    id: string;
    product: Product;
    name: string;
    quantity: number;
    discount: boolean;
    unitPrice: number;
    discountedPrice: number;

}
