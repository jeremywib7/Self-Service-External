import {Injectable} from '@angular/core';
import {OrderedProduct} from "../model/OrderedProduct";
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

    //customerCarts: CustomerCart[]
    addOrder(params: HttpParams, orderedProduct: OrderedProduct[]) {
        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/order/add`, orderedProduct, {params: params})
            .pipe(map((data) => data || []))
    }
}
