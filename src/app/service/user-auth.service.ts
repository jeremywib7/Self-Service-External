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

    customerInformation = {
        customer: CustomerProfile
    }

    requestHeader = new HttpHeaders(
        {"No-Auth": "True"}
    );

    constructor(private httpClient: HttpClient) {
    }

    public registerCustomer(customer: Customer) {
        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/customer/register`,
            customer, {headers: this.requestHeader});
    }

    public setRoles(roles: []) {
        localStorage.setItem('_security_role', JSON.stringify(roles['roleName'].toString())
        );
    }

    public getRoles() {
        return JSON.parse(
            localStorage.getItem('_security_role'));
    }

    public setToken(accessToken: string) {
        localStorage.setItem('_security_accessToken',
            JSON.stringify(accessToken)
        );
    }

    public getToken() {
        return JSON.parse(localStorage.getItem('_security_accessToken'));
    }

    public clear() {
        localStorage.clear();
    }

    public isLoggedIn() {
        return this.getRoles() && this.getToken();
    }

}
