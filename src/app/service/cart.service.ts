import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs";
import {CustomerCart} from "../model/CustomerCart";

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
                    let index = this.cart.orderedProduct.findIndex(
                        orderedProduct => orderedProduct.product.id === productId
                    );

                    this.cart.orderedProduct[index].quantity = currentQuantity;
                    this.isInCart = true;
                }
            });
        } else {
            this.addToCart(params).subscribe({
                next: (value: any) => {
                    this.cart['orderedProduct'].push(value.data);
                    this.isInCart = true;
                }
            });
        }

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
