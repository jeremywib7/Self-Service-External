import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../service/cart.service";
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {OrderService} from "../../../service/order.service";
import {UserAuthService} from "../../../service/user-auth.service";
import {user} from "@angular/fire/auth";

@Component({
    selector: 'app-pending-order',
    templateUrl: './pending-order.component.html',
    styleUrls: ['./pending-order.component.scss']
})
export class PendingOrderComponent implements OnInit {

    // global environment
    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    constructor(
        public cartService: CartService,
        public orderService: OrderService,
        public userAuthService: UserAuthService,
        public router: Router
    ) {

        (async () => {
            while (!userAuthService.isDoneLoadConfig)
                await new Promise(resolve => setTimeout(resolve, 1000));

            // check if customer already put order and paid
            if (cartService?.cart?.isPlacedInOrder && orderService?.isInWaitingList ) {
                return this.router.navigate(["/order-success"]).then(r => null);
            } else if (!cartService?.cart?.isPlacedInOrder) {
                // check if customer hasn't placed order yet
                return this.router.navigate(["/"]).then(r => null);
            }

        })();
    }

    ngOnInit(): void {

    }

}
