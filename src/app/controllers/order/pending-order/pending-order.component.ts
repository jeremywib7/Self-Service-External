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

        // check if customer already paid
        (async () => {
            while (!userAuthService.isDoneLoadConfig)
                await new Promise(resolve => setTimeout(resolve, 1000));

            if (cartService?.cart?.isPlacedInOrder && orderService?.isInWaitingList ) {
                this.router.navigate(["/order-success"]).then(r => null);
            }})();

    }

    ngOnInit(): void {

    }

}
