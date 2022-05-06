import {Injectable} from '@angular/core';
import {CartOrderedProduct} from "../model/customerCart/CartOrderedProduct";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs";
import {environment} from "../../environments/environment";
import {UserAuthService} from "./user-auth.service";
import {CustomerOrder} from "../model/customerOrder/CustomerOrder";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    customerOrders: CustomerOrder[] = [];

    constructor(
        private httpClient: HttpClient,
        public userAuthService: UserAuthService
    ) {
    }

    addOrder(params: HttpParams, orderedProduct: CartOrderedProduct[]) {
        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/order/add`, orderedProduct, {params: params})
            .pipe(map((data) => data || []))
    }

    viewCustomerOrders(customerId: string) {
        let params = new HttpParams().append("customerId", customerId);

        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/order/view`, {params: params})
            .pipe(map((data) => data || []))
    }
}
