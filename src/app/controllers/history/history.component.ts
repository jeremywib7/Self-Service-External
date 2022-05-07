import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../service/order.service";
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
        // view customer orders

        (async () => {
            while (this.userAuthService.customer['id'] === undefined)
                await new Promise(resolve => setTimeout(resolve, 1000));

            this.orderService.viewCustomerOrders(this.userAuthService.customer['id']).subscribe({
                next: (value: any) => {
                    this.orderService.customerOrders = value.data;
                    console.log(value.data);
                }
            });

        })();


    }

    backgroundStatus(status: string) {
        switch (status) {
            case "Completed":
                return "p-button-success";
            case "Processing":
                return "p-button-info";
            case "Waiting for payment":
                return "p-button-warning";
            case "Cancelled":
                return "p-button-danger";
            default :
                return "bg-primary";
        }
    }

}
