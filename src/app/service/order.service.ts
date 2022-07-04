import {Injectable} from '@angular/core';
import {CartOrderedProduct} from "../model/customerCart/CartOrderedProduct";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs";
import {environment} from "../../environments/environment";
import {UserAuthService} from "./user-auth.service";
import {CustomerOrder} from "../model/customerOrder/CustomerOrder";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {WaitingList} from "../model/WaitingList";
import {DatePipe} from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    customerOrders: CustomerOrder[] = [];

    // from waiting list firestore firebase
    currentOrder: WaitingList;

    isInWaitingList: boolean = false;

    constructor(
        private httpClient: HttpClient,
        public userAuthService: UserAuthService,
        private datePipe: DatePipe,
        public fireServices: AngularFirestore) {
    }

    // stream
    getWaitingListForCustomer(customerId: string) {
        return this.fireServices.collection('Waiting_List').doc(customerId).snapshotChanges();
    }


    addOrder(params: HttpParams, orderedProduct: CartOrderedProduct[]) {
        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/order/add`, orderedProduct, {params: params})
            .pipe(map((data) => data || []))
    }

    deleteWaitingListFirebase(params: HttpParams) {
        return this.httpClient.delete(`${this.apiServerUrl}/${this.project}/order/delete/waiting-list`, {params: params})
            .pipe(map((data) => data || []))
    }

    cancelOrder(customerId: string) {
        let params = new HttpParams().append("customerId", customerId);

        return this.httpClient.put(`${this.apiServerUrl}/${this.project}/order/cancel`, null, {params: params})
            .pipe(map((data) => data || []))
    }

    viewCustomerOrders(customerId: string, page: number, size: number, dateFrom: Date, dateTill: Date) {
        let params = new HttpParams()
            .append("customerId", customerId);

        if (dateFrom != null) {
            params = params.append("dateFrom", this.datePipe.transform(dateFrom, 'dd-MM-yyyy'));
        }

        if (dateTill != null) {
            params = params.append("dateTill", this.datePipe.transform(dateTill, 'dd-MM-yyyy'));
        }

        if (page != null) {
            params = params.append("page", page);
        }

        if (size != null) {
            params = params.append("size", size);
        }

        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/order/view`, {params: params})
            .pipe(map((data) => data || []))
    }

    viewCurrentCustomerOrder(customerId: string) {
        let params = new HttpParams().append("customerId", customerId);

        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/order/view/active`, {params: params})
            .pipe(map((data) => data || []))
    }
}
