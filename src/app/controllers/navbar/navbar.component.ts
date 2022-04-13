import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AppConfig} from "../../api/appconfig";
import {Subscription} from "rxjs";
import {ConfigService} from "../../service/app.config.service";
import {FormGroup} from "@angular/forms";
import {UserAuthService} from "../../service/user-auth.service";
import {ConfirmationService, MegaMenuItem, MenuItem} from "primeng/api";

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

    editMode: boolean = false;

    showLoginDialog: boolean = false;

    loginForm: FormGroup;

    constructor(public router: Router, public configService: ConfigService, public userAuthService: UserAuthService,
                private confirmationService: ConfirmationService) {
    }


    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
        this.initMenuUser();
        this.initMenuUser();
    }

    ngOnDestroy()
        :
        void {
        if (this.subscription
        ) {
            this.subscription.unsubscribe();
        }
    }


    initMenuUser() {
        this.userMenu = [
            {
                label: 'Edit',
                icon: 'pi pi-fw pi-pencil',
                items: [
                    {
                        label: 'Left',
                        icon: 'pi pi-fw pi-align-left'
                    },
                    {
                        label: 'Right',
                        icon: 'pi pi-fw pi-align-right'
                    },
                    {
                        label: 'Center',
                        icon: 'pi pi-fw pi-align-center'
                    },
                    {
                        label: 'Justify',
                        icon: 'pi pi-fw pi-align-justify'
                    },

                ]
            },
            {
                label: 'Events',
                icon: 'pi pi-fw pi-calendar',
                items: [
                    {
                        label: 'Edit',
                        icon: 'pi pi-fw pi-pencil',
                        items: [
                            {
                                label: 'Save',
                                icon: 'pi pi-fw pi-calendar-plus'
                            },
                            {
                                label: 'Delete',
                                icon: 'pi pi-fw pi-calendar-minus'
                            },

                        ]
                    },
                    {
                        label: 'Archieve',
                        icon: 'pi pi-fw pi-calendar-times',
                        items: [
                            {
                                label: 'Remove',
                                icon: 'pi pi-fw pi-calendar-minus'
                            }
                        ]
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

    initMenuCategory() {

    }

    isLoggedIn()
        :
        boolean {
        return !!this.userAuthService.isLoggedIn();
    }

    openLoginDialog() {
        this.showLoginDialog = true;
    }

    onLogoutClicked() {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to perform this action?',
            accept: () => {
                //Actual logic to perform a confirmation
            }
        });
    }
}
