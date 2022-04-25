import {Component, NgZone, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AppConfig} from "../../api/appconfig";
import {from, lastValueFrom, map, Subscription, switchMap} from "rxjs";
import {ConfigService} from "../../service/app.config.service";
import {FormControl, FormGroup} from "@angular/forms";
import {UserAuthService} from "../../service/user-auth.service";
import {ConfirmationService, MenuItem, Message, MessageService} from "primeng/api";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {CartService} from "../../service/cart.service";
import {HttpParams} from "@angular/common/http";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    config: AppConfig;

    userMenu: MenuItem[];

    loginMsg: Message[];

    registerMsg: Message[];

    resetPasswordMsg: Message[];


    subscription: Subscription;


    isRegisterMode: boolean = false;

    isLoginButtonLoading: boolean = false;

    isRegisterButtonLoading: boolean = false;

    isResetPasswordButtonLoading: boolean = false;

    isLoggedIn: boolean = false;

    isCheckingLoginStatus: boolean = true;

    showAuthDialog: boolean = false;

    showResetPasswordDialog: boolean = false;

    loginForm: FormGroup = new FormGroup({
        email: new FormControl('', {
            validators: [
                RxwebValidators.required(),
                RxwebValidators.email()
            ], updateOn: 'blur'
        }),
        password: new FormControl('', {
            validators: [
                RxwebValidators.required(),
                RxwebValidators.minLength({value: 6})
            ], updateOn: 'blur'
        }),
    });

    registerForm: FormGroup = new FormGroup({
        id: new FormControl(''),
        username: new FormControl('', {
            validators: [
                RxwebValidators.required(),
                RxwebValidators.minLength({value: 3}),
                RxwebValidators.maxLength({value: 20})
            ], updateOn: 'blur'
        }),
        firstName: new FormControl('', {
            validators: [
                RxwebValidators.required(),
            ], updateOn: 'blur'
        }),
        lastName: new FormControl('', {
            validators: [
                RxwebValidators.required(),
            ], updateOn: 'blur'
        }),
        gender: new FormControl('', {
            validators: [
                RxwebValidators.required(),
            ], updateOn: 'blur'
        }),
        email: new FormControl('', {
            validators: [
                RxwebValidators.required(),
                RxwebValidators.email()
            ], updateOn: 'blur'
        }),
        password: new FormControl('', {
            validators: [
                RxwebValidators.required(),
                RxwebValidators.minLength({value: 6})
            ], updateOn: 'blur'
        }),
    });

    resetPasswordForm: FormGroup = new FormGroup({
        email: new FormControl('', {
            validators: [
                RxwebValidators.required(),
                RxwebValidators.email()
            ], updateOn: 'blur'
        }),
    });

    constructor(
        public router: Router,
        public configService: ConfigService,
        public userAuthService: UserAuthService,
        private cartService: CartService,
        public auth: AngularFireAuth,
        private confirmationService: ConfirmationService) {

        this.auth.authState.subscribe({
            next: response => {

                // if not null, then user is already logged in
                if (response) {
                    this.userAuthService.customerInformation.customer['id'] = response.uid;
                    this.userAuthService.customerInformation.customer['email'] = response['email'];

                    // get cart
                    let params = new HttpParams().append("customerId",response.uid);
                    this.cartService.viewCart(params).subscribe({
                        next: value => {
                            console.log(value);
                        }
                    });

                    // this.userAuthService.
                    this.isLoggedIn = true;
                } else {
                    // TODO clear global user profile state
                    this.isLoggedIn = false;
                }

                // set checking login status to false
                this.isCheckingLoginStatus = false;
            }
        });

    }


    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
        // init menu settings and logout
        this.initMenuUser();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    initMenuUser() {
        this.userMenu = [
            {
                label: 'Profile',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'User Profile',
                        routerLink: '/profile',
                        icon: 'pi pi-fw pi-user',
                    },
                    {
                        label: 'History',
                        routerLink: '/history',
                        icon: 'pi pi-fw pi-calendar-times',
                    }
                ]
            },
            // {
            //     separator: true
            // },
            // {
            //     label: 'Logout',
            //     command: () => this.onLogoutClicked(),
            //     icon: 'pi pi-fw pi-power-off'
            // }
        ]
    }

    // reset Forgot password
    onResetPassword() {

        if (this.resetPasswordForm.valid) {
            this.isResetPasswordButtonLoading = true;
            from(this.auth.sendPasswordResetEmail(this.resetPasswordForm.value.email)).subscribe({
                next: value => {
                    this.resetPasswordMsg = [
                        {severity: 'success', summary: 'Success', detail: 'Password reset sent to this email'},
                    ];
                },
                error: err => {
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

                    this.resetPasswordMsg = [
                        {severity: 'error', summary: 'Failed', detail: errorMessage},
                    ];
                }
            }).add(() => {
                //Called when operation is complete (both success and error)
                this.isResetPasswordButtonLoading = false;
            });
        } else {
            this.resetPasswordForm.markAllAsTouched();
        }

    }

    openLoginOrLogoutDialog() {
        // if not logged in
        if (!this.isLoggedIn) {
            return this.showAuthDialog = true;
        }
        // if already logged in
        return this.confirmationService.confirm({
            message: 'Are you sure you want to log out?',
            header: 'Logout',
            accept: () => {
                this.isCheckingLoginStatus = true;
                this.auth.signOut().then();
            }
        });
    }

    onLogin() {

        if (this.loginForm.valid) {
            this.isLoginButtonLoading = true;

            if (this.isRegisterMode) {

            } else {
                const {email, password} = this.loginForm.value;

                this.auth.signInWithEmailAndPassword(email, password).then(user => {
                    this.loginMsg = [];
                    this.showAuthDialog = false;
                }).catch(
                    err => {
                        let errorMessage = "";
                        switch (err.code) {
                            case 'auth/user-disabled': {
                                errorMessage = 'Sorry your user is disabled.';
                                break;
                            }
                            case 'auth/user-not-found': {
                                errorMessage = 'Sorry user not found.';
                                break;
                            }

                            case 'auth/wrong-password': {
                                errorMessage = 'Sorry, incorrect password entered. Please try again.';
                                break;
                            }

                            default: {
                                errorMessage = 'Login error try again later.';
                                break;
                            }
                        }

                        return this.loginMsg = [{
                            severity: 'error', detail: errorMessage
                        }]
                    }
                ).finally(() => this.isLoginButtonLoading = false);
            }

        } else {
            this.loginForm.markAllAsTouched();
        }

    }

    onRegister() {

        if (this.registerForm.valid) {
            const {email, password} = this.registerForm.value;
            this.isRegisterButtonLoading = true;

            // update in firebase
            from(this.auth.createUserWithEmailAndPassword(email, password)).subscribe({
                next: value => {

                    // get uuid from firebase and set in backend
                    this.registerForm.get("id").setValue(value.user.uid);

                    // register in backend
                    this.userAuthService.registerCustomer(this.registerForm.value).subscribe({
                        next: () => {
                            this.registerMsg = [];
                            this.showAuthDialog = false;
                        },
                        error: err => {
                            // cancel created user by delete in firebase
                            // because username already exists in backend
                            this.auth.currentUser.then(async res => {
                                await res.delete();
                                return this.registerMsg = [{
                                    severity: 'error', detail: err.error.message
                                }]
                            });

                        },
                        complete: () => {
                            this.isRegisterButtonLoading = false;
                        }
                    });

                },
                error: err => {
                    let errorMessage = "";
                    switch (err.code) {
                        case 'auth/email-already-in-use': {
                            errorMessage = 'Email already in use.';
                            break;
                        }

                        default: {
                            errorMessage = 'Register error try again later.';
                            break;
                        }
                    }

                    return this.registerMsg = [{
                        severity: 'error', detail: errorMessage
                    }]
                }
            }).add(() => {
                this.isRegisterButtonLoading = false;
            });

        } else {
            this.registerForm.markAllAsTouched();
        }

    }


    onHideDialog() {
        if (this.isRegisterMode) {

        } else {
            this.loginForm.reset();
            this.loginMsg = [];
        }
    }

    onChangeAuthMode() {
        this.isRegisterMode = !this.isRegisterMode;
        this.resetForm();

        // for testing
        this.registerForm.patchValue({
            username: 'TheWorldWar3',
            firstName: 'Jeremy',
            lastName: 'Yonathan',
            gender: 'Male',
            email: 'jeremywib7@gmail.com',
            password: '123456'

        })
    }

    resetForm() {
        this.loginForm.reset();
        this.loginMsg = [];
        this.registerForm.reset();
        this.registerMsg = [];
    }

    onHideResetPasswordDialog() {
        this.resetPasswordForm.reset();
        this.resetPasswordMsg = [];
    }

}
