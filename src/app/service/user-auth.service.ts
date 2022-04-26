import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Customer} from "../api/customer";
import {CustomerProfile} from "../model/CustomerProfile";

@Injectable({
    providedIn: 'root'
})
export class UserAuthService {

    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    isLoggedIn: boolean = false;

    public customer: CustomerProfile = new CustomerProfile();

    requestHeader = new HttpHeaders(
        {"No-Auth": "True"}
    );

    constructor(private httpClient: HttpClient) {
    }

    public registerCustomer(customer: Customer) {
        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/customer/register`,
            customer, {headers: this.requestHeader});
    }

}
