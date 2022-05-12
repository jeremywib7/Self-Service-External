import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Customer} from "../api/customer";
import {CustomerProfile} from "../model/CustomerProfile";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";

@Injectable({
    providedIn: 'root'
})
export class UserAuthService {

    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    public isLoggedIn: boolean = false;

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

}
