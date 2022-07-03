import {Component, OnInit} from '@angular/core';
import {AppConfig} from "../../api/appconfig";
import {firstValueFrom, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {ConfigService} from "../../service/app.config.service";
import {ProductService} from "../../service/product.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    config: AppConfig;

    subscription: Subscription;

    constructor(
        public router: Router,
        public configService: ConfigService,
        private productService: ProductService
    ) {

    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });

        // this.loadBestSellerProduct().then(null);

    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    async loadBestSellerProduct() {
        const res: any = await firstValueFrom(this.productService.loadBestSeller());
        console.log(res);
    }


}
