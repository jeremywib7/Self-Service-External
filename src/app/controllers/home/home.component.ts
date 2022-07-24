import {Component, OnInit} from '@angular/core';
import {AppConfig} from "../../api/appconfig";
import {firstValueFrom, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {ConfigService} from "../../service/app.config.service";
import {ProductService} from "../../service/product.service";
import {QnaService} from "../../service/qna.service";
import {Qna} from "../../model/QnA";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    config: AppConfig;

    qna: Qna[] = [];

    selectedRow: number = 5;

    isLoadingQna: boolean = false;

    subscription: Subscription;

    constructor(
        public router: Router,
        public configService: ConfigService,
        private productService: ProductService,
        private qnaService: QnaService
    ) {

    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
        this.loadAllQna(0, 5).then(null);
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    async onPageQnaChange(event) {
        this.isLoadingQna = true;
        this.selectedRow = event.rows;
        const res: any = await firstValueFrom(this.qnaService.loadAllQna(event.page, event.rows));
        this.qna = res.data.content;
        this.isLoadingQna = false;
    }

    async loadAllQna(page?: number, size?: number) {
        this.isLoadingQna = true;
        const res: any = await firstValueFrom(this.qnaService.loadAllQna(page, size));
        this.qna = res.data.content;
        this.isLoadingQna = false;
    }
}
