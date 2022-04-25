import {Product} from "./Product";
import {CustomerCart} from "./CustomerCart";

export class OrderedProduct {
    id: string;
    product: Product;
    quantity: number;
    customerCart: CustomerCart;
}
