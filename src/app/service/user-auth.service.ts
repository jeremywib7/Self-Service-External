import {Injectable} from '@angular/core';
import {from} from "rxjs";
import {Auth, signInWithEmailAndPassword} from "@angular/fire/auth";
import {User} from "../model/User";
import {environment} from "../../environments/environment.prod";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Customer} from "../api/customer";


@Injectable({
    providedIn: 'root'
})
export class UserAuthService {

    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    userInformation = {
        user: User
    }

    user = {
        username: '',
        userFirstName: '',
        userLastName: '',
        userPassword: '',
        email: '',
        role: {
            roleName: '',
            roleDescription: '',
        },
        gender: '',
        dateJoined: '',
        phoneNumber: '',
        address: '',
        imageUrl: '',
        userCode: '',
        bankAccount: '',
        accessToken: '',
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
