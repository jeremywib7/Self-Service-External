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

    cartInformation = {
       cart: CustomerCart
    }

    constructor(private httpClient: HttpClient) {
    }

    updateCart(params: HttpParams) {
        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/cart/update`, null,
            {params: params}).pipe(map((data) => data || []))
    }

    viewCart(params: HttpParams) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/cart/view`, {params})
            .pipe(map((data) => data || []))
    }
}
