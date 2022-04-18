import {Component, NgZone, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AppConfig} from "../../api/appconfig";
import {from, lastValueFrom, Subscription} from "rxjs";
import {ConfigService} from "../../service/app.config.service";
import {FormControl, FormGroup} from "@angular/forms";
import {UserAuthService} from "../../service/user-auth.service";
import {ConfirmationService, MenuItem, Message, MessageService} from "primeng/api";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {AngularFireAuth} from "@angular/fire/compat/auth";

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
        public auth: AngularFireAuth,
        private confirmationService: ConfirmationService,
        private messageService: MessageService) {

        this.auth.authState.subscribe({
            next: response => {

                // if not null, then user is already logged in
                if (response) {
                    this.userAuthService.userInformation.user['username'] = response['email'];
                    this.isLoggedIn = true;
                    console.log(this.auth);
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
                label: 'Settings',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Profile',
                        icon: 'pi pi-fw pi-user',
                    },
                    {
                        label: 'History',
                        icon: 'pi pi-fw pi-calendar-times',
                    }
                ]
            },
            {
                separator: true
            },
            {
                label: 'Logout',
                command: () => this.onLogoutClicked(),
                icon: 'pi pi-fw pi-power-off'
            }
        ]
    }

    // reset Forgot password
    onResetPassword() {

        if (this.resetPasswordForm.valid) {
            this.auth.sendPasswordResetEmail(this.resetPasswordForm.value.email).then(res => {
                this.resetPasswordMsg = [
                    {severity: 'success', summary: 'Success', detail: 'Password reset sent to this email'},
                ];
            }).catch(_error => {
                this.resetPasswordMsg = [
                    {severity: 'error', summary: 'Failed', detail: 'No user found for this email '},
                ];
            });
        } else {
            this.resetPasswordForm.markAllAsTouched();
        }

    }

    openLoginDialog() {
        this.showAuthDialog = true;
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

            from(this.auth.createUserWithEmailAndPassword(email, password)).subscribe({
                next: (value: any) => {
                    this.registerMsg = [];
                    this.showAuthDialog = false;
                },
                error: err => {
                    console.log("error");
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
                },
                complete: () => {
                    console.log("ok");
                    this.isRegisterButtonLoading = false;
                }
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

    onLogoutClicked() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to log out?',
            header: 'Logout',
            accept: () => {
                this.isCheckingLoginStatus = true;
                this.auth.signOut().then();
            }
        });
    }

}
