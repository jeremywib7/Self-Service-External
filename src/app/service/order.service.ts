import {Injectable} from '@angular/core';
import {CartOrderedProduct} from "../model/CartOrderedProduct";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs";
import {environment} from "../../environments/environment";
import {CustomerCart} from "../model/CustomerCart";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    constructor(private httpClient: HttpClient) {
    }

    addOrder(params: HttpParams, orderedProduct: CartOrderedProduct[]) {
        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/order/add`, orderedProduct, {params: params})
            .pipe(map((data) => data || []))
    }
}
