import {Injectable} from '@angular/core';
import {CartOrderedProduct} from "../model/customerCart/CartOrderedProduct";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs";
import {environment} from "../../environments/environment";
import {UserAuthService} from "./user-auth.service";
import {CustomerOrder} from "../model/customerOrder/CustomerOrder";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    customerOrders: CustomerOrder[] = [];

    // from waiting list firestore firebase
    currentOrder: CustomerOrder;

    isInWaitingList: boolean = false;

    constructor(
        private httpClient: HttpClient,
        public userAuthService: UserAuthService,
        public fireServices: AngularFirestore) {
    }

    getWaitingListForCustomer(customerId: string) {
        return this.fireServices.collection('Waiting_List').doc(customerId).snapshotChanges();
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
