import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../service/order.service";
import {UserAuthService} from "../../service/user-auth.service";
import {environment} from "../../../environments/environment";
import {CustomerOrder} from "../../model/customerOrder/CustomerOrder";

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    todayDate: Date = new Date();
    dateFrom: Date;
    dateTill: Date;

    totalElements: number = 0;
    selectedRowSize: number = 5;

    constructor(
        public userAuthService: UserAuthService,
        public orderService: OrderService
    ) {
        this.dateFrom = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), 1);
        this.dateTill = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth() + 1, 0);
    }

    ngOnInit(): void {
        // view customer orders
        (async () => {
            while (this.userAuthService.customer['id'] === undefined)
                await new Promise(resolve => setTimeout(resolve, 1000));

            this.orderService.viewCustomerOrders(this.userAuthService.customer['id'], null, null, null, null).subscribe({
                next: (value: any) => {
                    this.totalElements =  value.data.totalElements;
                    this.orderService.customerOrders = value.data.content;
                }
            });
        })();
    }

    onDateFromChanged() {
        if (this.dateFrom == null) {
            this.dateFrom = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), 1);
        }
    }

    onDateTillChanged() {
        if (this.dateTill == null) {
            this.dateTill = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth() + 1, 0);
        }
    }

    onFilterDateHistory() {
        this.orderService.viewCustomerOrders(this.userAuthService.customer['id'], null, null, this.dateFrom, this.dateTill).subscribe({
            next: (value: any) => {
                this.orderService.customerOrders = value.data.content;
            }
        });
    }

    labelStatus(customerOrder: CustomerOrder): string {
        // order is finished
        if (customerOrder.orderFinished != null) {
            return "Completed";
        }

        // order processed
        if (customerOrder.orderProcessed != null) {
            return "Processing";
        }

        // order cancelled
        if (customerOrder.orderCancelled != null) {
            return "Cancelled";
        }

        return 'Waiting for payment';
    }

    backgroundStatus(customerOrder: CustomerOrder) {

        // order is finished
        if (customerOrder.orderFinished != null) {
            return "p-button-success";
        }

        // order processed
        if (customerOrder.orderProcessed != null) {
            return "p-button-info";
        }

        // order cancelled
        if (customerOrder.orderCancelled != null) {
            return "p-button-danger";
        }

        // waiting for payment
        return "p-button-warning";

        // switch (status) {
        //     case "Completed":
        //         return "p-button-success";
        //     case "Processing":
        //         return "p-button-info";
        //     case "Waiting for payment":
        //         return "p-button-warning";
        //     case "Cancelled":
        //         return "p-button-danger";
        //     default :
        //         return "bg-primary";
        // }
    }

    changePagination(event) {
        this.selectedRowSize = event.rows;
        this.orderService.viewCustomerOrders(this.userAuthService.customer['id'], event.page, event.rows, this.dateFrom, this.dateTill).subscribe({
            next: (value: any) => {
                this.orderService.customerOrders = value.data.content;
            }
        });
    }

}
