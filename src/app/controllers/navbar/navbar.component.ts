import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AppConfig} from "../../api/appconfig";
import {Subscription} from "rxjs";
import {ConfigService} from "../../service/app.config.service";
import {FormGroup} from "@angular/forms";
import {UserAuthService} from "../../service/user-auth.service";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    config: AppConfig;

    subscription: Subscription;

    editMode: boolean = false;

    showLoginDialog: boolean = false;

    loginForm: FormGroup;

    constructor(public router: Router, public configService: ConfigService, public userAuthService: UserAuthService) {
    }


    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
    }

    isLoggedIn(): boolean {
        return !!this.userAuthService.isLoggedIn();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    openLoginDialog() {
        this.showLoginDialog = true;
    }
}
