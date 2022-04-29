import {Product} from "./Product";
import {CustomerCart} from "./CustomerCart";

export class CartOrderedProduct {
    id: string;
    product: Product;
    quantity: number;
    customerCart: CustomerCart;
}
