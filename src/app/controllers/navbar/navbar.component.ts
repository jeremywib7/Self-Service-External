import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AppConfig} from "../../api/appconfig";
import {from, lastValueFrom, Subscription} from "rxjs";
import {ConfigService} from "../../service/app.config.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {UserAuthService} from "../../service/user-auth.service";
import {ConfirmationService, MegaMenuItem, MenuItem, Message, MessageService} from "primeng/api";
import {RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    config: AppConfig;

    userMenu: MenuItem[];

    subscription: Subscription;

    isRegisterMode: boolean = false;

    isAuthButtonLoading: boolean = false;

    showLoginDialog: boolean = false;

    authForm: FormGroup = new FormGroup({
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

    onLoginMsg: Message[];

    constructor(
        public router: Router,
        public configService: ConfigService,
        public userAuthService: UserAuthService,
        private auth: AngularFireAuth,
        private confirmationService: ConfirmationService,
        private messageService: MessageService) {
    }


    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
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

    isLoggedIn(): boolean {
        return !!this.userAuthService.isLoggedIn();
    }

    openLoginDialog() {
        this.showLoginDialog = true;
    }

    onAuth() {

        if (this.authForm.valid) {
            const {email, password} = this.authForm.value;
            this.isAuthButtonLoading = true;

            if (this.isRegisterMode) {

                this.auth.createUserWithEmailAndPassword(email, password).then(user => {
                    console.log(user);
                }).catch(
                    err => this.onLoginMsg = [
                        {severity: 'error', summary: 'Failed', detail: 'Wrong Credentials'},
                    ]
                ).finally(() => this.isAuthButtonLoading = false);

            } else {

                this.auth.signInWithEmailAndPassword(email, password).then(user => {
                    this.onLoginMsg = [];
                    console.log(user);
                }).catch(
                    err => this.onLoginMsg = [
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
            this.authForm.markAllAsTouched();
        }

    }


    onHideDialog() {
        this.authForm.reset();
        this.onLoginMsg = [];
    }

    onLogoutClicked() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to log out?',
            header: 'Logout',
            accept: () => {
                this.auth.signOut().then(res => this.userAuthService.clear());
            }
        });
    }

}
