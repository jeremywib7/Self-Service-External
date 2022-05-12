import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../../service/order.service";
import {CartService} from "../../../service/cart.service";
import {environment} from "../../../../environments/environment";
import {UserAuthService} from "../../../service/user-auth.service";
import {Router} from "@angular/router";
import {OrderSteps} from "../../../model/OrderSteps";

@Component({
    selector: 'app-order-detail',
    templateUrl: './success-order.component.html',
    styleUrls: ['./success-order.component.scss']
})
export class SuccessOrderComponent implements OnInit {

    // global environment
    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    orderSteps: OrderSteps[] = [];

    constructor(
        public orderService: OrderService,
        public userAuthService: UserAuthService,
        public cartService: CartService,
        private router: Router
    ) {
        this.orderSteps = [
            {
                number: 1,
                name: 'Ordered',
                time: ''
            },
            {
                number: 2,
                name: 'Processing',
                time: ''
            },
            {
                number: 3,
                name: 'Waiting for pickup',
                time: ''
            },
            {
                number: 4,
                name: 'Completed',
                time: ''
            }
        ];

        (async () => {
            while (!userAuthService.isDoneLoadConfig)
                await new Promise(resolve => setTimeout(resolve, 1000));

            // check if customer has placed order but not paid yet
            if (cartService?.cart?.isPlacedInOrder && !orderService?.isInWaitingList ) {
                return this.router.navigate(["/order-pending"]).then(r => null);
            } else if (!cartService?.cart?.isPlacedInOrder) {
                // check if customer hasn't placed order yet
                return this.router.navigate(["/"]).then(r => null);
            }

        })();
    }

    ngOnInit(): void {
    }

}
