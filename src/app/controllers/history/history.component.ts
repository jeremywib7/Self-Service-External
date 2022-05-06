import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../service/order.service";
import {HttpParams} from "@angular/common/http";
import Big from 'big.js';
import {UserAuthService} from "../../service/user-auth.service";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    constructor(
        public userAuthService: UserAuthService,
        public orderService: OrderService
    ) {
    }

    ngOnInit(): void {
    }

}
