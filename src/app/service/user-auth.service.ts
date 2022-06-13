import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Customer} from "../api/customer";
import {CustomerProfile} from "../model/CustomerProfile";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {firstValueFrom, from} from "rxjs";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({
    providedIn: 'root'
})
export class UserAuthService {

    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    public buttonAuthText: string;

    public isLoggedIn: boolean = false;

    public isRegisterMode: boolean = false;

    public isDoneLoadConfig: boolean = false;

    public formProfile: FormGroup;

    public customer: CustomerProfile = new CustomerProfile();

    gender: any[] = [
        {name: 'Male', key: 'Male'},
        {name: 'Female', key: 'Female'}
    ];

    requestHeader = new HttpHeaders(
        {"No-Auth": "True"}
    );

    constructor(
        private httpClient: HttpClient,
        private fb: FormBuilder,
        private auth: AngularFireAuth
    ) {
        this.formProfile = this.fb.group({
            id: new FormControl(
                '', {
                    validators: []
                }),
            username: new FormControl('', {
                validators: [
                    RxwebValidators.required()
                ], updateOn: 'blur'
            }),
            firstName: new FormControl('', {
                validators: [RxwebValidators.required(), RxwebValidators.minLength({value: 3}),
                    RxwebValidators.alpha()]
            }),
            lastName: new FormControl('', {
                validators: [RxwebValidators.required(), RxwebValidators.minLength({value: 3}),
                    RxwebValidators.alpha()]
            }),
            email: new FormControl('', {
                validators: [RxwebValidators.required(), RxwebValidators.email()]
            }),
            gender: new FormControl('', {
                validators: [RxwebValidators.required()]
            }),
            password: new FormControl('', {
                validators: [RxwebValidators.required(), RxwebValidators.password({
                    validation: {
                        minLength: 8,
                        digit: true,
                        specialCharacter: true,
                        upperCase: true
                    }
                })]
            }),
            messagingToken: new FormControl('', {
                validators: [RxwebValidators.required()]
            }),
        });
    }

    public registerCustomer(customer: Customer) {
        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/customer/register`,
            customer, {headers: this.requestHeader});
    }

    public saveUserProfile() {
        let customerProfile: CustomerProfile;
        customerProfile = this.formProfile.value;

        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/customer/update/profile`,
            customerProfile);
    }

    public updateMessagingToken(params: HttpParams) {
        return this.httpClient.put(`${this.apiServerUrl}/${this.project}/customer/update/messaging-token`,
            null, {params: params});
    }

    public catchSendPasswordResetEmail(err: any): string {
        let errorMessage;
        switch (err.code) {
            case 'auth/invalid-email': {
                errorMessage = 'Email format is invalid';
                break;
            }
            case "auth/user-not-found": {
                errorMessage = 'User not found for this email'
                break;
            }
            default: {
                errorMessage = 'Reset password error. Try again later';
                break;
            }
        }

        return errorMessage;
    }

}
