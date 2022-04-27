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

    public isInCart: boolean = false;

    constructor(private httpClient: HttpClient) {
    }

    public updateProductInCart(productId: string, currentQuantity: number, customerId: string) {
        let params = new HttpParams();
        params = params.append("customerId", customerId);
        params = params.append("productId", productId);
        params = params.append("productQuantity", currentQuantity);

        this.updateCart(params).subscribe({
            next: (value: any) => {
                this.cart['orderedProduct'] = value.data.orderedProduct;
                this.isInCart = true;
            }
        });

    }

    updateCart(params: HttpParams) {
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
