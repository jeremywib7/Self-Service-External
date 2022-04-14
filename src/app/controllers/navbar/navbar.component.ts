import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AppConfig} from "../../api/appconfig";
import {lastValueFrom, Subscription} from "rxjs";
import {ConfigService} from "../../service/app.config.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserAuthService} from "../../service/user-auth.service";
import {ConfirmationService, MegaMenuItem, MenuItem, Message, MessageService} from "primeng/api";
import {RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {UserService} from "../../service/user.service";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    config: AppConfig;

    userMenu: MenuItem[];

    categoryMenu: MegaMenuItem;

    subscription: Subscription;

    isRegisterMode: boolean = false;

    showLoginDialog: boolean = false;

    loginForm: FormGroup;

    onLoginMsg: Message[];

    constructor(
        public router: Router,
        public configService: ConfigService,
        public userAuthService: UserAuthService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private rxFormBuilder: FormBuilder,
        public userService: UserService) {
    }


    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
        this.initMenuUser();
        this.initLoginForm();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    initLoginForm() {
        this.loginForm = this.rxFormBuilder.group({
            userName: ['',
                [
                    RxwebValidators.required(),
                ]
            ],
            userPassword: ['',
                [
                    RxwebValidators.required(),
                ]
            ],
        });
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

    async onLogin() {

        if (this.loginForm.valid) {

            await lastValueFrom(this.userService.login(this.loginForm.value)).then((response: any) => {
                // set in cookies
                this.userAuthService.setRoles(response.user.role);
                this.userAuthService.setToken(response.jwtToken);

                this.userService.userInformation.user = response.user;

                this.showLoginDialog = false;
            }).catch(
                err => {
                    this.onLoginMsg = [
                        {severity:'error', summary:'Failed', detail:'Wrong Credentials'},
                    ];
                }
            );

        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    onHideDialog() {
        this.loginForm.reset();
        this.onLoginMsg = [];
    }

    onLogoutClicked() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to log out?',
            header: 'Logout',
            accept: () => {
                //Actual logic to perform a confirmation
                this.userAuthService.clear();
            }
        });
    }

}
