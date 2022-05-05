import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs";
import {CustomerCart} from "../model/CustomerCart";
import {CartOrderedProduct} from "../model/CartOrderedProduct";

@Injectable({
    providedIn: 'root'
})
export class CartService {

    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    public cart: CustomerCart = new CustomerCart();

    public isDoneLoadProductInfo: boolean = false;

    public isInCart: boolean = false;

    public lastViewedProductId: string = "";

    public totalPrice: number = 0;

    constructor(private httpClient: HttpClient) {
    }

    public onSubmitProductToCart(productId: string, currentQuantity: number, customerId: string) {
        let params = new HttpParams();
        params = params.append("customerId", customerId);
        params = params.append("productId", productId);
        params = params.append("productQuantity", currentQuantity);

        if (this.isInCart) {
            this.updateInCart(params).subscribe({
                next: () => {

                    // search product index in cart
                    let index = this.cart.cartOrderedProduct.findIndex(
                        cartOrderedProduct => cartOrderedProduct.product.id === productId
                    );

                    // update product quantity index in cart
                    this.cart.cartOrderedProduct[index].quantity = currentQuantity;

                    // re-calculate total price in cart
                    this.calculateTotalPrice();

                    this.isInCart = true;
                }
            });
        } else {
            this.addToCart(params).subscribe({
                next: (value: any) => {

                    // add or push product in cart
                    this.cart['cartOrderedProduct'].push(value.data);

                    // re-calculate total price in cart
                    this.calculateTotalPrice();

                    this.isInCart = true;
                }
            });
        }

    }

    // calculate total price of cart
    public calculateTotalPrice() {
        this.totalPrice = 0;

        this.cart.cartOrderedProduct?.forEach((value1, index) => {
            this.totalPrice += value1.product.discountedPrice * value1.quantity;
        })

        return this.totalPrice;
    }

    addToCart(params: HttpParams) {
        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/cart/add`, null,
            {params: params}).pipe(map((data) => data || []))
    }

    updateInCart(params: HttpParams) {
        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/cart/update`, null,
            {params: params}).pipe(map((data) => data || []))
    }

    viewCart(params: HttpParams) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/cart/view`, {params})
            .pipe(map((data) => data || []))
    }

    removeProductFromCart(params: HttpParams) {
        return this.httpClient.delete(`${this.apiServerUrl}/${this.project}/cart/delete`, {params})
            .pipe(map((data) => data || []))
    }
}
