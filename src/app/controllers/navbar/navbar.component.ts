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

    isAuthButtonLoading: boolean = false;

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
            from(this.auth.sendPasswordResetEmail(this.resetPasswordForm.value.email)).subscribe({
                next: (value: any) => {
                    this.resetPasswordMsg = [
                        {severity: 'success', summary: 'Success', detail: 'Password reset sent to this email'},
                    ];
                },
                error: (err: any) => {
                    console.log(err.code);

                    this.resetPasswordMsg = [
                        {severity: 'error', summary: 'Failed', detail: 'No user found for this email '},
                    ];
                }
            });
        } else {
            this.resetPasswordForm.markAllAsTouched();
        }

    }

    openLoginDialog() {
        this.showAuthDialog = true;
    }

    onAuth() {

        if (this.loginForm.valid) {
            const {email, password} = this.loginForm.value;
            this.isAuthButtonLoading = true;

            if (this.isRegisterMode) {

                this.auth.createUserWithEmailAndPassword(email, password).then(user => {
                    console.log(user);
                }).catch(
                    err => this.loginMsg = [
                        {severity: 'error', summary: 'Failed', detail: 'Wrong Credentials'},
                    ]
                ).finally(() => this.isAuthButtonLoading = false);

            } else {

                this.auth.signInWithEmailAndPassword(email, password).then(user => {
                    this.loginMsg = [];
                    this.showAuthDialog = false;
                }).catch(
                    err => this.loginMsg = [
                        {severity: 'error', summary: 'Failed', detail: 'Wrong Credentials'},
                    ]
                ).finally(() => this.isAuthButtonLoading = false);

                // await lastValueFrom(this.userService.login(this.loginForm.value)).then((response: any) => {
                //     // set in cookies
                //     this.userAuthService.setRoles(response.user.role);
                //     this.userAuthService.setToken(response.jwtToken);
                //
                //     this.userService.userInformation.user = response.user;
                //
                //     this.showLoginDialog = false;
                // }).catch(
                //     err => {
                //         this.onLoginMsg = [
                //             {severity: 'error', summary: 'Failed', detail: 'Wrong Credentials'},
                //         ];
                //     }
                // );
            }

        } else {
            this.loginForm.markAllAsTouched();
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
