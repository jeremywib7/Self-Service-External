import {Component, OnInit} from '@angular/core';
import {AppConfig} from "../../api/appconfig";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {ConfigService} from "../../service/app.config.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    config: AppConfig;

    subscription: Subscription;

    constructor(public router: Router, public configService: ConfigService) {
    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
    }

    ngOnDestroy(): void {
        if(this.subscription){
            this.subscription.unsubscribe();
        }
    }


}
